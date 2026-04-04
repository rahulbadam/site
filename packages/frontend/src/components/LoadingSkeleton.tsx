import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

export function Skeleton({ 
  className = '', 
  variant = 'text', 
  width, 
  height,
  animate = true 
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
  };

  const style = {
    width: width || (variant === 'circular' ? 40 : '100%'),
    height: height || (variant === 'circular' ? 40 : variant === 'text' ? 16 : 100),
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0.5 } : undefined}
      animate={animate ? { opacity: [0.5, 1, 0.5] } : undefined}
      transition={animate ? { duration: 1.5, repeat: Infinity } : undefined}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={style}
    />
  );
}

export function ProfileCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton variant="rectangular" height={256} className="rounded-none" />
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="30%" height={16} />
        </div>
        <Skeleton variant="text" height={14} />
        <Skeleton variant="text" height={14} width="80%" />
        <div className="flex gap-2 pt-2">
          <Skeleton variant="rectangular" height={36} width="45%" />
          <Skeleton variant="rectangular" height={36} width="45%" />
        </div>
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="flex gap-3 p-3">
      <Skeleton variant="circular" width={40} height={40} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" width="30%" height={14} />
        <Skeleton variant="text" height={12} />
        <Skeleton variant="text" height={12} width="80%" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="card p-4">
          <Skeleton variant="text" width="40%" height={12} />
          <Skeleton variant="text" width="60%" height={28} className="mt-2" />
        </div>
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="overflow-hidden">
      <div className="grid gap-4 p-4 bg-gray-50" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={16} />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div 
          key={rowIndex} 
          className="grid gap-4 p-4 border-t border-gray-100" 
          style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={14} width={colIndex === 0 ? '80%' : '60%'} />
          ))}
        </div>
      ))}
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton variant="text" width="30%" height={14} />
          <Skeleton variant="rectangular" height={40} />
        </div>
      ))}
      <Skeleton variant="rectangular" height={44} width="40%" />
    </div>
  );
}

export function ConversationListSkeleton() {
  return (
    <div className="divide-y divide-gray-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" height={14} />
            <Skeleton variant="text" width="80%" height={12} />
          </div>
          <Skeleton variant="text" width="15%" height={10} />
        </div>
      ))}
    </div>
  );
}