import React from 'react';
import { ArrowDown, CheckCircle2, ShieldCheck, Database, Layers, Radio, Sparkles } from 'lucide-react';
import { useDocs } from '../../stores/useDocsStore';

interface BehindTheButtonProps {
  actionName: string;
  steps: {
    layer: 'UI / Frontend' | 'API Request' | 'Middleware / Auth' | 'Controller' | 'Service Layer' | 'DB Transaction' | 'Event / Queue' | 'UI Response';
    detail: string;
    codeSnippet?: string;
  }[];
}

export const BehindTheButton: React.FC<BehindTheButtonProps> = ({ actionName, steps }) => {
  const { language } = useDocs();

  const getLayerBadge = (layer: string) => {
    switch (layer) {
      case 'UI / Frontend':
        return { color: 'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border-sky-200 dark:border-sky-500/30', icon: Layers };
      case 'API Request':
        return { color: 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30', icon: Radio };
      case 'Middleware / Auth':
        return { color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-500/30', icon: ShieldCheck };
      case 'Controller':
      case 'Service Layer':
        return { color: 'bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/30', icon: Sparkles };
      case 'DB Transaction':
        return { color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30', icon: Database };
      case 'Event / Queue':
        return { color: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30', icon: Radio };
      default:
        return { color: 'bg-slate-50 dark:bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-500/30', icon: CheckCircle2 };
    }
  };

  return (
    <div className="rounded-3xl border border-brand-500/20 bg-white dark:bg-slate-900/60 p-6 md:p-8 shadow-md dark:shadow-2xl my-6 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 flex items-center justify-center text-brand-600 dark:text-brand-400 shadow-2xs">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {language === 'km' ? 'តើមានអ្វីកើតឡើងនៅពីក្រោយប៊ូតុង?' : 'What Happens Behind the Button?'}
          </h4>
          <p className="text-xs text-brand-600 dark:text-brand-400 font-mono font-semibold">{actionName}</p>
        </div>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => {
          const { color, icon: Icon } = getLayerBadge(step.layer);
          const isLast = idx === steps.length - 1;

          return (
            <div key={idx} className="relative">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 hover:border-brand-500/40 transition-colors shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-brand-600 dark:text-brand-400 shrink-0 shadow-xs">
                  0{idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border shadow-2xs ${color}`}>
                      <Icon className="w-3 h-3" />
                      {step.layer}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step.detail}</p>
                  {step.codeSnippet && (
                    <div className="mt-2.5 p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800">
                      {step.codeSnippet}
                    </div>
                  )}
                </div>
              </div>

              {!isLast && (
                <div className="flex justify-center my-1.5">
                  <ArrowDown className="w-4 h-4 text-slate-400 dark:text-slate-600 animate-bounce" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
