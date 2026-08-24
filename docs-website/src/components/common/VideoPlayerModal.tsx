import React from 'react';
import { X, Play, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { TutorialVideo } from '../../types/docs';
import { useDocs } from '../../stores/useDocsStore';

interface VideoPlayerModalProps {
  video: TutorialVideo | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const { language } = useDocs();
  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl p-6 md:p-8 transition-colors duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
              {video.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {video.duration}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              {video.difficulty}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-slate-100">
            {language === 'km' ? video.titleKh : video.title}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            {language === 'km' ? video.descriptionKh : video.description}
          </p>
        </div>

        {/* Interactive Video Player / Coming Soon Banner */}
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 mb-8 group shadow-inner">
          <div className="w-20 h-20 rounded-full bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 mb-4 group-hover:scale-110 transition-transform shadow-lg">
            <Play className="w-8 h-8 fill-brand-400 translate-x-0.5" />
          </div>
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Tutorial video coming soon</span>
          </div>

          <p className="text-xs text-slate-400 max-w-md">
            {language === 'km' 
              ? 'វីដេអូអនុវត្តជាក់ស្តែងកំពុងរៀបចំថត។ លោកអ្នកអាចអាន Script និងជំហានលម្អិតខាងក្រោមដើម្បីអនុវត្តភ្លាមៗបាន។'
              : 'Interactive studio recording in progress. Please review the complete narrator script and step-by-step cue notes below.'}
          </p>
        </div>

        {/* Step-by-Step Script Section */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-200">
              {language === 'km' ? 'អត្ថបទសំឡេងបង្រៀន (Video Narrator Script)' : 'Video Narrator Script & Notes'}
            </h3>
          </div>

          <div className="space-y-4">
            {video.videoScript.map((script, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                    Step 0{script.step}: {script.action}
                  </span>
                </div>
                <div className="text-sm text-slate-900 dark:text-slate-200 font-medium mb-1">
                  🇰🇭 {script.narrationKh}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">
                  🇬🇧 {script.narrationEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
