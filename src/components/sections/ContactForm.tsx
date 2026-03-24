'use client'

import { useState, type FormEvent } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

type FormState = 'idle' | 'sending' | 'success' | 'error'

export function ContactForm() {
  const [state, setState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setState('sending')

    const form = e.currentTarget
    const formData = new FormData(form)

    // Honeypot check
    if (formData.get('website')) {
      setState('success')
      return
    }

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: (formData.get('phone') as string) || '',
      message: formData.get('message') as string,
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Ошибка отправки')
      }

      setState('success')
      form.reset()
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Ошибка отправки')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Сообщение отправлено</h3>
        <p className="text-text-secondary mb-6">
          Мы свяжемся с вами в ближайшее время.
        </p>
        <button
          onClick={() => setState('idle')}
          className="text-sm text-brand hover:underline"
        >
          Отправить ещё одно сообщение
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1.5">
          Ваше имя
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          placeholder="Иван Иванов"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1.5">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          placeholder="ivan@example.com"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1.5">
          Телефон
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors"
          placeholder="+375 (__) ___-__-__"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1.5">
          Сообщение
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-colors resize-none"
          placeholder="Опишите ваш запрос..."
        />
      </div>
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state === 'error' && (
        <div className="flex items-center gap-2 text-sm text-error">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand text-white font-medium rounded-lg hover:bg-brand-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Send className="w-4 h-4" />
        {state === 'sending' ? 'Отправка...' : 'Отправить сообщение'}
      </button>
    </form>
  )
}
