'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        platform?: string
        ready: () => void
        expand: () => void
        setHeaderColor?: (color: string) => void
        setBackgroundColor?: (color: string) => void
        openTelegramLink?: (url: string) => void
        openLink?: (url: string) => void
        HapticFeedback?: {
          impactOccurred: (style: string) => void
          notificationOccurred: (type: string) => void
        }
      }
    }
  }
}

export function TelegramInit() {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return
    try {
      tg.ready()
      tg.expand()
      tg.setHeaderColor?.('#ffffff')
      tg.setBackgroundColor?.('#ffffff')
    } catch {
      // running outside Telegram — ignore
    }
  }, [])

  return null
}

// Платформа Telegram Mini App: 'ios' | 'macos' | 'android' | 'tdesktop' |
// 'web' | 'weba' | 'webk' | 'unknown'. Пусто, если Telegram ещё не загружен.
export function getTelegramPlatform(): string | undefined {
  try {
    return window.Telegram?.WebApp?.platform
  } catch {
    return undefined
  }
}

export function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style)
  } catch {
    // ignore
  }
}

// Открыть чат поддержки: внутри Telegram — нативно, иначе — новая вкладка.
export function openSupport(url: string) {
  haptic('light')
  const tg = window.Telegram?.WebApp
  try {
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(url)
      return
    }
    if (tg?.openLink) {
      tg.openLink(url)
      return
    }
  } catch {
    // fall through to window.open
  }
  window.open(url, '_blank', 'noopener,noreferrer')
}
