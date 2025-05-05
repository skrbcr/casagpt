"use client";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from "react";
import { ChatInput } from "@/components/chat-input";
import { ChatMessage } from "@/components/chat-message";
import { parseMarkdown } from "@/lib/parseMarkdown";
import 'katex/dist/katex.min.css';
import 'prism-themes/themes/prism-vsc-dark-plus.css';
import Main from "@/components/main";
import { AppSidebar } from "@/components/app-sidebar";
import { type Thread } from "@/types/thread";
import { useSearchParams, useRouter } from 'next/navigation';
import { Menu } from "lucide-react";

interface HomeClientProps {
  initialThreadId?: string;
  shareMode?: boolean;
  initialThreadTitle?: string;
  initialIsShared?: boolean;
}

type Message = {
  id: string;
  thread_id: string;
  role: 'user' | 'ai';
  content: string;
  responses_id?: string;
  created_at: string;
  contentHtml?: string;
};

export default function HomeClient({
  initialThreadId,
  shareMode = false,
  initialThreadTitle,
  initialIsShared = false,
}: HomeClientProps) {
  // thread state
  const searchParams = useSearchParams();
  const router = useRouter();
  // Determine threadId: either c= or share=
  const cParam = searchParams.get('c');
  const shareParam = searchParams.get('share');
  const threadId = cParam ?? shareParam ?? initialThreadId;
  const isShareMode = shareMode;
  // local shared state (updated after sharing)
  const [isSharedState, setIsSharedState] = useState<boolean>(initialIsShared);
  // title state
  const [threadTitle, setThreadTitle] = useState<string | undefined>(initialThreadTitle);
  const [messages, setMessages] = useState<Message[]>([]);
  // Sync title/share state when initial props change (e.g., navigating to another thread)
  useEffect(() => {
    setThreadTitle(initialThreadTitle);
    setIsSharedState(initialIsShared);
  }, [initialThreadTitle, initialIsShared]);
  const [isLoading, setIsLoading] = useState(false);
  const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  // Fetch threads when not in shared-only view
  const { data: threadsRaw, error: threadsError } = useSWR(!isShareMode ? '/api/threads' : null, fetcher);

  const threads: Thread[] = threadsRaw ?? [];
  let threadsMessage: string | undefined;
  if (!threadsRaw && !threadsError && !isShareMode) {
    threadsMessage = 'Loading threads...';
  }
  if (threadsError) {
    threadsMessage = 'Failed to load threads';
  }

  // Fetch messages for current thread
  const messagesKey = threadId ? `/api/messages?thread_id=${threadId}` : null;
  const { data: messagesData } = useSWR(messagesKey, fetcher);

  // Parse messages and set previousResponseId on load
  useEffect(() => {
    if (messagesData) {
      (async () => {
        const parsed = await Promise.all(
          messagesData.map(async (m: Message) => {
            if (m.role === 'ai') {
              const html = await parseMarkdown(m.content);
              return { ...m, contentHtml: html };
            }
            return m;
          }),
        );
        setMessages(parsed);
        // Set previousResponseId from last AI message
        const lastAI = [...messagesData]
          .reverse()
          .find((m: Message) => m.role === 'ai' && m.responses_id);
        setPreviousResponseId(lastAI?.responses_id ?? null);
      })();
    } else {
      setMessages([]);
      setPreviousResponseId(null);
    }
  }, [messagesData]);

  // Delete thread handler
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this thread?')) return;
    const res = await fetch(`/api/threads/${id}`, { method: 'DELETE' });
    if (res.ok) {
      mutate('/api/threads');
      if (threadId === id) router.push('/');
    } else {
      console.error('Failed to delete thread');
    }
  };
  // Rename thread handler
  const handleRename = async (id: string, currentTitle: string) => {
    const newTitle = prompt('Enter new thread title:', currentTitle);
    if (newTitle === null) return;
    const titleTrimmed = newTitle.trim();
    if (!titleTrimmed) return;
    const res = await fetch(`/api/threads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: titleTrimmed }),
    });
    if (res.ok) {
      mutate('/api/threads');
      if (threadId === id) setThreadTitle(titleTrimmed);
    } else {
      console.error('Failed to rename thread');
    }
  };

  // Share thread handler
  const handleShare = async () => {
    if (!threadId) return;
    const res = await fetch(`/api/threads/${threadId}/share`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_shared: true }),
    });
    const data = await res.json();
    if (res.ok) {
      // mark as shared in UI
      setIsSharedState(true);
      try {
        await navigator.clipboard.writeText(window.location.origin + data.share_url);
        alert('Copied share URL to clipboard');
      } catch {
        console.warn('Clipboard write failed');
      }
    } else {
      console.error('Share failed', data.error);
    }
  };

  // Send message handler
  const handleSend = async (input: string) => {
    if (!input.trim() || isLoading || isShareMode) return;
    setIsLoading(true);
    let currentThreadId = threadId;
    // Create a new thread if none selected
    if (!currentThreadId) {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Untitled' }),
      });
      const data = await res.json();
      if (res.ok) {
        // Optimistically update the threads list in the sidebar
        mutate('/api/threads', (threads: Thread[] = []) => [
          { id: data.id, title: data.title, is_shared: data.is_shared, created_at: data.created_at, updated_at: data.updated_at },
          ...threads,
        ], false);
        // Set current thread and navigate
        currentThreadId = data.id;
        setThreadTitle(data.title);
        router.push(`/?c=${currentThreadId}`);
      } else {
        console.error('Failed to create thread', data.error);
        setIsLoading(false);
        return;
      }
    }
    // Post user message
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ thread_id: currentThreadId, role: 'user', content: input }),
    });
    await mutate(`/api/messages?thread_id=${currentThreadId}`);
    // Fetch AI response
    try {
      const openaiRes = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input, previous_response_id: previousResponseId }),
      });
      const openaiData = await openaiRes.json();
      if (openaiData.result) {
        const aiText = openaiData.result.output_text;
        const aiId = openaiData.result.id;
        await fetch('/api/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ thread_id: currentThreadId, role: 'ai', content: aiText, responses_id: aiId }),
        });
        await mutate(`/api/messages?thread_id=${currentThreadId}`);
      }
    } catch (err) {
      console.error('OpenAI error', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Main>
      <div className="flex flex-1 min-w-0 overflow-visible sm:overflow-hidden">
        {!isShareMode && (
          <>
            <div className="hidden sm:flex">
              <AppSidebar
                chatThreads={threads}
                message={threadsMessage}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            </div>
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 flex">
                <div
                  className="fixed inset-0 bg-black opacity-50"
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="relative">
                  <AppSidebar
                    chatThreads={threads}
                    message={threadsMessage}
                    onDelete={handleDelete}
                    onRename={handleRename}
                  />
                </div>
              </div>
            )}
          </>
        )}
        <div className="flex flex-col flex-1 min-h-0 min-w-0">
          <div className="p-4 flex items-center justify-between bg-[var(--background)] border-b">
            <div className="flex items-center">
              {!isShareMode && (
                <button
                  className="mr-2 sm:hidden"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="w-6 h-6" />
                </button>
              )}
              <h2 className="text-lg font-semibold">
                {threadTitle ?? (threadId ? 'Conversation' : 'New Conversation')}
              </h2>
            </div>
            {threadId && (
              isSharedState || isShareMode ? (
                <button onClick={async () => {
                  await handleShare();
                }} className="text-sm text-blue-500 hover:underline">
                  <span className="text-sm italic">This thread is shared.</span>
                </button>
              ) : (
                <button onClick={async () => {
                  await handleShare();
                }} className="text-sm text-blue-500 hover:underline">
                  Share
                </button>
              )
            )}
          </div>
          <div className="flex-1 overflow-y-auto space-y-2 p-4">
            <div className="max-w-screen-lg mx-auto">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  role={msg.role}
                  contentHtml={msg.contentHtml}
                  raw={msg.content}
                />
              ))}
              {isLoading && <ChatMessage role="ai" contentHtml="<p>Thinking...</p>" />}
            </div>
          </div>
          <div className="border-t px-4 py-3 sticky bottom-0 w-full bg-[var(--background)]">
            <div className="max-w-screen-lg mx-auto">
              <ChatInput onSend={handleSend} disabled={isLoading || isShareMode} />
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
}
