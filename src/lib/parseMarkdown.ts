import matter from "gray-matter";
import { remark } from "remark"
import gfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from 'rehype-prism-plus';
import rehypeSlug from "rehype-slug";

export async function parseMarkdown(message: string) {
  const { content } = matter(message);
  const processedContent = await remark()
    .use(remarkParse)
      .use(gfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeKatex)
      .use(rehypePrism)
      .use(rehypeStringify)
      .process(content);
    const contentHtml = processedContent.toString();

  return contentHtml;
}
