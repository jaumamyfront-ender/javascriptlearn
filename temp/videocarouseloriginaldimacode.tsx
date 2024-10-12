// import {
//   faChevronLeft,
//   faChevronRight,
// } from '@fortawesome/pro-regular-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { UserDeviceTypeEnum } from 'models/api/userDeviceTypeEnum'
// import { VideoDetailsPartDTO } from 'models/api/videoDetailsPartDTO'
// import useTranslation from 'next-translate/useTranslation'
// import React, { useEffect, useMemo, useRef, useState } from 'react'
// import 'swiper/css'
// import 'swiper/css/navigation'
// import 'swiper/css/pagination'
// import { Navigation, Pagination } from 'swiper/modules'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import tw from 'twin.macro'
// import { UAParser } from 'ua-parser-js'
// import VideoCarouselItem from './videoCarouselItem'

// interface CarouselProps {
//   slides: VideoDetailsPartDTO[]
//   creatorId: number
//   creatorKey: string
// }

// const VideoCarousel: React.FC<CarouselProps> = ({
//   slides,
//   creatorId,
//   creatorKey,
// }) => {
//   const [activePlayer, setActivePlayer] = useState<number | null>(null)
//   const [deviceType, setDeviceType] = useState<UserDeviceTypeEnum | undefined>()

//   const { t } = useTranslation('creator')
//   const swiperRef = useRef<any>(null)
//   const [isMute, setIsMute] = useState(false)

//   const videoPosterUrl =
//     slides[0].posterUrl ||
//     slides[0].thumbnails.find(
//       (item) => item.width === 'pX512' || item.width === 'pX256',
//     )?.photoUrl ||
//     ''

//   const handlePrev = () => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.slidePrev()
//     }
//   }

//   const handleNext = () => {
//     if (swiperRef.current && swiperRef.current.swiper) {
//       swiperRef.current.swiper.slideNext()
//     }
//   }

//   const handleChange = () => {
//     setActivePlayer(null) // Stop all players when sliding
//   }

//   const handleVideoPlay = (index: number) => {
//     setActivePlayer(index)
//   }

//   const { verticalSlides, horizontalSlides, slideItems } = useMemo(() => {
//     const verticalSlidesFilter = slides.filter(({ isVertical }) => isVertical)
//     const horizontalSlidesFilter = slides.filter(
//       ({ isVertical }) => !isVertical,
//     )

//     return {
//       verticalSlides: verticalSlidesFilter,
//       horizontalSlides:
//         horizontalSlidesFilter.length === 2
//           ? [...horizontalSlidesFilter, ...horizontalSlidesFilter]
//           : horizontalSlidesFilter,
//       slideItems: slides.length === 2 ? [...slides, ...slides] : slides,
//     }
//   }, [slides])

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const parser = new UAParser()
//       const result = parser.getResult()
//       let determinedDeviceType: UserDeviceTypeEnum = 'web' // Default value

//       if (result.device.type === 'mobile' || result.device.type === 'tablet') {
//         determinedDeviceType = result.os.name === 'Android' ? 'android' : 'ios'
//       } else if (result.os.name === 'Windows') {
//         determinedDeviceType = 'windows'
//       } else if (result.os.name === 'Mac OS') {
//         determinedDeviceType = 'macos'
//       }

//       setDeviceType(determinedDeviceType)
//     }
//   }, [])
//   // const isVertical = data.video.video?.isVertical
//   console.log(slides)

//   const OneVideoItem = (
//     <div>
//       <VideoCarouselItem
//         isOnePlayer={true}
//         isVertical={slides[0].isVertical}
//         videoPosterUrl={videoPosterUrl}
//         deviceType={deviceType}
//         isMute={isMute}
//         setIsMute={setIsMute}
//         creatorId={creatorId}
//         video={slides[0]}
//         onPlay={() => handleVideoPlay(0)}
//         isActive={activePlayer === 0}
//         shareLink={`/w/${creatorKey}/${slides[0].videoKey}`}
//       />
//     </div>
//   )

//   return (
//     <div>
//       <div className="w-full flex justify-between pb-4 mt-7 items-center min-h-14">
//         <h2 tw="text-lg md:text-xl text-left font-bold">
//           {t('creator:watchAMovie')}
//         </h2>
//         {slides.length > 1 && (
//           <div tw="md:flex hidden flex-row gap-4">
//             <button
//               onClick={handlePrev}
//               className="bg-gray-600 w-10 h-10 flex items-center justify-center bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
//             >
//               <FontAwesomeIcon
//                 className="h-5 text-white"
//                 icon={faChevronLeft}
//               />
//             </button>
//             <button
//               onClick={handleNext}
//               className="bg-gray-600 w-10 h-10 flex items-center justify-center bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all"
//             >
//               <FontAwesomeIcon
//                 className="h-5 text-white"
//                 icon={faChevronRight}
//               />
//             </button>
//           </div>
//         )}
//       </div>
//       <div className="swiper-product desktop" tw="md:block hidden">
//         {slideItems.length > 1 ? (
//           <Swiper
//             ref={swiperRef}
//             slidesPerView={'auto'}
//             centeredSlides={true}
//             spaceBetween={16}
//             modules={[Pagination, Navigation]}
//             className="mySwiper"
//             loop
//             onSlideChange={handleChange}
//           >
//             {slideItems.map((slide, index) => (
//               <SwiperSlide key={index}>
//                 <VideoCarouselItem
//                   isOnePlayer={true}
//                   deviceType={deviceType}
//                   videoPosterUrl={videoPosterUrlsecondary}
//                   isMute={isMute}
//                   setIsMute={setIsMute}
//                   video={slide}
//                   onPlay={() => handleVideoPlay(index)}
//                   isActive={activePlayer === index}
//                   creatorId={creatorId}
//                 />
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         ) : (
//           OneVideoItem
//         )}
//       </div>

//       {!!horizontalSlides.length && (
//         <div tw="md:hidden" className="horizontal-swiper">
//           {horizontalSlides.length > 1 ? (
//             <Swiper
//               className="horizontal-swiper"
//               watchSlidesProgress={true}
//               slidesPerView={1.5}
//               spaceBetween={12}
//               loop
//               onSlideChange={handleChange}
//             >
//               {horizontalSlides.map((slide, index) => (
//                 <SwiperSlide key={index}>
//                   <VideoCarouselItem
//                     isOnePlayer={true}
//                     videoPosterUrl={videoPosterUrlsecondary}
//                     deviceType={deviceType}
//                     isMute={isMute}
//                     setIsMute={setIsMute}
//                     video={slide}
//                     onPlay={() => handleVideoPlay(index)}
//                     isActive={activePlayer === index}
//                     creatorId={creatorId}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           ) : (
//             OneVideoItem
//           )}
//         </div>
//       )}

//       {!!verticalSlides.length && (
//         <div
//           className="vertical-slides"
//           tw="md:hidden"
//           css={[!!horizontalSlides.length && tw`mt-4`]}
//         >
//           {verticalSlides.length > 1 ? (
//             <Swiper
//               className="vertical-slides"
//               watchSlidesProgress={true}
//               slidesPerView={verticalSlides.length === 2 ? 2 : 2.2}
//               spaceBetween={12}
//               loop
//               onSlideChange={handleChange}
//             >
//               {verticalSlides.map((slide, index) => (
//                 <SwiperSlide key={index}>
//                   <VideoCarouselItem
//                     isOnePlayer={true}
//                     videoPosterUrl={videoPosterUrlsecondary}
//                     deviceType={deviceType}
//                     isMute={isMute}
//                     setIsMute={setIsMute}
//                     video={slide}
//                     onPlay={() =>
//                       handleVideoPlay(index + horizontalSlides.length)
//                     }
//                     isActive={activePlayer === index + horizontalSlides.length}
//                     creatorId={creatorId}
//                   />
//                 </SwiperSlide>
//               ))}
//             </Swiper>
//           ) : (
//             OneVideoItem
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// export default VideoCarousel
