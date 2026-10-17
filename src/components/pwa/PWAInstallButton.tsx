import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share, PlusSquare, Smartphone, X, Check } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  // If already installed in standalone mode, hide the prompt
  if (isInstalled) {
    return null;
  }

  // Handle click depending on platform
  const handleClick = () => {
    if (isInstallable) {
      install();
    } else {
      // Show guided instructions for iOS or desktop
      setShowIOSModal(true);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1A1A1A] hover:bg-white/10 border border-white/15 hover:border-white/25 rounded-lg transition-all shadow-xs cursor-pointer active:scale-95"
        title={isIOS ? "Install EDA Invoicing on iPhone" : "Install EDA Invoicing PWA"}
      >
        <Download className="w-3.5 h-3.5 text-[#3D5AFE]" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </button>

      {/* iOS & Mobile Safari Installation Modal Sheet */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 font-space">
          <div className="bg-[#1A1A1A] border border-white/15 rounded-2xl w-full max-w-sm p-6 space-y-5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="absolute top-4 right-4 p-1 text-[#8A8785] hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* App Header Lockup */}
            <div className="flex items-center gap-3.5 pt-1">
              <img
                src="/apple-touch-icon.png"
                alt="EDA Invoicing Icon"
                className="w-12 h-12 rounded-xl shadow-md border border-white/10"
              />
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Install EDA Invoicing
                </h3>
                <p className="text-xs text-[#8A8785]">
                  Add to iPhone Home Screen
                </p>
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3 bg-[#000000] p-4 rounded-xl border border-white/10 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium flex items-center gap-1.5">
                    <span>Tap the</span>
                    <strong className="text-[#3D5AFE] inline-flex items-center gap-1">
                      Share <Share className="w-3.5 h-3.5 inline" />
                    </strong>
                    <span>button</span>
                  </p>
                  <p className="text-[11px] text-[#8A8785]">
                    Located at the bottom of your Safari toolbar on iPhone (or top bar on iPad).
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium flex items-center gap-1.5">
                    <span>Scroll & tap</span>
                    <strong className="text-white inline-flex items-center gap-1">
                      Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline text-emerald-400" />
                    </strong>
                  </p>
                  <p className="text-[11px] text-[#8A8785]">
                    Look for the icon with a plus sign in the share sheet.
                  </p>
                </div>
              </div>

              <div className="h-px bg-white/5" />

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#3D5AFE]/20 text-[#3D5AFE] flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </div>
                <div className="space-y-1">
                  <p className="text-white font-medium flex items-center gap-1.5">
                    <span>Tap</span>
                    <strong className="text-[#3D5AFE]">Add</strong>
                    <span>in top right</span>
                  </p>
                  <p className="text-[11px] text-[#8A8785]">
                    The app icon will appear directly on your home screen for quick fullscreen access.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#8A8785]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Works 100% Offline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Browser Bars</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 text-xs font-semibold text-white bg-[#3D5AFE] rounded-xl hover:bg-[#3D5AFE]/90 transition-all shadow-md active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
