import { cn } from "@/lib/utils";

export function ImageGridSkeleton() {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {Array.from({ length: 9 }).map((_, index) => (
        <div key={index} className="relative mb-4 break-inside-avoid">
          <div className="w-full aspect-[4/3] rounded-lg overflow-hidden">
            <div className="w-full h-full animate-shimmer bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:400%_100%]" />
          </div>
        </div>
      ))}
    </div>
  );
} 