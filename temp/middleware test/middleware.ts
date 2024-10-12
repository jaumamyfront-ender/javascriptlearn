import { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { LOCALE_COOKIE, LOCALE_HEADER } from 'temp/constants'
import { warn } from 'temp/middleware test/log'
import type { I18nMiddlewareConfig } from 'temp/i18'

const DEFAULT_STRATEGY: NonNullable<
  I18nMiddlewareConfig<[]>['urlMappingStrategy']
> = 'redirect'

export function createI18nMiddleware<const Locales extends readonly string[]>(
  config: I18nMiddlewareConfig<Locales>,
) {
  return function I18nMiddleware(request: NextRequest) {
    console.log('temp middleware')
    const locale =
      localeFromRequest(
        config.locales,
        request,
        config.resolveLocaleFromRequest,
      ) ?? config.defaultLocale
    const nextUrl = request.nextUrl

    if (noLocalePrefix(config.locales, nextUrl.pathname)) {
      nextUrl.pathname = `/${locale}${nextUrl.pathname}`

      const strategy = config.urlMappingStrategy ?? DEFAULT_STRATEGY
      if (
        strategy === 'rewrite' ||
        (strategy === 'rewriteDefault' && locale === config.defaultLocale)
      ) {
        const response = NextResponse.rewrite(nextUrl)
        return addLocaleToResponse(request, response, locale)
      } else {
        if (!['redirect', 'rewriteDefault'].includes(strategy)) {
          warn(
            `Invalid urlMappingStrategy: ${strategy}. Defaulting to redirect.`,
          )
        }

        const response = NextResponse.redirect(nextUrl)
        return addLocaleToResponse(request, response, locale)
      }
    }

    let response = NextResponse.next()
    const pathnameLocale = nextUrl.pathname.split('/', 2)?.[1]

    if (!pathnameLocale || config.locales.includes(pathnameLocale)) {
      if (
        (config.urlMappingStrategy === 'rewrite' &&
          pathnameLocale !== locale) ||
        (config.urlMappingStrategy === 'rewriteDefault' &&
          (pathnameLocale !== locale ||
            pathnameLocale === config.defaultLocale))
      ) {
        const pathnameWithoutLocale = nextUrl.pathname.slice(
          pathnameLocale.length + 1,
        )

        const newUrl = new URL(pathnameWithoutLocale || '/', request.url)
        newUrl.search = nextUrl.search
        response = NextResponse.redirect(newUrl)
      }

      return addLocaleToResponse(
        request,
        response,
        pathnameLocale ?? config.defaultLocale,
      )
    }

    return response
  }
}

function localeFromRequest<Locales extends readonly string[]>(
  locales: Locales,
  request: NextRequest,
  resolveLocaleFromRequest: NonNullable<
    I18nMiddlewareConfig<Locales>['resolveLocaleFromRequest']
  > = defaultResolveLocaleFromRequest,
) {
  const locale =
    request.cookies.get(LOCALE_COOKIE)?.value ??
    resolveLocaleFromRequest(request)

  if (!locale || !locales.includes(locale)) {
    return null
  }

  return locale
}

const defaultResolveLocaleFromRequest: NonNullable<
  I18nMiddlewareConfig<any>['resolveLocaleFromRequest']
> = (request) => {
  const header = request.headers.get('Accept-Language')
  const locale = header?.split(',', 1)?.[0]?.split('-', 1)?.[0]
  return locale ?? null
}

function noLocalePrefix(locales: readonly string[], pathname: string) {
  return locales.every((locale) => {
    return !(pathname === `/${locale}` || pathname.startsWith(`/${locale}/`))
  })
}

function addLocaleToResponse(
  request: NextRequest,
  response: NextResponse,
  locale: string,
) {
  response.headers.set(LOCALE_HEADER, locale)

  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { sameSite: 'strict' })
  }
  return response
}

// Экспортируем middleware по умолчанию с конфигурацией
const i18nConfig: I18nMiddlewareConfig<string[]> = {
  locales: ['en', 'pl', 'de'], // Ваши поддерживаемые языки
  defaultLocale: 'en', // Язык по умолчанию
  resolveLocaleFromRequest: defaultResolveLocaleFromRequest, // Метод для определения языка из запроса
}

export default createI18nMiddleware(i18nConfig)
