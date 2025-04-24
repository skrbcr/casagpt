# ChatGPT for CASA

An AI-powered web application for radio astronomy data analysis. ChatGPT for CASA combines OpenAI's ChatGPT capabilities with CASA (Common Astronomy Software Applications) documentation and custom analysisUtils tools to help you generate CASA scripts via natural language.

**Live Demo:** https://casagpt.akimasanishida.com

## Features

- Uses OpenAI's `o4-mini` model for advanced reasoning and code generation.
- Indexes CASA and `analysisUtils` documentation for precise CASA workflows.
- Provides ready-to-run CASA code snippets and explanations.
- Ideal for astronomers working with radio interferometry data.

## Request Access

Access is currently limited to collaborators. To request an account, please contact the project maintainer.

## Usage

1. Navigate to the Live Demo at https://casagpt.akimasanishida.com and log in with your account.
2. Enter your question in natural language, for example:
   - "How do I calibrate VLA data at 1.4 GHz?"
   - "Show me an example of continuum imaging."
3. Copy the generated code snippet and explanation into your CASA session.

## Local Development

### Prerequisites

- Node.js (>= 16.x)
- npm, yarn, or pnpm
- OpenAI API key
- Vector store ID containing CASA and analysisUtils docs (obtain from the maintainer)

### Setup

```bash
git clone https://github.com/skrbcr/casagpt.git
cd casagpt
```

Create a file named `.env.local` in the project root with:
```env
OPENAI_API_KEY=your_openai_api_key
VECTOR_STORE_ID=your_vector_store_id
```

Install dependencies and start the development server:
```bash
# using npm
npm install
npm run dev

# using yarn
 yarn install
 yarn dev

# using pnpm
 pnpm install
 pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Contributing

Contributions are welcome! Please open issues or pull requests on GitHub.

## License

See [LICENSE](LICENSE) for details.

## Repository

https://github.com/skrbcr/casagpt
