export type NewsItem = {
  date: string
  title: string
  category: string
  slug: string
  excerpt: string
}

export const news: NewsItem[] = [
  {
    date: '2018-10-25',
    title: 'Партнерство с ООО «Вега-Абсолют» (Новосибирск)',
    category: 'Сотрудничество',
    slug: 'partnership-vega-absolute',
    excerpt:
      'АРТИДА стала официальным представителем компании «Вега-Абсолют» в Республике Беларусь.',
  },
  {
    date: '2018-10-09',
    title: 'Отчёт о выставке. Первый день',
    category: 'О предприятии',
    slug: 'exhibition-report',
    excerpt:
      'Участие ООО «АРТИДА» в Белорусском энергетическом и экологическом форуме.',
  },
  {
    date: '2018-10-08',
    title: 'Участие в Белорусском энергетическом и экологическом форуме',
    category: 'О предприятии',
    slug: 'energy-forum',
    excerpt:
      'Представление продукции и услуг на главном отраслевом форуме Беларуси.',
  },
  {
    date: '2018-09-24',
    title: 'Новый партнёр ООО «Артида»',
    category: 'Сотрудничество',
    slug: 'new-partner',
    excerpt: 'Расширение партнёрской сети компании АРТИДА.',
  },
  {
    date: '2018-09-23',
    title: 'Оснащение жилого дома в Солигорске системой телеметрии LoRaWAN',
    category: 'Системы',
    slug: 'soligorsk-lorawan',
    excerpt:
      'Реализован проект по установке системы телеметрии на базе LoRaWAN в жилом доме.',
  },
]
