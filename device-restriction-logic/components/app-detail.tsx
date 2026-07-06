'use client'

import useSWR from 'swr'
import {
  ArrowLeft,
  Star,
  Download,
  ShieldCheck,
  Baby,
  Headset,
  ChevronRight,
} from 'lucide-react'
import { AppIcon } from '@/components/app-icon'
import { InstallButton } from '@/components/install-button'
import { haptic, openSupport } from '@/components/telegram-init'
import type { AppCard, AppFull } from '@/lib/rustore-types'
import { SUPPORT_TELEGRAM, SUPPORT_URL } from '@/lib/custom-apps'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

function Stat({
  value,
  label,
  icon,
}: {
  value: string
  label: string
  icon?: React.ReactNode
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center gap-0.5 px-1 text-center">
      <span className="flex items-center gap-1 text-[15px] font-bold text-foreground">
        {icon}
        {value}
      </span>
      <span className="text-[11px] leading-tight text-muted-foreground">
        {label}
      </span>
    </div>
  )
}

export function AppDetail({
  appId,
  fallback,
  onBack,
}: {
  appId: string
  fallback: AppCard
  onBack: () => void
}) {
  const { data } = useSWR<{ app: AppFull }>(
    `/api/rustore/app/${encodeURIComponent(appId)}`,
    fetcher,
  )
  const app = data?.app
  const loading = !app

  const name = app?.name ?? fallback.name
  const icon = app?.icon ?? fallback.icon
  const developer = app?.developer ?? fallback.subtitle

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur">
        <button
          type="button"
          aria-label="Назад"
          onClick={() => {
            haptic('light')
            onBack()
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="truncate text-base font-bold text-foreground">
          {name}
        </span>
      </header>

      <div className="flex items-center gap-4 px-4 pt-4">
        <AppIcon src={icon} name={name} className="h-20 w-20" />
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-bold leading-tight text-foreground text-balance">
            {name}
          </h1>
          <p className="mt-1 truncate text-sm font-medium text-primary">
            {developer}
          </p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <InstallButton appId={appId} variant="full" />
      </div>

      <div className="mt-5 flex items-stretch divide-x divide-border px-2">
        <Stat
          value={app && app.rating > 0 ? app.rating.toFixed(1).replace('.', ',') : '—'}
          label={app ? `${app.reviews.toLocaleString('ru-RU')} оценок` : 'оценки'}
          icon={<Star className="h-3.5 w-3.5 fill-rating text-rating" />}
        />
        <Stat
          value={app?.downloads ?? fallback.downloads ?? '—'}
          label="загрузок"
          icon={<Download className="h-3.5 w-3.5 text-muted-foreground" />}
        />
        <Stat
          value={app?.age ?? '—'}
          label="возраст"
          icon={<Baby className="h-3.5 w-3.5 text-muted-foreground" />}
        />
        <Stat value={app?.size ?? '—'} label="размер" />
      </div>

      {/* Скриншоты */}
      <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto px-4">
        {loading &&
          [0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-80 w-44 shrink-0 animate-pulse rounded-3xl bg-secondary"
            />
          ))}
        {!loading &&
          app.screenshots.slice(0, 10).map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src || '/placeholder.svg'}
              alt={`Скриншот ${i + 1} — ${name}`}
              className="h-80 w-44 shrink-0 rounded-3xl border border-border object-cover"
              loading="lazy"
            />
          ))}
        {!loading && app.screenshots.length === 0 && (
          <div className="flex h-40 w-full items-center justify-center rounded-3xl bg-secondary text-sm text-muted-foreground">
            Нет скриншотов
          </div>
        )}
      </div>

      <section className="px-4 pt-6">
        <div className="flex items-center gap-2 rounded-2xl bg-secondary px-4 py-3">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <span className="text-sm text-foreground">
            Приложение проверено на безопасность
          </span>
        </div>
      </section>

      <section className="px-4 pt-6">
        <h2 className="mb-2 text-lg font-bold text-foreground">Описание</h2>
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-secondary" />
            ))}
          </div>
        ) : (
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/80">
            {app.fullDescription}
          </p>
        )}
      </section>

      {!loading && app.whatsNew && (
        <section className="px-4 pt-6">
          <h2 className="mb-2 text-lg font-bold text-foreground">Что нового</h2>
          {app.version && (
            <p className="mb-1 text-sm text-muted-foreground">
              Версия {app.version}
            </p>
          )}
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/80">
            {app.whatsNew}
          </p>
        </section>
      )}

      {/* Поддержка */}
      <section className="px-4 pt-6">
        <button
          type="button"
          onClick={() => openSupport(SUPPORT_URL)}
          className="flex w-full items-center gap-3 rounded-2xl border border-border px-4 py-3 text-left"
        >
          <Headset className="h-5 w-5 shrink-0 text-primary" />
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold text-foreground">
              Сообщить о проблеме
            </p>
            <p className="truncate text-sm text-muted-foreground">
              Свяжитесь с агентом поддержки в Telegram · @{SUPPORT_TELEGRAM}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>
      </section>
    </div>
  )
}
