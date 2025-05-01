import type { Metadata } from "next";
import Main from "@/components/main";
import { H2, H3 } from "@/components/hx";

export const metadata: Metadata = {
  title: "About",
  description: "About ChatGPT for CASA.",
};

export default function About() {
  return (
    <Main>
      <div className="flex-1 space-y-2 max-w-screen-lg w-full mx-auto mt-8">
        <section>
          <H2>About</H2>
          <p>
            <strong>ChatGPT for CASA</strong> is an AI assistant powered by OpenAI&apos;s ChatGPT and enhanced with CASA documentation and <code>analysisUtils</code> library. It uses the <code>GPT-4.1</code> model, one of OpenAI&apos;s smart language models.
          </p>
        </section>
        <section>
          <H3>Account Creation</H3>
          <p>
            To use ChatGPT for CASA, you need an account. Access is currently limited to our collaborators. Please contact me directly if you would like access; I’ll send you an invitation e-mail.
          </p>
        </section>
        <section>
          <H3>How to use</H3>
          <p>
            Simply type your question into the chat interface. For example: &quot;Create a script to automate the continuum imaging.&quot; or &quot;What can be used to automatically determine the imsize and cell of tclean?&quot; The tool will return a code snippet and an explanation that you can run in your CASA session.
          </p>
        </section>
        <section>
          <H3>Features</H3>
          <p>
            The conversation history is saved as threads. You can create new threads, rename them, and delete them. The tool also supports sharing threads with others with clicking the share button on the top right corner of the thread.
          </p>
        </section>
        <section>
          <H3>Privacy Policy & Data Usage</H3>
          <p>
            This web application uses essential cookies required for authentication (provided by Supabase). No optional or tracking cookies are used.
          </p>
          <p>
            Please be aware that both the maintainer (<strong>Akimasa Nishida</strong>) and OpenAI may access your queries and the AI&apos;s responses. Your interactions might also be used to improve the model&apos;s performance by OpenAI.
          </p>
        </section>
        <section>
          <H3>Data Privacy</H3>
          <p>
            Do <strong>NOT</strong> input sensitive or private information.
          </p>
        </section>
        <section>
          <H3>Limitations & Disclaimer</H3>
          <p>
            While this tool can streamline your workflow, it&apos;s not perfect. Always review and test the suggested code with your own data. The maintainer and OpenAI assume no liability for any issues arising from the use of the generated content.
          </p>
        </section>
        <section>
          <H3>Contact</H3>
          <p>
            You can find the source code for this web application on <a href="https://github.com/skrbcr/casagpt" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </p>
          <p>
            <strong>Author & Maintainer:</strong> <a href="mailto:akimasa@akimasanishida.com">Akimasa NISHIDA</a>.
          </p>
        </section>
      </div>
    </Main>
  );
}
