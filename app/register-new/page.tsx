"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

// Покажем CAPTCHA Turnstile только если задан ключ (иначе виджета не будет)
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string | undefined;

export default function RegisterNew(){
  const [email,setEmail]=useState("");
  const [nick,setNick]=useState("");
  const [p1,setP1]=useState("");
  const [p2,setP2]=useState("");
  const [captcha,setCaptcha]=useState<string|null>(null);
  const [err,setErr]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);

  useEffect(()=>{ 
    if(!siteKey) return;
    (window as any).onloadTurnstileCallback = function () {
      (window as any).turnstile.render("#ts-reg", { sitekey: siteKey, callback:(t:string)=>setCaptcha(t) });
    };
  },[]);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setErr(null);
    if(p1.length<8) return setErr("Пароль минимум 8 символов");
    if(p1!==p2) return setErr("Пароли не совпадают");
    setBusy(true);
    try{
      // Отправим и name, и username — ваш бэкенд возьмёт нужное, лишнее проигнорирует
      const body:any = { email, password: p1, name: nick, username: nick };
      if (siteKey) body.turnstileToken = captcha;

      const r = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify(body)
      });
      if(!r.ok){ const d=await r.json().catch(()=>({})); throw new Error(d?.message||"Не удалось создать аккаунт"); }
      // Если позже включите подтверждение email — заменим на /verify
      window.location.href="/profile";
    }catch(e:any){ setErr(e.message);} finally{ setBusy(false); }
  }

  return (
    <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl shadow-lg p-6 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
        <h1 className="text-2xl font-semibold mb-1">Создать аккаунт</h1>
        <p className="text-sm text-neutral-500 mb-4">Быстро и бесплатно</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full rounded-xl border px-3 py-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Никнейм</label>
            <input className="w-full rounded-xl border px-3 py-2" type="text" value={nick} onChange={e=>setNick(e.target.value)} placeholder="Что угодно" />
            <div className="text-xs text-neutral-500 mt-1">3–20, буквы/цифры, точка, подчёркивание. Начинается с буквы.</div>
          </div>
          <div>
            <label className="block text-sm mb-1">Пароль</label>
            <input className="w-full rounded-xl border px-3 py-2" type="password" required value={p1} onChange={e=>setP1(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Повторите пароль</label>
            <input className="w-full rounded-xl border px-3 py-2" type="password" required value={p2} onChange={e=>setP2(e.target.value)} />
          </div>

          <div className="text-sm">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" required className="accent-emerald-500"/>
              <span>Согласен с <a className="underline" href="/about#terms">условиями</a> и <a className="underline" href="/about#privacy">политикой конфиденциальности</a></span>
            </label>
          </div>

          {!!siteKey && (
            <>
              <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" async defer></script>
              <div id="ts-reg" className="mt-2"></div>
            </>
          )}

          {err && <div className="text-sm text-red-600">{err}</div>}
          <button disabled={busy} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white py-2">
            {busy? "Создаём..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="text-sm text-neutral-600 mt-6 text-center">
          Уже есть аккаунт? <Link href="/login-new" className="underline">Войти</Link>
        </p>
      </div>
    </div>
  );
}
