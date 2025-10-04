"use client";

interface NotificationMessageProps {
  message: { type: 'success' | 'error'; text: string } | null;
  onClose: () => void;
}

export default function NotificationMessage({ message, onClose }: NotificationMessageProps) {
  if (!message) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg ${
      message.type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`}>
      <div className="flex items-center gap-2">
        <span>{message.type === 'success' ? '✓' : '✗'}</span>
        <span>{message.text}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}



















