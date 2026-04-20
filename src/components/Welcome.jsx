import { useState } from 'react'

function MoonIcon({ size = 48, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="20" fill="#E0D8D0" />
      <path
        d="M24 4C24 4 38 12 38 24C38 36 24 44 24 44C24 44 10 36 10 24C10 12 24 4 24 4Z"
        fill="#C4836A"
        opacity="0.7"
      />
      <circle cx="24" cy="24" r="20" stroke="#C4836A" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  )
}

export default function Welcome({ onComplete }) {
  const [step, setStep] = useState('landing')
  const [name, setName] = useState('')

  if (step === 'landing') {
    return (
      <div className="min-h-screen bg-luna-cream flex flex-col items-center justify-between p-8 py-16">
        <div />
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 relative">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <circle cx="28" cy="28" r="26" fill="#F0EBE5" />
              <path
                d="M28 2C28 2 54 14 54 28C54 42 28 54 28 54C28 54 14 46 9 35C6 29 6 23 9 17C14 6 28 2 28 2Z"
                fill="#C4836A"
                opacity="0.55"
              />
            </svg>
          </div>
          <h1 className="text-5xl font-light text-luna-dark tracking-widest mb-2">Luna</h1>
          <p className="text-luna-muted text-sm italic tracking-wide">Your cycle, quietly.</p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <div className="bg-luna-warm rounded-2xl p-5 space-y-3">
            <div className="flex gap-3">
              <span className="text-luna-terra mt-0.5">◐</span>
              <p className="text-sm text-luna-dark leading-relaxed">
                Your data lives only on this device — never sent to any server, never shared with anyone.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-luna-sage mt-0.5">◐</span>
              <p className="text-sm text-luna-dark leading-relaxed">
                No account, no email, no tracking. Completely free, always.
              </p>
            </div>
            <div className="flex gap-3">
              <span className="text-luna-lav mt-0.5">◐</span>
              <p className="text-sm text-luna-dark leading-relaxed">
                Predictions are estimates to help you plan — not medical advice or contraception.
              </p>
            </div>
          </div>

          <button
            onClick={() => setStep('name')}
            className="w-full bg-luna-terra text-white py-3.5 rounded-2xl text-sm font-medium tracking-wide hover:bg-opacity-90 active:scale-[0.98] transition-all"
          >
            Get started
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-luna-cream flex flex-col items-center justify-center p-8">
      <div className="text-center mb-10">
        <p className="text-luna-muted text-xs tracking-widest uppercase mb-6">Welcome to Luna</p>
        <h2 className="text-2xl font-light text-luna-dark mb-2">What should we call you?</h2>
        <p className="text-luna-muted text-sm">Just a name — no account needed.</p>
      </div>

      <div className="w-full max-w-xs">
        <input
          autoFocus
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && name.trim() && onComplete(name.trim())}
          placeholder="Your name"
          maxLength={32}
          className="w-full text-center text-xl font-light text-luna-dark bg-transparent border-b-2 border-luna-border focus:border-luna-terra py-2 transition-colors placeholder:text-luna-border"
        />

        <button
          onClick={() => name.trim() && onComplete(name.trim())}
          disabled={!name.trim()}
          className="mt-8 w-full bg-luna-terra text-white py-3.5 rounded-2xl text-sm font-medium tracking-wide disabled:opacity-30 active:scale-[0.98] transition-all"
        >
          Begin
        </button>
      </div>
    </div>
  )
}
