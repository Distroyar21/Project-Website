import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className, width, height, rounded = 'rounded-xl' }) => {
  return (
    <div 
      className={`skeleton-shimmer ${rounded} ${className}`}
      style={{ width, height }}
    />
  );
};

export const ImageCardSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-4 space-y-4 break-inside-avoid">
    <Skeleton height="200px" />
    <div className="space-y-2">
      <Skeleton height="20px" width="60%" />
      <Skeleton height="14px" width="90%" />
      <Skeleton height="14px" width="40%" />
    </div>
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="flex flex-col md:flex-row gap-8 bg-white/5 rounded-3xl p-8 border border-white/10 overflow-hidden">
    <Skeleton className="w-full md:w-1/3 aspect-square shrink-0" rounded="rounded-2xl" />
    <div className="flex-1 space-y-4 flex flex-col justify-center">
      <div className="flex gap-3">
        <Skeleton width="80px" height="24px" rounded="rounded-full" />
        <Skeleton width="100px" height="15px" />
      </div>
      <Skeleton height="32px" width="80%" />
      <div className="space-y-2">
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="100%" />
        <Skeleton height="16px" width="40%" />
      </div>
      <Skeleton width="120px" height="20px" />
    </div>
  </div>
);

export default Skeleton;
