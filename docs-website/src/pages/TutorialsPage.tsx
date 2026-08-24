import React, { useState } from 'react';
import { useDocs } from '../stores/useDocsStore';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { VideoPlayerModal } from '../components/common/VideoPlayerModal';
import { TUTORIAL_VIDEOS } from '../data/tutorialsData';
import { TutorialVideo } from '../types/docs';
import { Video, Play, Clock } from 'lucide-react';

export const TutorialsPage: React.FC = () => {
  const { language } = useDocs();
  const [selectedVideo, setSelectedVideo] = useState<TutorialVideo | null>(null);

  return (
    <div className="space-y-8 pb-16">
      <Breadcrumb items={[{ label: 'Video Tutorials & Walkthroughs' }]} />

      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-400 text-xs font-semibold mb-3">
          <Video className="w-3.5 h-3.5" />
          <span>Interactive Multimedia Training</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {language === 'km' ? 'វីដេអូបង្រៀន និងមគ្គុទ្ទេសក៍អនុវត្តជាក់ស្តែង' : 'Video Tutorials & System Walkthroughs'}
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-400 mt-2 max-w-3xl leading-relaxed">
          {language === 'km'
            ? 'បណ្តុំវីដេអូបង្រៀនខ្លីៗងាយយល់អំពីរបៀបប្រើប្រាស់ប្រព័ន្ធជាក់ស្តែង ជាមួយអត្ថបទពន្យល់ជាភាសាខ្មែរ និងអង់គ្លេស។'
            : 'Curated step-by-step interactive simulated video guides explaining real day-to-day operations with narration scripts.'}
        </p>
      </div>

      {/* Grid of Videos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TUTORIAL_VIDEOS.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedVideo(item)}
            className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden hover:border-brand-500/50 hover:scale-[1.02] transition-all cursor-pointer group shadow-2xs hover:shadow-md flex flex-col justify-between"
          >
            {/* Thumbnail Canvas */}
            <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 flex items-center justify-center border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-2xl bg-brand-600/90 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/30">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </div>
              <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-xs">
                <Clock className="w-3 h-3" />
                {item.duration}
              </span>
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-lg bg-slate-900/80 text-brand-400 border border-slate-700 text-[10px] font-mono font-bold backdrop-blur-xs">
                {item.category}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-2">
                  {language === 'km' ? item.titleKh : item.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {language === 'km' ? item.descriptionKh : item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-brand-600 dark:text-brand-400">
                <span>Play Simulation</span>
                <span>▶</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </div>
  );
};
