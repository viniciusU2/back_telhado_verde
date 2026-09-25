import type { SVGProps } from 'react'

export function BrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden="true" {...props}>
      <path d="M6.5 21.5 20 9.5l13.5 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 20.5V31h19V20.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 27.5c.1-5.4 3.8-8.8 9.4-8.9-.1 5.4-3.8 8.9-9.4 8.9Z" fill="currentColor" fillOpacity=".28" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 27.5c-.1-4.1-2.8-6.8-7.1-6.9.1 4.1 2.8 6.9 7.1 6.9Z" fill="currentColor" fillOpacity=".28" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M20 31v-6.2m0 1.8 5.4-4.5M20 27l-4.1-3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}
