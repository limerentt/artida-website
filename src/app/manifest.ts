import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'АРТИДА — Производство электроники',
    short_name: 'АРТИДА',
    description:
      'Разработка и производство электронных устройств в Беларуси',
    start_url: '/ru',
    display: 'standalone',
    background_color: '#FAFBFC',
    theme_color: '#1E4D8C',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
    ],
  }
}
