import React, { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';
import { copyToClipboard } from '../../utils/clipboard';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
}) => {
  const [copied, setCopied] = useState(false);
  const { t } = useDocs();

  const handleCopy = async () => {
    const success = await copyToClipboard(code);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.trim().split('\n');

  return (
    <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-md dark:shadow-xl overflow-hidden my-4 group">
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-brand-400" />
          {filename ? (
            <span className="font-mono text-slate-200 font-medium">{filename}</span>
          ) : (
            <span className="uppercase tracking-wider font-semibold text-slate-400">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-brand-600/30 text-slate-300 hover:text-brand-300 transition-colors shadow-2xs"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">{t.copied}</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>{t.copyCode}</span>
            </>
          )}
        </button>
      </div>

      {/* Code body */}
      <div className="p-4 overflow-x-auto font-mono text-xs md:text-sm leading-relaxed text-slate-200">
        <pre className="table w-full">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-slate-900/60 transition-colors">
              {showLineNumbers && (
                <span className="table-cell pr-4 text-right select-none text-slate-600 font-mono text-xs w-8">
                  {idx + 1}
                </span>
              )}
              <span className="table-cell whitespace-pre">{line}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
