// 'use client'
// //my version
// import { useRouter } from 'next/router'
// import React, { Dispatch, useEffect, useState, useRef } from 'react'
// import Header from '../../components/pages/shop/header'
// import Content from '../../components/pages/shop/content'
// import { FanGetShopResponse } from 'models/api/fanGetShopResponse'
// import StoreScanLinks from 'components/pages/creator/storeScanLinks'
// import { FormProvider, useForm } from 'react-hook-form'
// import { useDebouncedCallback } from 'use-debounce'
// import useTranslation from 'next-translate/useTranslation'
// import { useQuery } from 'react-query'
// import axios from 'axios'
// import queryString from 'query-string'
// import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
// import { get } from 'utils/apiClient'
// import { ParsedUrlQuery } from 'querystring'
// import useScrollToBottom from '../api/scroll'
// import 'twin.macro'
// interface UrlParams extends ParsedUrlQuery {
//   creatorKey: string
//   productKey: string
// }

// export interface FormValueShop {
//   searchPhrase?: any
// }
// interface PageProps {
//   data: FanGetShopResponse
// }
// export const getServerSideProps: GetServerSideProps<
//   PageProps,
//   UrlParams
// > = async ({ params, locale, resolvedUrl }) => {
//   if (!params || !locale) {
//     return { notFound: true }
//   }
//   const { creatorKey } = params

//   if (locale === `en`) {
//     return {
//       redirect: {
//         permanent: false,
//         basePath: false,
//         destination: `/${resolvedUrl}`,
//       },
//     }
//   }

//   try {
//     const data = await get<FanGetShopResponse>(
//       `fan/shop?CreatorKey=${creatorKey as string}&PageNumber=1&PageSize=25`,
//       locale,
//     )

//     if (!data?.creator) {
//       return { notFound: true }
//     }

//     return { props: { data } }
//   } catch (error) {
//     console.error('Error fetching creator details:', error)
//     return { notFound: true }
//   }
// }

// export default function Shop({
//   data,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   const router = useRouter()
//   const { creatorKey } = router.query
//   const { lang } = useTranslation('creator')
//   const [initialData, setInitialData] = useState<FanGetShopResponse>()
//   const [switchWindowOffset, setswitchWindowOffset] = useState(false)
//   const [windowsPushNumber, setwindowsPushNumber] = useState(1)
//   const [pageSize, setpageSize] = useState(25)
//   const scrollCount = useScrollToBottom()
//   const [isMobile, setisMobile] = useState(true)

//   const methods = useForm<FormValueShop>()
//   const searchPhraseWatch = methods.watch('searchPhrase')
//   const [searchPhrase, setSearchPhrase] = useState<string>()
//   const debouncedSearchPhrase = useDebouncedCallback((value: string) => {
//     setSearchPhrase(value)
//   }, 2000)

//   const { data: shopItems } = useQuery(
//     [
//       'shopData',
//       creatorKey,
//       searchPhrase,
//       lang,
//       windowsPushNumber,
//       pageSize,
//       scrollCount,
//     ],
//     async () => {
//       const { data } = await axios.get<FanGetShopResponse>(
//         `fan/shop?CreatorKey=${creatorKey}&SearchPhrase=${searchPhrase}&PageNumber=${scrollCount}&PageSize=${pageSize}`,
//         {
//           params: { searchPhrase },
//           paramsSerializer: (params) => {
//             if (searchPhrase === '') {
//               console.log('wtffffk')
//             }
//             return queryString.stringify(params, { arrayFormat: 'none' })
//           },
//         },
//       )
//       return data
//     },
//     {
//       enabled: !!creatorKey,
//     },
//   )

//   useEffect(() => {
//     if (
//       !initialData ||
//       initialData === undefined ||
//       initialData === null ||
//       data
//     ) {
//       setInitialData(data)
//     }
//   }, [data])

//   useEffect(() => {
//     debouncedSearchPhrase(searchPhraseWatch)
//     if ((shopItems && searchPhrase) || searchPhrase === '') {
//       setInitialData(shopItems)
//     }
//   }, [searchPhraseWatch, shopItems])

//   return (
//     <FormProvider {...methods}>
//       <div className="flex flex-col justify-center items-center">
//         <Header
//           profilePhotoUrl={initialData?.creator?.profilePhotoUrl}
//           creatorKeyUrl={initialData?.creator?.creatorKey}
//           creatorName={initialData?.creator?.name}
//         />
//         {!isMobile && (
//           <span tw="border-line border-b h-[1px] w-[4000px]"></span>
//         )}

//         <section>
//           <Content
//             items={initialData?.shopItems?.items}
//             lazyLoading={false}
//             loaderRef={false}
//             profilePhotoUrl={initialData?.creator?.profilePhotoUrl}
//           />
//         </section>
//         <section className="max-w-min">
//           <StoreScanLinks mode="productPage" />
//         </section>
//       </div>
//     </FormProvider>
//   )
// }
// //dima version
// ;('use client')
// import { useRouter } from 'next/router'
// import React, { Dispatch, useEffect, useState, useRef } from 'react'
// import Header from '../../components/pages/shop/header'
// import Content from '../../components/pages/shop/content'
// import { FanGetShopResponse } from 'models/api/fanGetShopResponse'
// import StoreScanLinks from 'components/pages/creator/storeScanLinks'
// import { FormProvider, useForm } from 'react-hook-form'
// import { useDebouncedCallback } from 'use-debounce'
// import useTranslation from 'next-translate/useTranslation'
// import { useQuery } from 'react-query'
// import axios from 'axios'
// import queryString from 'query-string'
// import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
// import { get } from 'utils/apiClient'
// import { ParsedUrlQuery } from 'querystring'
// import useScrollToBottom from '../api/scroll'
// import 'twin.macro'
// interface UrlParams extends ParsedUrlQuery {
//   creatorKey: string
//   productKey: string
// }

// export interface FormValueShop {
//   searchPhrase?: any
// }
// interface PageProps {
//   data: FanGetShopResponse
// }
// export const getServerSideProps: GetServerSideProps<
//   PageProps,
//   UrlParams
// > = async ({ params, locale, resolvedUrl }) => {
//   if (!params || !locale) {
//     return { notFound: true }
//   }
//   const { creatorKey } = params

//   if (locale === `en`) {
//     return {
//       redirect: {
//         permanent: false,
//         basePath: false,
//         destination: `/${resolvedUrl}`,
//       },
//     }
//   }

//   try {
//     const data = await get<FanGetShopResponse>(
//       `fan/shop?CreatorKey=${creatorKey as string}&PageNumber=1&PageSize=25`,
//       locale,
//     )
//     console.log('return data')
//     if (!data?.creator) {
//       return { notFound: true }
//     }

//     return { props: { data } }
//   } catch (error) {
//     console.error('Error fetching creator details:', error)
//     return { notFound: true }
//   }
// }

// export default function Shop({
//   data,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   const router = useRouter()
//   const { creatorKey } = router.query
//   const { lang } = useTranslation('creator')

//   const [windowsPushNumber, setwindowsPushNumber] = useState(1)
//   const [pageSize, setpageSize] = useState(25)
//   const scrollCount = useScrollToBottom()
//   const [isMobile, setisMobile] = useState(true)

//   const methods = useForm<FormValueShop>()
//   const searchPhraseWatch = methods.watch('searchPhrase')
//   const [searchPhrase, setSearchPhrase] = useState<string>()
//   const debouncedSearchPhrase = useDebouncedCallback((value: string) => {
//     setSearchPhrase(value)
//   }, 2000)

//   const { data: shopItems } = useQuery(
//     ['shopData', { creatorKey, searchPhrase }],
//     async () => {
//       const { data } = await axios.get<FanGetShopResponse>(
//         `fan/shop?CreatorKey=${creatorKey}&SearchPhrase=${searchPhrase || ''}&PageNumber=${scrollCount}&PageSize=${pageSize}`,
//       )
//       return data
//     },
//     {
//       enabled: !!creatorKey,
//     },
//   )

//   useEffect(() => {
//     debouncedSearchPhrase(searchPhraseWatch)
//   }, [searchPhraseWatch])

//   return (
//     <FormProvider {...methods}>
//       <div className="flex flex-col justify-center items-center">
//         <Header
//           profilePhotoUrl={shopItems?.creator?.profilePhotoUrl}
//           creatorKeyUrl={shopItems?.creator?.creatorKey}
//           creatorName={shopItems?.creator?.name}
//         />
//         {!isMobile && (
//           <span tw="border-line border-b h-[1px] w-[4000px]"></span>
//         )}

//         <section>
//           <Content
//             items={shopItems?.shopItems?.items}
//             lazyLoading={false}
//             loaderRef={false}
//             profilePhotoUrl={shopItems?.creator?.profilePhotoUrl}
//           />
//         </section>
//         <section className="max-w-min">
//           <StoreScanLinks mode="productPage" />
//         </section>
//       </div>
//     </FormProvider>
//   )
// }
