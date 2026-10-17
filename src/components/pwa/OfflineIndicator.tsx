import React, { useEffect, useState } from 'react';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-lg bg-amber-500/90 backdrop-blur-xs border border-amber-400 px-3 py-1.5 text-xs font-medium text-black shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200 no-print">
      <WifiOff className="w-3.5 h-3.5 text-black" />
      <span>Offline Mode — All features and local records active</span>
    </div>
  );
};
