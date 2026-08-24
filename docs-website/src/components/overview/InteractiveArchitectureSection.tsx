import React, { useState } from 'react';
import { useDocs } from '../../stores/useDocsStore';
import { ARCHITECTURE_LAYERS } from '../../data/architectureData';
import { Link } from 'react-router-dom';
import {
  Layers,
  ArrowRight,
  Shield,
  Cpu,
  Database,
  Radio,
  Server,
  Code2,
  CheckCircle2,
  Lock,
  Zap,
  Globe
} from 'lucide-react';

export const InteractiveArchitectureSection: React.FC = () => {
  const { language } = useDocs();
  const [selectedLayerId, setSelectedLayerId] = useState<string>('layer-1-presentation');

  const layerIcons = [Globe, Radio, Shield, Cpu, Database, Server];

  const selectedLayer = ARCHITECTURE_LAYERS.find((l) => l.id === selectedLayerId) || ARCHITECTURE_LAYERS[0];

  return (
    <section id="system-architecture" className="mb-14 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center text-xs font-mono font-bold">
            02
          </span>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
            Architecture Blueprint
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'ស្ថាបត្យកម្ម ៦ ស្រទាប់នៃប្រព័ន្ធ (6-Tier Architecture)' : 'Interactive 6-Tier Architecture Map'}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-3xl font-normal">
          {language === 'km'
            ? 'ចុចលើស្រទាប់នីមួយៗក្នុងដ្យាក្រាមដើម្បីពិនិត្យមើលមុខងារ តក្កវិជ្ជា បច្ចេកវិទ្យា និងរបៀបដែលស្រទាប់នីមួយៗទាក់ទងគ្នា'
            : 'Click any architectural tier in the stack below to explore its responsibilities, underlying technologies, and isolated domain services.'}
        </p>
      </div>

      {/* Visual Interactive Stack Diagram */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 6 Selectable Stack Tiers */}
        <div className="lg:col-span-5 space-y-2.5">
          {ARCHITECTURE_LAYERS.map((layer, idx) => {
            const Icon = layerIcons[idx % layerIcons.length];
            const isSelected = selectedLayerId === layer.id;

            return (
              <button
                key={layer.id}
                onClick={() => setSelectedLayerId(layer.id)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'border-brand-500 bg-white dark:bg-slate-900 shadow-md ring-2 ring-brand-500/20'
                    : 'border-slate-200/80 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border text-xs font-mono font-bold ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    0{layer.number}
                  </div>

                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {language === 'km' ? layer.nameKh : layer.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 truncate">
                      {layer.technologies.slice(0, 2).join(' • ')}
                    </div>
                  </div>
                </div>

                <div className={`w-2 h-2 rounded-full shrink-0 ${isSelected ? 'bg-brand-500 animate-pulse' : 'bg-transparent'}`} />
              </button>
            );
          })}
        </div>

        {/* Right: Selected Layer Deep Dive Card */}
        <div className="lg:col-span-7">
          <div className="h-full p-6 sm:p-7 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/90 shadow-sm dark:shadow-xl backdrop-blur-xl flex flex-col justify-between space-y-6">
            <div>
              {/* Layer Title & Badge */}
              <div className="flex items-start justify-between flex-wrap gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30">
                      Tier 0{selectedLayer.number} Architecture
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {language === 'km' ? selectedLayer.nameKh : selectedLayer.name}
                  </h3>
                </div>

                <Link
                  to="/architecture"
                  className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 shrink-0"
                >
                  <span>Full Architecture Doc</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Layer Description */}
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-4 font-normal">
                {language === 'km' ? selectedLayer.descriptionKh : selectedLayer.description}
              </p>

              {/* Technologies in this Layer */}
              <div className="mt-5 space-y-2">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">
                  Verified Technologies & Frameworks
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedLayer.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono font-bold px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Core Components */}
              <div className="mt-6 space-y-3">
                <div className="text-[11px] font-mono font-bold uppercase text-slate-400">
                  Key Component Responsibilities
                </div>
                <div className="space-y-2.5">
                  {selectedLayer.components.map((comp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200/80 dark:border-slate-800/80"
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100 mb-0.5">
                        <span>{comp.name}</span>
                        <span className="text-[10px] font-normal text-slate-500">
                          {language === 'km' ? comp.roleKh : comp.role}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-mono">
                        {comp.details}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Single source of truth via Laravel 12 & PostgreSQL 18</span>
              <Link
                to="/api"
                className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                <span>Inspect 759 APIs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
