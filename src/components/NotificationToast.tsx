import React, { useState, useEffect } from 'react';
import { Bell, Truck, Package, X, CheckCircle } from 'lucide-react';

interface NotificationToastProps {
  onOpenOrder: (orderId: string) => void;
  lang: 'ar' | 'en';
}

interface ToastPayload {
  title: string;
  message: string;
  type: string;
  orderId?: string;
  timestamp: string;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ onOpenOrder, lang }) => {
  const [activeToast, setActiveToast] = useState<ToastPayload | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setHasPermission(Notification.permission === 'granted');
    }

    // Connect to Server-Sent Events (SSE) stream
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connected') return;

        setActiveToast(data);

        // Native browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(data.title, {
            body: data.message,
            icon: '/favicon.ico'
          });
        }

        // Auto dismiss after 6 seconds
        setTimeout(() => {
          setActiveToast((current) => (current?.timestamp === data.timestamp ? null : current));
        }, 6500);
      } catch (err) {
        console.error('SSE Error:', err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const requestBrowserPermission = async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      setHasPermission(perm === 'granted');
    }
  };

  return (
    <>
      {/* Toast Popup */}
      {activeToast && (
        <div className="fixed top-20 right-1/2 translate-x-1/2 z-50 max-w-sm w-full mx-auto px-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-[#282828] text-white p-3.5 rounded-xl shadow-2xl border border-[#F68B1E]/60 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#F68B1E]/20 text-[#F68B1E] shrink-0 mt-0.5">
              {activeToast.type === 'shipping' ? (
                <Truck className="w-5 h-5 text-[#F68B1E]" />
              ) : (
                <Package className="w-5 h-5 text-[#F68B1E]" />
              )}
            </div>

            <div className="flex-1 min-w-0 text-right">
              <h4 className="font-bold text-xs sm:text-sm text-white">{activeToast.title}</h4>
              <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>

              {activeToast.orderId && (
                <button
                  onClick={() => {
                    onOpenOrder(activeToast.orderId!);
                    setActiveToast(null);
                  }}
                  className="mt-2 text-[11px] font-bold text-[#F68B1E] hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'ar' ? 'عرض تفاصيل الشحنة' : 'Track Package'}</span>
                  <span>←</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setActiveToast(null)}
              className="text-gray-400 hover:text-white p-1"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Discrete Push Notification Opt-in Prompt */}
      {!hasPermission && (
        <div className="fixed bottom-2 left-2 z-30 hidden sm:block">
          <button
            onClick={requestBrowserPermission}
            className="bg-white hover:bg-gray-50 border border-[#E6E6E6] text-gray-700 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-[#F68B1E]" />
            <span>{lang === 'ar' ? 'تفعيل إشعارات التوصيل الفورية' : 'Enable Live Delivery Alerts'}</span>
          </button>
        </div>
      )}
    </>
  );
};
