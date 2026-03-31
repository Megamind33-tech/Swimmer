import React from 'react';
import { useGameStore } from '../gameplay/useGameStore';
import { X } from 'lucide-react';

export const NotificationToast = () => {
  const { state, dispatch } = useGameStore();
  
  if (state.notifications.length === 0) return null;

  return (
    <div className="fixed top-[62px] right-4 z-[300] flex flex-col gap-2 pointer-events-auto max-w-[320px]">
      {state.notifications.slice(-3).map((n) => (
        <div
          key={n.id}
          className={`animate-slide flex items-center gap-3 px-4 py-3 border rounded-sm backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${
            n.type === 'success' ? 'bg-[#C8FF00]/10 border-[#C8FF00]/40 text-[#C8FF00]' :
            n.type === 'warning' ? 'bg-[#FF5A5F]/10 border-[#FF5A5F]/40 text-[#FF5A5F]' :
            'bg-[#18C8F0]/10 border-[#18C8F0]/40 text-[#18C8F0]'
          }`}
        >
          <span className="font-rajdhani text-[12px] font-bold uppercase tracking-widest flex-1">{n.message}</span>
          <button onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', id: n.id })} aria-label="Dismiss notification" title="Dismiss notification" className="opacity-60 hover:opacity-100 btn-mech shrink-0 rounded-sm focus-visible:ring-2 focus-visible:ring-[#D4A843] focus-visible:outline-none">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
