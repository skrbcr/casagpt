import type { Metadata } from "next";
import Main from "@/components/main";

export const metadata: Metadata = {
  title: "About",
  description: "About ChatGPT for CASA.",
};

export default function About() {
  return (
    <Main>
      <div className="flex-1 space-y-2 max-w-screen-lg w-full mx-auto mt-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">About</h2>
          <p>
            <strong>ChatGPT for CASA</strong> is an AI assistant powered by OpenAI&apos;s ChatGPT and enhanced with CASA documentation and <code>analysisUtils</code> library. It uses the <code>o4-mini</code> model, one of OpenAI&apos;s state-of-the-art language models.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Account Creation</h3>
          <p>
            To use ChatGPT for CASA, you need an account. Access is currently limited to our collaborators. Please contact me directly if you would like access; I’ll set up an account for you and send your login details.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">How to use</h3>
          <p>
            Simply type your question into the chat interface. For example: &quot;Create a script to automate the continuum imaging.&quot; or &quot;What can be used to automatically determine the imsize and cell of tclean?&quot; The tool will return a code snippet and an explanation that you can run in your CASA session.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Notification</h3>
          <p>
            The conversation history is not saved, so <strong>if you refresh the page or move to another page, the conversation will be lost</strong>. Sorry for the inconvenience, but please remind this point.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Limitations</h3>
          <p>
            While this tool can streamline your workflow, it’s not perfect. Always review and test the suggested code with your own data. When in doubt, refer to the official CASA documentation or consult your advisor.
          </p>
        </section>
        <section>
          <h3 className="text-xl font-semibold mb-2">Contact</h3>
          <p>
            You can find the source code for this web application on <a href="https://github.com/skrbcr/casagpt" target="_blank" rel="noopener noreferrer">GitHub</a>.
          </p>
        </section>
      </div>
    </Main>
  );
}
