import React from 'react';
import { DocsHero } from '../components/home/DocsHero';
import { QuickStart } from '../components/home/QuickStart';
import { DocsCategories } from '../components/home/DocsCategories';
import { ProjectStats } from '../components/home/ProjectStats';
import { DocsFaq } from '../components/home/DocsFaq';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-10 sm:space-y-12 pb-16 max-w-full overflow-hidden">
      {/* 1. HERO WITH 4 CONNECTED PLATFORMS */}
      <DocsHero />

      {/* 2. QUICK START ROLES (4 CLEAR AUDIENCES) */}
      <QuickStart />

      {/* 3. 6 PRIMARY DOCUMENTATION PORTALS */}
      <DocsCategories />

      {/* 4. REAL AUDITED PROJECT STATISTICS */}
      <ProjectStats />

      {/* 5. ROLE-BASED FAQ SECTION */}
      <DocsFaq />
    </div>
  );
};
