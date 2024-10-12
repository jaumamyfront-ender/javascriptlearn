// import { NextRequest, NextResponse } from 'next/server'

// export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl
//   const lang =
//     request.headers.get('accept-language')?.split(',')[0]?.split('-')[0] || 'en'

//   if (lang === 'en') {
//     // Пример перенаправления на польскую версию
//     const url = new URL(request.url)
//     url.pathname = pathname.replace('/en', '/pl')
//     console.log('Redirecting to:', url.href) // Выводим новый URL после замены
//     return NextResponse.redirect(url)
//   }

//   return NextResponse.next()
// }

// export const config = {
//   matcher: ['/:path*'], // Применение middleware ко всем маршрутам
// }
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import i18n from '../../i18n'

export function middleware(request: NextRequest) {
  const locale = request.nextUrl.locale || i18n.defaultLocale
  const { pathname, basePath } = request.nextUrl
  request.nextUrl.searchParams.set('lang', locale)
  request.nextUrl.href = request.nextUrl.href.replace(`/${locale}`, '')

  console.log(`inside middleware`)
  console.log(`pathname ${pathname}`)
  console.log(`basePath ${basePath}`)
  console.log(`locale ${locale}`)
  return NextResponse.rewrite(request.nextUrl)
}
