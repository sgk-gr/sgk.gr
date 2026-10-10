import React, { useState } from "react";
import { ImageOff, RefreshCw } from "lucide-react";

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({ src, alt = "Photo", className, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 border border-slate-200 text-slate-400 p-2 text-center select-none ${className || ''}`}>
        <ImageOff className="h-6 w-6 mb-1 text-slate-400" />
        <span className="text-[10px] font-bold text-slate-500">Σφάλμα εικόνας</span>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setHasError(false);
            setRetryCount(prev => prev + 1);
          }}
          className="mt-1 text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-blue-200"
        >
          <RefreshCw className="h-2.5 w-2.5" /> Επαναδοκιμή
        </button>
      </div>
    );
  }

  const currentSrc = retryCount > 0 ? `${src}${src.includes('?') ? '&' : '?'}retry=${retryCount}` : src;

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
};
