'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        setMessage(result.message ?? 'Sign-in failed. Please try again.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setMessage('Unable to sign in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_70%_8%,#5048dc29,transparent_35%),#080b14] font-sans text-sm leading-6 text-[#f3f5fb]">
      <div className="grid min-h-screen">
        <section className="grid place-items-center p-6" aria-labelledby="login-heading">
          <form
            className="w-full max-w-[380px] rounded-[14px] border border-[#222b3c] bg-[#101522] p-8 shadow-[0_24px_70px_#0006] max-[760px]:px-[22px] max-[760px]:py-[26px]"
            onSubmit={handleSubmit}
          >
            <h1
              className="mb-[26px] text-[27px] font-normal tracking-[-0.7px] max-[620px]:text-2xl"
              id="login-heading"
            >
              Sign in
            </h1>

            <div className="my-[19px] grid gap-2">
              <label className="text-[13px] font-semibold text-[#dce1ed]" htmlFor="preview-email">
                Email
              </label>
              <input
                autoComplete="username"
                className="h-[46px] w-full rounded-[9px] border border-[#2a3346] bg-[#0e1320] px-[13px] text-sm text-[#f3f5fb] placeholder:text-[#69758b] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
                id="preview-email"
                name="email"
                placeholder="you@company.com"
                required
                type="email"
              />
            </div>

            <div className="my-[19px] grid gap-2">
              <label
                className="text-[13px] font-semibold text-[#dce1ed]"
                htmlFor="preview-password"
              >
                Password
              </label>
              <input
                autoComplete="current-password"
                className="h-[46px] w-full rounded-[9px] border border-[#2a3346] bg-[#0e1320] px-[13px] text-sm text-[#f3f5fb] placeholder:text-[#69758b] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
                id="preview-password"
                minLength={6}
                name="password"
                placeholder="Password"
                required
                type="password"
              />
            </div>

            <p
              aria-live="polite"
              className="mb-[11px] mt-[-7px] min-h-5 text-xs text-[#ff969d]"
              role="alert"
            >
              {message}
            </p>
            <button
              className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center gap-2 rounded-[9px] border border-transparent bg-[#6259f5] px-[15px] font-semibold text-white shadow-[0_5px_16px_#5148df33] transition-all duration-[180ms] hover:-translate-y-px hover:bg-[#746cfb] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#a7a4ff]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
