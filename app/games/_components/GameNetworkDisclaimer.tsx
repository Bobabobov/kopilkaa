import { AlertTriangle } from 'lucide-react';

export function GameNetworkDisclaimer() {
  return (
    <div className='flex gap-3 rounded-xl border border-[#f9bc60]/20 bg-[#f9bc60]/5 px-4 py-3'>
      <AlertTriangle
        className='mt-0.5 h-4 w-4 shrink-0 text-[#f9bc60]'
        aria-hidden
      />
      <p className='text-left text-xs leading-relaxed text-[#abd1c6]/90 sm:text-sm'>
        <span className='font-semibold text-[#f9bc60]'>Важно:</span> время ответа
        рассчитывается на сервере. Играйте при стабильном интернет-соединении.
        Платформа не несёт ответственности за проигрыши из-за лагов сети или
        устройства.
      </p>
    </div>
  );
}
