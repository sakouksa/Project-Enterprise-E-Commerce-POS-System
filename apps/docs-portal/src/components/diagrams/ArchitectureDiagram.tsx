import React, { useState } from 'react';
import { ARCHITECTURE_LAYERS } from '../../data/architectureData';
import { useDocs } from '../../stores/useDocsStore';
import { Sparkles } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  const { language } = useDocs();
  const [activeLayerId, setActiveLayerId] = useState<string>(ARCHITECTURE_LAYERS[0].id);

  const activeLayer = ARCHITECTURE_LAYERS.find(l => l.id === activeLayerId) || ARCHITECTURE_LAYERS[0];

  const titles: Record<string, string> = {
    km: 'ស្ថាបត្យកម្មប្រព័ន្ធ ៦ ស្រទាប់ពេញលេញ',
    en: 'Unified Enterprise 6-Layer Architecture',
    th: 'สถาปัตยกรรมระบบองค์กรแบบรวมศูนย์ 6 เลเยอร์',
    vi: 'Kiến trúc Doanh nghiệp Hợp nhất 6 Tầng',
    zh: '企业级统一6层分层系统架构',
  };

  const badgeLabels: Record<string, string> = {
    km: 'កម្មវិធីរុករកស្ថាបត្យកម្មអន្តរកម្ម ៦ ស្រទាប់',
    en: 'Interactive 6-Layer Architecture Explorer',
    th: 'เครื่องมือสำรวจสถาปัตยกรรมแบบโต้ตอบ 6 เลเยอร์',
    vi: 'Khám phá Kiến trúc Tương tác 6 Tầng',
    zh: '交互式6层系统架构全景解析器',
  };

  const hintLabels: Record<string, string> = {
    km: 'ចុចលើស្រទាប់ណាមួយដើម្បីពិនិត្យសមាសធាតុ និងទំនួលខុសត្រូវ',
    en: 'Click any layer below to inspect components & responsibilities',
    th: 'คลิกเลเยอร์ด้านล่างเพื่อตรวจสอบคอมโพเนนต์และหน้าที่รับผิดชอบ',
    vi: 'Nhấp vào bất kỳ tầng nào bên dưới để kiểm tra các thành phần & trách nhiệm',
    zh: '点击下方任意分层可展开查看核心组件职责与技术实现',
  };

  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 p-6 md:p-8 shadow-md dark:shadow-2xl my-8 backdrop-blur-xl transition-colors duration-200">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-800 flex-wrap gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{badgeLabels[language] || badgeLabels.en}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
            {titles[language] || titles.en}
          </h3>
        </div>
        <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
          {hintLabels[language] || hintLabels.en}
        </div>
      </div>

      {/* Interactive Layer Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5 mb-8">
        {ARCHITECTURE_LAYERS.map((layer) => {
          const isActive = layer.id === activeLayerId;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayerId(layer.id)}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden ${
                isActive
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-600/15 shadow-md shadow-brand-500/10 scale-[1.02]'
                  : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/60 hover:border-slate-300 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center ${
                  isActive ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                }`}>
                  0{layer.number}
                </span>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
              </div>
              <div className={`text-xs font-bold truncate w-full ${isActive ? 'text-brand-700 dark:text-white' : 'text-slate-800 dark:text-slate-300'}`}>
                {language === 'km' ? (layer.nameKh.split(' ')[0] + ' ' + (layer.nameKh.split(' ')[1] || '')) : (layer.name.split(' ')[0] + ' ' + (layer.name.split(' ')[1] || ''))}
              </div>
            </button>
          );
        })}
      </div>

      {/* Layer Detail Inspector */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80 p-6 shadow-inner">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-brand-100 dark:bg-brand-500/20 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                LAYER 0{activeLayer.number}
              </span>
              <h4 className="text-lg md:text-xl font-bold text-slate-900 dark:text-slate-100">
                {language === 'km' ? activeLayer.nameKh : activeLayer.name}
              </h4>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
              {language === 'km' ? activeLayer.descriptionKh : activeLayer.description}
            </p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {activeLayer.technologies.map((tech, i) => (
              <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-white dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 shadow-2xs">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {activeLayer.components.map((comp, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/90 hover:border-brand-500/40 transition-colors shadow-2xs">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <h5 className="text-sm font-bold text-slate-900 dark:text-slate-100">{comp.name}</h5>
              </div>
              <p className="text-xs text-brand-600 dark:text-brand-400 font-semibold mb-1">
                {language === 'km' ? comp.roleKh : comp.role}
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{comp.details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
