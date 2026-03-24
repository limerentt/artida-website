export type Dealer = {
  name: string
  city: string
  country: string
  website?: string
  phone?: string
  email?: string
  isOwn?: boolean
}

export const dealers: Dealer[] = [
  {
    name: 'ООО «Артида»',
    city: 'Минск',
    country: 'Беларусь',
    website: 'https://artida.by',
    phone: '+375 29 701-87-07',
    email: 'sales@artida.by',
    isOwn: true,
  },
  {
    name: 'ООО «СпецКомИнтегРо»',
    city: 'Москва',
    country: 'Россия',
  },
  {
    name: 'Торговый Дом ТИНКО',
    city: 'Москва',
    country: 'Россия',
  },
]
