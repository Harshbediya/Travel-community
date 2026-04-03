import React from 'react';

const LoadingSkeleton = ({ variant, count = 1 }) => {
  const skeletons = [];

  for (let i = 0; i < count; i++) {
    switch (variant) {
      case 'card':
        skeletons.push(
          <div key={i} className="animate-pulse bg-white dark:bg-navy-light rounded-card overflow-hidden border dark:border-gray-800 shadow-sm">
            <div className="w-full aspect-video bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-5">
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-6"></div>
              <div className="flex justify-between items-center border-t dark:border-gray-700 pt-4 mt-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </div>
            </div>
          </div>
        );
        break;
      case 'post':
        skeletons.push(
          <div key={i} className="animate-pulse bg-white dark:bg-navy-light rounded-card overflow-hidden border dark:border-gray-800 shadow-sm p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-4"></div>
            <div className="h-64 rounded-xl bg-gray-200 dark:bg-gray-700 w-full mb-4"></div>
            <div className="flex gap-4 border-t dark:border-gray-700 pt-3">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
            </div>
          </div>
        );
        break;
      case 'profile':
        skeletons.push(
          <div key={i} className="animate-pulse bg-white dark:bg-navy-light rounded-card overflow-hidden border dark:border-gray-800 shadow-sm p-8 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 mb-4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
            <div className="flex gap-8 w-full justify-center">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        );
        break;
      case 'detail':
        skeletons.push(
          <div key={i} className="animate-pulse w-full">
            <div className="flex flex-col lg:flex-row gap-6 mb-8">
              <div className="w-full lg:w-3/5 aspect-video bg-gray-200 dark:bg-gray-700 rounded-card"></div>
              <div className="w-full lg:w-2/5 flex flex-col gap-4">
                <div className="w-full h-1/2 bg-gray-200 dark:bg-gray-700 rounded-card"></div>
                <div className="w-full h-1/2 bg-gray-200 dark:bg-gray-700 rounded-card"></div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-2/3 flex flex-col gap-4">
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
              <div className="w-full lg:w-1/3 h-96 bg-gray-200 dark:bg-gray-700 rounded-card"></div>
            </div>
          </div>
        );
        break;
      default:
        skeletons.push(<div key={i} className="animate-pulse h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>);
    }
  }

  return <>{skeletons}</>;
};

export default LoadingSkeleton;
