import ReactMarkdown from 'react-markdown';
import { CSSProperties } from 'react';

// Define consistent markdown styles
const markdownStyles: Record<string, CSSProperties> = {
  pre: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: '0.375rem',
    padding: '0.75rem',
    overflow: 'auto',
    fontSize: '0.875rem',
    margin: '0.75rem 0',  // Increased margin
    direction: 'ltr' as const,
    display: 'block',     // Ensure block display
    width: '100%',        // Full width
    whiteSpace: 'pre-wrap' as const,
  },
  code: {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    fontSize: '0.875rem',
    direction: 'ltr' as const,
  },
  p: {
    margin: '0.5rem 0',
    display: 'block', // Ensure paragraphs are displayed as blocks
  },
  'ul, ol': {
    paddingLeft: '1.25rem',
    margin: '0.5rem 0',
  },
  'h1, h2, h3, h4, h5, h6': {
    margin: '0.75rem 0 0.5rem 0',
    lineHeight: '1.25',
    display: 'block', // Ensure headings are displayed as blocks
    width: '100%',
  },
  h1: { fontSize: '1.25rem', fontWeight: 'bold' },
  h2: { fontSize: '1.125rem', fontWeight: 'bold' },
  h3: { fontSize: '1rem', fontWeight: 'bold' },
  blockquote: {
    borderLeft: '3px solid #e2e8f0',
    paddingLeft: '0.75rem',
    fontStyle: 'italic',
    margin: '0.5rem 0',
  },
  a: {
    color: '#3b82f6',
    textDecoration: 'underline',
  },
  table: {
    borderCollapse: 'collapse' as const,
    width: '100%',
    margin: '0.5rem 0',
  },
  'th, td': {
    border: '1px solid #e2e8f0',
    padding: '0.25rem 0.5rem',
    textAlign: 'left' as const,
  },
};

// Helper function to detect RTL languages
function isRTLLanguage(text: string): boolean {
  const rtlChars = /[\u0591-\u07FF\u200F\u202B\u202E\uFB1D-\uFDFD\uFE70-\uFEFC]/;
  return rtlChars.test(text);
}

// Helper function for language-specific styles
function getLanguageSpecificStyles(content: string): CSSProperties {
  // Devanagari Unicode range (for Hindi and other Indian languages)
  if (/[\u0900-\u097F]/.test(content)) {
    return {
      fontSize: '1.05em',
      lineHeight: '1.6'
    };
  }
  return {};
}

// Function to normalize code blocks, especially at the beginning
function normalizeMarkdown(content: string): string {
  // Ensure proper spacing around code blocks
  let normalized = content;
  
  // Fix improper code block syntax at beginning
  // If the content starts with ``` but doesn't have a newline before it
  if (normalized.trim().startsWith('```') && !normalized.startsWith('\n```')) {
    normalized = '\n' + normalized;
  }
  
  // Fix code blocks that don't have proper spacing
  normalized = normalized.replace(/([^\n])```/g, '$1\n```');
  normalized = normalized.replace(/```([^\n])/g, '```\n$1');
  
  // Ensure language identifier is properly separated
  normalized = normalized.replace(/```(\w+)([^\n])/g, '```$1\n$2');
  
  // Handle special case of triple backticks with no language specification
  normalized = normalized.replace(/```\n([^`])/g, '```\n\n$1');
  
  return normalized;
}

interface MarkdownRendererProps {
  content: string;
  dir?: 'auto' | 'ltr' | 'rtl';
}

export function MarkdownRenderer({ content, dir }: MarkdownRendererProps) {
  // Auto-detect direction if not specified
  const textDirection = dir || (isRTLLanguage(content) ? 'rtl' : 'ltr');
  const langStyles = getLanguageSpecificStyles(content);
  
  // Normalize the markdown content to ensure proper code block rendering
  const normalizedContent = normalizeMarkdown(content);
  
  return (
    <div 
      style={{
        ...langStyles,
        // Add global styles for code elements
        '--code-font-family': 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        '--code-font-size': '0.875rem',
      } as CSSProperties} 
      className="prose prose-lg dark:prose-invert max-w-none markdown-content" 
      dir={textDirection}
    >
      <style jsx>{`
        .markdown-content pre {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 0.375rem;
          padding: 0.75rem;
          overflow: auto;
          font-size: 0.875rem;
          margin: 0.75rem 0;
          direction: ltr;
          display: block;
          width: 100%;
          white-space: pre-wrap;
        }
        
        .markdown-content code {
          font-family: var(--code-font-family);
          font-size: var(--code-font-size);
          direction: ltr;
          padding: 0.1rem 0.2rem;
          border-radius: 0.25rem;
        }
        
        .markdown-content p {
          display: block;
        }
        
        .markdown-content h1, 
        .markdown-content h2, 
        .markdown-content h3, 
        .markdown-content h4, 
        .markdown-content h5, 
        .markdown-content h6 {
          display: block;
          width: 100%;
        }
      `}</style>
      <ReactMarkdown>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
} 