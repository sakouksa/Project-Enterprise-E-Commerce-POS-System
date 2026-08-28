import React from 'react';
import { Link } from 'react-router-dom';
import { useDocs } from '../../stores/useDocsStore';

interface BrandLogoProps {
  to?: string;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  to = '/',
  size = 'md',
  showBadge = true,
  showText = true,
  className = ''
}) => {
  const { language } = useDocs();
  const heightClass = size === 'sm' ? 'h-7 sm:h-8' : size === 'lg' ? 'h-11 sm:h-12' : 'h-8 sm:h-9';

  const docTitleMap = {
    km: { title: 'ឯកសារប្រព័ន្ធ', subtitle: 'ស្ថាបត្យកម្ម & មគ្គុទ្ទេសក៍' },
    en: { title: 'Documentation', subtitle: 'Architecture & Developer Portal' },
    th: { title: 'เอกสารระบบ', subtitle: 'สถาปัตยกรรมและคู่มือ' },
    vi: { title: 'Tài liệu Hệ thống', subtitle: 'Kiến trúc & Hướng dẫn' },
    zh: { title: '官方开发文档', subtitle: '系统架构与开发指南' },
  };

  const currentText = docTitleMap[language] || docTitleMap.en;

  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {/* Real OptaPOS Logo Image */}
      <img
        src="/logo.png"
        alt="OptaPOS Logo"
        className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs shrink-0`}
      />

      {/* Subtle Vertical Divider */}
      <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block shrink-0" />

      {/* Documentation Title & Subtitle */}
      {showText && (
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight whitespace-nowrap group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              {currentText.title}
            </span>

            {showBadge && (
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-500/30 shrink-0">
                DOCS
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 -mt-0.5 truncate hidden md:inline">
            {currentText.subtitle}
          </span>
        </div>
      )}
    </div>
  );

  if (to) {
    return (
      <Link to={to} className="inline-flex items-center focus:outline-none shrink-0" title="OptaPOS Documentation Portal">
        {content}
      </Link>
    );
  }

  return content;
};
