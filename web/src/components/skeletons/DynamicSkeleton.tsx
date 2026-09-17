import React from 'react';

interface SkeletonBoneProps {
  className?: string;
  delayMs?: number;
}

/**
 * Base shimmering skeleton bone with smooth staggered breathing animation
 */
export const SkeletonBone: React.FC<SkeletonBoneProps> = ({ className = '', delayMs = 0 }) => {
  return (
    <div
      className={`relative overflow-hidden bg-white/[0.06] rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/[0.08] before:to-transparent ${className}`}
      style={{ animationDelay: `${delayMs}ms` }}
    />
  );
};

interface DynamicTrackSkeletonProps {
  count?: number;
}

/**
 * Shimmering skeleton rows matching track items in search, feed, and album pages
 */
export const DynamicTrackSkeleton: React.FC<DynamicTrackSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="space-y-2.5 w-full animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#211B1E]/60 border border-white/[0.03] rounded-2xl p-3 flex items-center justify-between"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex items-center gap-3.5 flex-1 min-w-0 pr-4">
            {/* Cover art bone */}
            <SkeletonBone className="w-12 h-12 rounded-xl flex-shrink-0" delayMs={i * 60} />
            {/* Title and artist bones */}
            <div className="space-y-2 flex-1 min-w-0">
              <SkeletonBone className="h-4 w-44 sm:w-64 max-w-[85%]" delayMs={i * 60 + 20} />
              <SkeletonBone className="h-3 w-28 sm:w-40 max-w-[60%]" delayMs={i * 60 + 40} />
            </div>
          </div>
          {/* Duration bone */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <SkeletonBone className="w-10 h-3 rounded-md" delayMs={i * 60 + 50} />
            <SkeletonBone className="w-6 h-6 rounded-lg" delayMs={i * 60 + 60} />
          </div>
        </div>
      ))}
    </div>
  );
};

interface DynamicAlbumGridSkeletonProps {
  count?: number;
}

/**
 * Shimmering responsive grid for albums (search results, discography)
 */
export const DynamicAlbumGridSkeleton: React.FC<DynamicAlbumGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#211B1E]/50 rounded-2xl p-3.5 border border-white/[0.03] space-y-3"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <SkeletonBone className="w-full aspect-square rounded-xl" delayMs={i * 70} />
          <div className="space-y-1.5 pt-0.5">
            <SkeletonBone className="h-4 w-4/5" delayMs={i * 70 + 20} />
            <SkeletonBone className="h-3 w-1/2" delayMs={i * 70 + 40} />
          </div>
        </div>
      ))}
    </div>
  );
};

interface DynamicArtistGridSkeletonProps {
  count?: number;
}

/**
 * Shimmering responsive grid for artists (circular avatars + names)
 */
export const DynamicArtistGridSkeleton: React.FC<DynamicArtistGridSkeletonProps> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-[#211B1E]/50 rounded-2xl p-4 border border-white/[0.03] flex flex-col items-center text-center space-y-3"
          style={{ animationDelay: `${i * 70}ms` }}
        >
          <SkeletonBone className="w-24 h-24 sm:w-28 sm:h-28 rounded-full" delayMs={i * 70} />
          <div className="space-y-1.5 w-full flex flex-col items-center">
            <SkeletonBone className="h-4 w-24" delayMs={i * 70 + 20} />
            <SkeletonBone className="h-3 w-16" delayMs={i * 70 + 40} />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Complete placeholder for AlbumPage header while metadata is resolving
 */
export const DynamicAlbumHeroSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-b from-[#2D2228]/60 to-[#1C161A]/60 p-6 sm:p-10 border border-white/5 shadow-2xl animate-in fade-in duration-300">
      <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 sm:gap-8 text-center sm:text-left">
        <SkeletonBone className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl flex-shrink-0" />
        <div className="space-y-3 flex-1 min-w-0 w-full sm:w-auto flex flex-col items-center sm:items-start">
          <SkeletonBone className="h-6 w-28 rounded-full" />
          <SkeletonBone className="h-8 sm:h-10 w-64 sm:w-80 max-w-full rounded-xl" />
          <SkeletonBone className="h-4 w-36 rounded-lg" />
          <div className="flex items-center gap-2 pt-2">
            <SkeletonBone className="h-3 w-16 rounded-md" />
            <SkeletonBone className="h-3 w-20 rounded-md" />
          </div>
          <div className="flex items-center gap-3 pt-3">
            <SkeletonBone className="w-32 h-11 rounded-full" />
            <SkeletonBone className="w-11 h-11 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Complete placeholder for ArtistPage hero while discography is resolving
 */
export const DynamicArtistHeroSkeleton: React.FC = () => {
  return (
    <div className="relative rounded-[36px] overflow-hidden bg-gradient-to-b from-[#2D2228]/60 to-[#1C161A]/60 p-6 sm:p-10 border border-white/5 shadow-2xl animate-in fade-in duration-300">
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-8 text-center sm:text-left">
        <SkeletonBone className="w-40 h-40 sm:w-48 sm:h-48 rounded-full flex-shrink-0" />
        <div className="space-y-3 flex-1 min-w-0 w-full sm:w-auto flex flex-col items-center sm:items-start">
          <SkeletonBone className="h-6 w-32 rounded-full" />
          <SkeletonBone className="h-9 sm:h-12 w-60 sm:w-72 max-w-full rounded-xl" />
          <SkeletonBone className="h-4 w-44 rounded-lg" />
          <div className="flex items-center gap-3 pt-3">
            <SkeletonBone className="w-32 h-11 rounded-full" />
            <SkeletonBone className="w-11 h-11 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
