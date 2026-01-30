"use client";

export default function Section06Purposes() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-[#fffffe]">
        <div className="space-y-1">
          <div className="text-xs text-[#abd1c6] uppercase tracking-wide">
            Цель обработки
          </div>
          <div>
            предоставление доступа Пользователю к сервисам, информации и/или
            материалам, содержащимся на веб‑сайте
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#abd1c6] uppercase tracking-wide">
            Персональные данные
          </div>
          <div className="space-y-1">
            <div>фамилия, имя, отчество</div>
            <div>электронный адрес</div>
            <div>фотографии</div>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#abd1c6] uppercase tracking-wide">
            Правовые основания
          </div>
          <div>
            договоры, заключаемые между оператором и субъектом персональных
            данных
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-[#abd1c6] uppercase tracking-wide">
            Виды обработки персональных данных
          </div>
          <div className="space-y-1">
            <div>
              Сбор, запись, систематизация, накопление, хранение, уничтожение и
              обезличивание персональных данных
            </div>
            <div>Отправка информационных писем на адрес электронной почты</div>
          </div>
        </div>
      </div>
    </div>
  );
}
