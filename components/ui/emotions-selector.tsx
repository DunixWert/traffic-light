'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MoraleData } from '@/lib/types';

interface EmotionsSelectorProps {
  moraleData: MoraleData[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  isLoading: boolean;
}

const LoadingSkeleton = () => (
  <div className="space-y-4 pt-4 animate-pulse">
    {/* Primary 3 Skeleton Buttons */}
    <div className="grid grid-cols-3 gap-3">
      <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
      <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
    </div>
    {/* Toggle Area Skeleton */}
    <div className="text-center h-4 w-32 bg-gray-200 dark:bg-slate-700 rounded-full mx-auto"></div>
    {/* Detailed Emotions Skeleton (The Cloud) */}
    <div className="flex flex-wrap gap-2 pt-2">
      <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="h-8 w-16 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="h-8 w-20 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="h-8 w-28 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
      <div className="h-8 w-18 bg-gray-200 dark:bg-slate-700 rounded-full"></div>
    </div>
  </div>
);
//#TODO Add a emotion recommendation based on previous selections
export function EmotionsSelector({ moraleData, selectedIds, onChange, isLoading }: EmotionsSelectorProps) {
  const [showMore, setShowMore] = useState(false);
  const [animatingId, setAnimatingId] = useState<string | null>(null);

  // Handle toggle with animation
  const toggleEmotion = (id: string) => {
    // Trigger pop animation
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 200);

    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter(existingId => existingId !== id)
      : [...selectedIds, id];

    onChange(newSelection);
  };

  // Clear all selections
  const clearAll = () => onChange([]);

  // --- Data Processing ---
  const primaryEmotions = moraleData.slice(0, 3);
  const detailedEmotions = moraleData.slice(3);
  const selectedEmotions = moraleData.filter(e => selectedIds.includes(e.id));

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-6">

        {/* 1. Primary Traffic Light Buttons */}
        <div className="grid grid-cols-3 gap-3">
          {primaryEmotions.map((emotion) => {
            const isSelected = selectedIds.includes(emotion.id);
            const isAnimating = animatingId === emotion.id;

            return (
              <button
                key={emotion.id}
                type="button"
                onClick={() => toggleEmotion(emotion.id)}
                className={`
                  h-24 text-lg font-semibold rounded-xl border-2 transition-all duration-200
                  ${isAnimating ? 'animate-pop' : ''}
                  ${isSelected
                    ? `${emotion.color} border-4 ring-2 ring-offset-2 ring-transparent shadow-md scale-[1.02]`
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300'}
                `}
              >
                {emotion.name}
              </button>
            );
          })}
        </div>

        {/* 2. "More Emotions" Toggle with dots */}
        <div className="text-center ">
          <button
            type="button"
            onClick={() => setShowMore(!showMore)}
            className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            <span className="flex gap-1" aria-hidden="true">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-sm"></span>
              <span className="w-2 h-2 rounded-full bg-amber-500 shadow-sm"></span>
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-sm"></span>
            </span>
            <span>{showMore ? "Hide more emotions" : "More emotions..."}</span>
          </button>
        </div>

        {/* 3. Detailed Emotions (Single Unified Cloud) */}
        <div className={`
          transition-all duration-500 ease-in-out overflow-hidden
          ${showMore ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}>
          <div className="flex flex-wrap gap-2 pt-2 max-h-60 overflow-y-auto">
            {detailedEmotions.map((emotion) => {
              const isSelected = selectedIds.includes(emotion.id);
              const isAnimating = animatingId === emotion.id;

              // Determine border color based on type for visual scanning
              // (Even without headers, color helps distinguish sentiment)
              const type = emotion.type || 'Neutral';
              const borderColor =
                type === 'Positive' ? 'border-l-green-500'
                  : type === 'Neutral' ? 'border-l-amber-500'
                    : 'border-l-red-500';

              return (
                <button
                  key={emotion.id}
                  type="button"
                  onClick={() => toggleEmotion(emotion.id)}
                  className={`
                      px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200
                      ${isAnimating ? 'animate-pop' : ''}
                      ${isSelected
                      ? `${emotion.color} border-transparent shadow-sm ring-1 ring-black/5`
                      : `bg-white text-slate-600 border-slate-200 border-l-[3px] ${borderColor} hover:bg-slate-50`}
                    `}
                >
                  {emotion.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Selected Tags Display (With Clear All & Hover X) */}
        {selectedIds.length > 0 && (
          <div className="pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-semibold text-slate-700">Your selections:</p>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs font-medium text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear all
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedEmotions.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => toggleEmotion(e.id)}
                  className={`
                    group relative flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border shadow-sm transition-all
                    ${e.color} border-black/5
                  `}
                >
                  <span>{e.name}</span>
                  <span className="bg-black/10 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity -mr-1">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3">
                      <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
}