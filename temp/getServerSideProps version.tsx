// import React, { useEffect, useState, createContext, useContext } from 'react'
// import Header from '../../components/pages/shop/header'
// import Content from '../../components/pages/shop/content'
// import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
// import { FanGetShopResponse } from 'models/api/fanGetShopResponse'
// import { get } from 'utils/apiClient'
// import { ParsedUrlQuery } from 'querystring'
// import StoreScanLinks from 'components/pages/creator/storeScanLinks'
// import { FormProvider, useForm } from 'react-hook-form'
// import { useDebouncedCallback } from 'use-debounce'

// interface PageProps {
//   data: FanGetShopResponse
// }
// interface UrlParams extends ParsedUrlQuery {
//   creatorKey: string
//   productKey: string
// }

// export interface FormValueShop {
//   searchPhrase?: string
// }

// export const getServerSideProps: GetServerSideProps<
//   PageProps,
//   UrlParams
// > = async ({ params, locale, resolvedUrl, query }) => {
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

//   const inpuSearchTitle = query.search || ''
//   console.log(inpuSearchTitle)
//   try {
//     const data = await get<FanGetShopResponse>(
//       `fan/shop?CreatorKey=${creatorKey as string}&SearchPhrase=${inpuSearchTitle}&PageNumber=1&PageSize=25`,
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
//   // const [xd, setXd] = useState<FanGetShopResponse>(data)
//   //   useEffect(() => {
//   //     const observer = new IntersectionObserver(
//   //       (entries) => {
//   //         if (entries[0].isIntersecting && hasMore) {
//   //           setCurrentPage((prevPage) => prevPage + 1)
//   //         }
//   //       },
//   //       { threshold: 1.0 },
//   //     )

//   //     if (loaderRef.current) {
//   //       observer.observe(loaderRef.current)
//   //     }

//   //     return () => {
//   //       if (loaderRef.current) {
//   //         observer.unobserve(loaderRef.current)
//   //       }
//   //     }
//   //   }, [hasMore])

//   //   // Fetch data when currentPage changes
//   //   useEffect(() => {
//   //     if (currentPage > 1) {
//   //       fetchItems(currentPage)
//   //     }
//   //   }, [currentPage])
//   // console.log('daata', xd.shopItems)
//   const lazyLoading = false
//   const loaderRef = false

//   const [localStorage, setLocalStorage] = useState<FanGetShopResponse>()

//   const methods = useForm<FormValueShop>()
//   const searchPhrase = methods.watch('searchPhrase')
//   const debouncedHandleDeliveryData = useDebouncedCallback((value: string) => {
//     console.log('sednToApi', value)
//   }, 2000)

//   useEffect(() => {
//     if (searchPhrase) {
//       debouncedHandleDeliveryData(searchPhrase)
//     }
//   }, [searchPhrase?.length])

//   useEffect(() => {
//     if (data) {
//       setLocalStorage(data)
//     }
//   }, [data])

//   return (
//     <FormProvider {...methods}>
//       <div className="flex flex-col justify-center items-center ">
//         <Header
//           profilePhotoUrl={localStorage?.creator.profilePhotoUrl}
//           creatorKeyUrl={localStorage?.creator.creatorKey}
//           creatorName={localStorage?.creator.name}
//         />
//         <section>
//           <Content
//             items={localStorage?.shopItems?.items}
//             lazyLoading={lazyLoading}
//             loaderRef={loaderRef}
//             profilePhotoUrl={localStorage?.creator.profilePhotoUrl}
//           />
//         </section>
//         <section className="max-w-min">
//           <StoreScanLinks mode="productPage" />
//         </section>
//       </div>
//     </FormProvider>
//   )
// }
import StoreScanLinks from 'components/pages/creator/storeScanLinks'
import { FanGetShopResponse } from 'models/api/fanGetShopResponse'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useDebouncedCallback } from 'use-debounce'
import { get } from 'utils/apiClient'
import Content from '../../components/pages/shop/content'
import Header from '../../components/pages/shop/header'

export interface FormValueShop {
  searchPhrase?: any
}

export default function Shop() {
  const router = useRouter()
  const { creatorKey } = router.query

  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const { lang } = useTranslation('creator')
  const [shopItems, setShopItems] = useState<FanGetShopResponse>()

  const methods = useForm<FormValueShop>()
  const searchPhrase = methods.watch('searchPhrase')
  const debouncedHandleDeliveryData = useDebouncedCallback((value: string) => {
    console.log('Send to API:', value)
    fetchData(value)
  }, 2000)

  useEffect(() => {
    debouncedHandleDeliveryData(searchPhrase)
  }, [searchPhrase])

  const fetchData = async (searchPhrase = '') => {
    if (!creatorKey) return
    try {
      setLoading(true)
      const data = await get<FanGetShopResponse>(
        `fan/shop?CreatorKey=${creatorKey}&SearchPhrase=${searchPhrase}&PageNumber=1&PageSize=25`,
        lang,
      )
      setShopItems(data)
    } catch (err) {
      setError('Error fetching shop data')
      console.error('Error fetching creator details:', err)
    } finally {
      setLoading(false)
    }
  }
  //first render
  useEffect(() => {
    if (creatorKey) {
      fetchData()
    }
  }, [creatorKey])

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col justify-center items-center">
        <Header
          profilePhotoUrl={shopItems?.creator.profilePhotoUrl}
          creatorKeyUrl={shopItems?.creator.creatorKey}
          creatorName={shopItems?.creator.name}
        />
        <section>
          <Content
            items={shopItems?.shopItems?.items}
            lazyLoading={false}
            loaderRef={false}
            profilePhotoUrl={shopItems?.creator.profilePhotoUrl}
          />
        </section>
        <section className="max-w-min">
          <StoreScanLinks mode="productPage" />
        </section>
      </div>
    </FormProvider>
  )
}
