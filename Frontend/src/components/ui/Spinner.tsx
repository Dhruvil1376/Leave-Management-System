interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; }

export default function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const s = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' }[size];
  return (
    <div className={`${s} rounded-full border-2 border-gray-200 dark:border-gray-700 border-t-primary-600 animate-spin ${className}`} />
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
