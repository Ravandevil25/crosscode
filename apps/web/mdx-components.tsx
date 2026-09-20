import type { MDXComponents } from "mdx/types";
import Link from "next/link";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="mb-4 break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mt-8 mb-4 break-words text-xl font-semibold tracking-tight text-foreground sm:text-2xl" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-6 mb-3 break-words text-lg font-semibold text-foreground sm:text-xl" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className="mb-4 break-words text-muted-foreground leading-7" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mb-4 ml-5 list-disc space-y-2 break-words text-muted-foreground sm:ml-6" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-5 list-decimal space-y-2 break-words text-muted-foreground sm:ml-6" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),
    code: ({ children, ...props }) => (
      <code className="break-words rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-foreground" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="mb-4 max-w-full overflow-x-auto rounded-lg border bg-muted p-4 text-sm" {...props}>
        {children}
      </pre>
    ),
    a: ({ children, href, ...props }) => {
      if (href?.startsWith("/")) {
        return (
          <Link href={href} className="text-primary underline underline-offset-4 hover:text-primary/80" {...props}>
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-4 hover:text-primary/80"
          target={href?.startsWith("http") ? "_blank" : undefined}
          rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
          {...props}
        >
          {children}
        </a>
      );
    },
    table: ({ children, ...props }) => (
      <div className="mb-4 max-w-full overflow-x-auto">
        <table className="w-full min-w-[480px] border-collapse border text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="border px-4 py-2 text-left font-semibold bg-muted" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border px-4 py-2 text-muted-foreground" {...props}>
        {children}
      </td>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="mb-4 border-l-4 border-primary pl-4 italic text-muted-foreground" {...props}>
        {children}
      </blockquote>
    ),
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-foreground" {...props}>
        {children}
      </strong>
    ),
    ...components,
  };
}
