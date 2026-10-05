import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';

/** Safe markdown (no raw HTML). Internal links stay inside the SPA. */
export default function Markdown({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = '', children: c }) =>
            href.startsWith('/') ? (
              <Link to={href}>{c}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer nofollow">
                {c}
              </a>
            ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
