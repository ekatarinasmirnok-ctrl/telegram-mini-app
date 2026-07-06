// Типы данных RuStore. Без побочных эффектов — безопасно импортировать в клиентские компоненты.

export interface AppCard {
  id: string // packageName
  name: string
  subtitle: string
  icon: string
  rating: number
  downloads: string
}

export interface AppFull extends AppCard {
  developer: string
  reviews: number
  fullDescription: string
  whatsNew: string
  size: string
  age: string
  version: string
  screenshots: string[]
  category: string
}

export interface Collection {
  title: string
  query: string
  apps: AppCard[]
}

export interface CategoryDef {
  key: string
  label: string
  query: string // пустая строка = главная (подборки)
}

// Категории-чипсы. Каждая (кроме «Все») ведёт на живой поиск по запросу.
export const CATEGORIES: CategoryDef[] = [
  { key: 'all', label: 'Все', query: '' },
  { key: 'games', label: 'Игры', query: 'игры' },
  { key: 'social', label: 'Соцсети', query: 'социальная сеть' },
  { key: 'messengers', label: 'Мессенджеры', query: 'мессенджер' },
  { key: 'finance', label: 'Финансы', query: 'банк' },
  { key: 'shopping', label: 'Покупки', query: 'магазин' },
  { key: 'music', label: 'Музыка', query: 'музыка' },
  { key: 'video', label: 'Видео', query: 'видео' },
  { key: 'navigation', label: 'Навигация', query: 'навигатор' },
  { key: 'food', label: 'Еда', query: 'доставка еды' },
  { key: 'photo', label: 'Фото', query: 'фоторедактор' },
  { key: 'health', label: 'Здоровье', query: 'здоровье' },
]

// Подборки главной страницы — каждая формируется живым запросом к каталогу RuStore.
export const HOME_COLLECTIONS: { title: string; query: string }[] = [
  { title: 'Рекомендуем', query: 'мессенджер' },
  { title: 'Маркетплейсы', query: 'маркетплейс' },
  { title: 'Банки и финансы', query: 'банк' },
  { title: 'Популярные игры', query: 'игры' },
  { title: 'Музыка и подкасты', query: 'музыка' },
  { title: 'Смотрим видео', query: 'видео' },
  { title: 'Навигация и транспорт', query: 'навигатор' },
  { title: 'Доставка еды', query: 'доставка еды' },
  { title: 'Госуслуги и сервисы', query: 'госуслуги' },
  { title: 'Фото и видео', query: 'фоторедактор' },
]
