import React from 'react';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  rows?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, rows = 1 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={clsx('skeleton h-4', className)} />
      ))}
    </>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({
  rows = 5,
  cols = 6,
}) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-gray-50 dark:border-gray-800/50">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <div className="skeleton h-4 w-full rounded" />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="card p-6 space-y-3 animate-pulse">
    <div className="skeleton h-4 w-1/3" />
    <div className="skeleton h-8 w-1/2" />
    <div className="skeleton h-3 w-2/3" />
  </div>
);
