import ShareVideoButton from "components/pages/video/shareVideoButton";
import ShowMoreLess from "components/showMoreLess";
import useWindowSize from "hooks/useWindowSize";
import { UserDeviceTypeEnum } from "models/api/userDeviceTypeEnum";
import { VideoDetailsPartDTO } from "models/api/videoDetailsPartDTO";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import tw, { css, styled } from "twin.macro";
import { useAnalytics } from "utils/analyticsContext";
import { countStats } from "utils/countStats";
interface VideoCarouselItemProps {
  video?: VideoDetailsPartDTO;
  onPlay?: () => void;
  isActive?: boolean;
  creatorId?: number;
  isMute?: boolean;
  setIsMute?: Dispatch<SetStateAction<boolean>>;
  deviceType?: UserDeviceTypeEnum | undefined;

  src?: string;
  isVertical?: boolean | undefined;
  videoIdt?: number;
  handleVideoClick?: () => void;
  videoPosterUrl?: string;
  dataIsLoading?: boolean;
}

export default function VideoCarouselItem({
  video,
  onPlay,
  isActive,
  creatorId,
  isMute,
  setIsMute,
  deviceType,
  src,
  isVertical,
  videoIdt,
  handleVideoClick,
  videoPosterUrl,
}: VideoCarouselItemProps) {
  const queryClient = useQueryClient();
  const { setAnalyticsData } = useAnalytics();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenViewed, setHasBeenViewed] = useState<boolean>(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<number>(0); // condition to track the last time logging
  const [initialLoggingDone, setInitialLoggingDone] = useState(false);
  const videoId = video?.id;

  const { height } = useWindowSize();
  //state for handle ==>
  //1.multivideo or one video ?
  // 2.show loader ?
  // 3.show videoplayer ?
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoader, setisLoader] = useState(true);
  const [switchMultiMode, SetswitchMultiMode] = useState(true);
  const [isHidden, setisHidden] = useState(false);

  const isAndroid = deviceType === "android";

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const handleTimeUpdate = () => {
      if (video) {
        const currentTime = Math.floor(video.currentTime);
        const initialPeriod = 5;
        const subsequentPeriod = 10;
        let logPeriod = initialLoggingDone ? subsequentPeriod : initialPeriod;

        // Logging every 5 or 10 seconds viewing
        if (currentTime % logPeriod === 0 && currentTime !== lastLoggedTime) {
          setLastLoggedTime(currentTime);
          setAnalyticsData({
            eventType: "videoTimeView",
            data: {
              creatorId,
              deviceId: "landing-deviceId",
              id: videoId,
              totalTimeWatch: logPeriod,
            },
          });
        }

        if (!initialLoggingDone && currentTime >= initialPeriod) {
          setInitialLoggingDone(true);
        }

        // Condition for a viewing event of more than 3 seconds
        if (!hasBeenViewed && video.currentTime >= 3) {
          videoId &&
            setAnalyticsData({
              eventType: "videoView",
              data: { creatorId, deviceId: "landing-deviceId", id: videoId },
            }).finally(() => queryClient.invalidateQueries(`fan/statistic`));
          setHasBeenViewed(true);
        }
      }
    };

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "fullScreenVideo" },
        });
      } else {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "outFullScreenVideo" },
        });
      }
    };

    const handleVolumeChange = () => {
      if (video?.muted) {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "muteVideo" },
        });
        if (setIsMute) {
          setIsMute(true);
        }
      } else {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "unMuteVideo" },
        });
        if (setIsMute) {
          setIsMute(false);
        }
      }
    };

    const preventFullscreen = (e: Event) => {
      if (isAndroid) {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
    if (video?.id) {
      SetswitchMultiMode(false);
      setIsPlaying(false);
      setisHidden(true);
    } else if (src && videoIdt) {
      SetswitchMultiMode(true);
      setisHidden(false);
    }
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (src) {
        setisLoader(false);
      }
      const handlePageLoad = () => {
        setisLoader(false);
      };
      const a = document.addEventListener("DOMContentLoaded", handlePageLoad);
      const b = window.addEventListener("load", handlePageLoad);

      console.log(a);
      console.log(b);
      return () => {
        document.removeEventListener("DOMContentLoaded", handlePageLoad);
        window.removeEventListener("load", handlePageLoad);
      };
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    video?.addEventListener("volumechange", handleVolumeChange);
    video?.addEventListener("timeupdate", handleTimeUpdate);

    if (isAndroid) {
      video?.addEventListener("fullscreenchange", preventFullscreen);
      video?.addEventListener("webkitfullscreenchange", preventFullscreen);
      container?.addEventListener("fullscreenchange", preventFullscreen);
      container?.addEventListener("webkitfullscreenchange", preventFullscreen);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      video?.removeEventListener("volumechange", handleVolumeChange);
      video?.removeEventListener("timeupdate", handleTimeUpdate);

      if (isAndroid) {
        video?.removeEventListener("fullscreenchange", preventFullscreen);
        video?.removeEventListener("webkitfullscreenchange", preventFullscreen);
        container?.removeEventListener("fullscreenchange", preventFullscreen);
        container?.removeEventListener(
          "webkitfullscreenchange",
          preventFullscreen
        );
      }
    };
  }, [
    videoRef,
    hasBeenViewed,
    videoId,
    lastLoggedTime,
    creatorId,
    isAndroid,
    isActive,
    video?.id,
    src,
    videoIdt,
  ]);

  // useEffect(() => {
  //   if (!isActive && videoRef.current) {
  //     videoRef.current.pause()
  //   }
  // }, [isActive])

  const handlePlay = () => {
    if (video && onPlay) {
      onPlay();
    }
  };
  // condition to show poster when we have one video or multivideo
  // useEffect(() => {
  //   if (video?.id) {
  //     SetswitchMultiMode(false)
  //     setIsPlaying(false)
  //     setisHidden(true)
  //   } else if (src && videoIdt) {
  //     SetswitchMultiMode(true)
  //     setisHidden(false)
  //   }
  // }, [video?.id, src, videoIdt])

  //for one video player to handle loader
  // useEffect(() => {
  //   if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  //     if (src) {
  //       setisLoader(false)
  //     }
  //     const handlePageLoad = () => {
  //       setisLoader(false)
  //     }
  //     const a = document.addEventListener('DOMContentLoaded', handlePageLoad)
  //     const b = window.addEventListener('load', handlePageLoad)

  //     console.log(a)
  //     console.log(b)
  //     return () => {
  //       document.removeEventListener('DOMContentLoaded', handlePageLoad)
  //       window.removeEventListener('load', handlePageLoad)
  //     }
  //   }
  //   return undefined
  // }, [src])
  // console.log(src)

  //for one video to handle poster and off him  and get the acces to player for user when we have data
  const handlePlayClick = () => {
    if (src && videoIdt) {
      setIsPlaying(true);
      setisHidden(true);
      videoRef.current?.play();
    }
  };

  const videourl =
    video?.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p720"
    )?.videoUrl ||
    video?.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p480"
    )?.videoUrl ||
    video?.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p1080"
    )?.videoUrl;
  console.log(!switchMultiMode);
  return (
    <div tw="w-full relative" ref={containerRef}>
      {switchMultiMode && (
        <div>
          {" "}
          {!isPlaying && (
            <div
              css={[
                tw` inset-0 flex items-center justify-center w-full`,
                tw`w-full`,
                isVertical
                  ? tw`aspect-[9/16] xs:aspect-[16/9]`
                  : tw`aspect-[16/9]`,
                !!height &&
                  height > 1000 &&
                  css`
                    height: calc(100vh - 430px);
                  `,

                css`
                  background-image: url(${videoPosterUrl});
                  background-size: cover;
                  background-position: center;
                `,
              ]}
            >
              <LoaderContainer>
                {isLoader && <Loader />}

                <PlayButton
                  onClick={() => {
                    handlePlayClick();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    tw="w-12 h-12 text-black"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </PlayButton>
              </LoaderContainer>
            </div>
          )}
        </div>
      )}

      <div tw="relative">
        <video
          ref={videoRef}
          src={!switchMultiMode ? videourl : src}
          controls={!switchMultiMode ? true : isPlaying}
          autoPlay={!switchMultiMode ? undefined : isPlaying}
          playsInline={!switchMultiMode ? undefined : true}
          controlsList={
            isAndroid
              ? "nodownload nofullscreen noremoteplayback"
              : "nodownload noremoteplayback"
          }
          disablePictureInPicture={isAndroid}
          muted={isMute}
          css={[
            tw`w-fit md:w-full rounded-md`,
            video?.isVertical || isVertical
              ? tw`aspect-[9/16] md:aspect-[16/9]`
              : tw`aspect-[16/9]`,
            isAndroid &&
              css`
                &::-webkit-media-controls-fullscreen-button {
                  display: none !important;
                }
              `,

            !isHidden && tw`hidden`,
          ]}
          id="video"
          onClick={!switchMultiMode ? undefined : handleVideoClick}
          onPlay={!switchMultiMode ? handlePlay : undefined}
        >
          <source src={!switchMultiMode ? videourl : src} type="video/mp4" />
        </video>
        <Image
          src={"/img/logo-for-video.svg"}
          width={44}
          height={16}
          css={[tw`w-11 h-4 min-w-11 min-h-4 absolute top-4 right-4`]}
          alt={`logo-for-video`}
          quality={100}
        />
        {!switchMultiMode && (
          <Image
            priority
            src={"/img/backgroud-poster.svg"}
            fill
            alt="thumbnails"
            tw="absolute bottom-0 object-cover -z-[1] rounded-md"
            quality={50}
          />
        )}
      </div>
      {!switchMultiMode && (
        <div tw="flex flex-col w-full mt-3">
          <ShowMoreLess
            lineClamp={1}
            isMore={false}
            children={
              <p tw="font-semibold md:text-xl w-fit">{video?.videoTitle}</p>
            }
          />

          <div tw="w-fit">
            <div tw="flex flex-row items-center justify-center gap-4 mt-1">
              <div tw="flex items-center gap-2 text-2xs">
                <Image
                  src={"/google-fonts-icons/bar-chart-gray.svg"}
                  width={19}
                  height={16}
                  tw="h-[16px] w-[19px] min-h-[16px] min-w-[19px]"
                  alt="share-icon-green"
                />
                <span>{countStats(video?.videoStats?.viewCount)}</span>
              </div>

              <ShareVideoButton
                color="gray"
                isPadding={false}
                shareLink={`${process.env.NEXT_PUBLIC_URL}w/${video?.videoKey}`}
                count={video?.videoStats?.shareCount}
                videoId={video?.id}
                position={"right center"}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const LoaderContainer = styled.div`
  ${tw`relative flex items-center justify-center`}
  width: 100px;
  height: 100px;
`;

const Loader = styled.div`
  ${tw`absolute rounded-full`}
  width: 130%;
  height: 130%;
  animation: spin 1.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &::after {
    content: "";
    ${tw`absolute border-3 border-white border-t-transparent rounded-full`}
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
  }
`;

const PlayButton = styled.button`
  ${tw`bg-white bg-opacity-70 rounded-full p-4 hover:bg-opacity-100 transition-all relative z-10`}
  width: 80px;
  height: 80px;
`;
/////
{
  /* <video
  ref={videoRef}
  src={!switchMultiMode ? videourl : src}
  controls={!switchMultiMode ? true : isPlaying}
  autoPlay={!switchMultiMode ? undefined : isPlaying}
  playsInline={!switchMultiMode ? undefined : true}
  controlsList={
    isAndroid
      ? "nodownload nofullscreen noremoteplayback"
      : "nodownload noremoteplayback"
  }
  disablePictureInPicture={isAndroid}
  muted={isMute}
  css={[
    tw`w-fit md:w-full rounded-md`,
    video?.isVertical || isVertical
      ? tw`aspect-[9/16] md:aspect-[16/9]`
      : tw`aspect-[16/9]`,
    isAndroid &&
      css`
        &::-webkit-media-controls-fullscreen-button {
          display: none !important;
        }
      `,

    isHidden && tw`hidden`,
  ]}
  id="video"
  onClick={!switchMultiMode ? undefined : handleVideoClick}
  onPlay={!switchMultiMode ? handlePlay : undefined}
>
  <source src={!switchMultiMode ? videourl : src} type="video/mp4" />
</video>; */
}
// const isMultiMode = undefined
// const setMode = (isMultiMode: any) => {
//   if (isMultiMode === true) {
//     SetswitchMultiMode(true)
//     setIsPlaying(false)
//   } else if (isMultiMode === false) {
//     SetswitchMultiMode(false)
//     setisHidden(true)
//   } else if (isMultiMode === undefined) {
//     return
//   }
// }
// setMode(isMultiMode)
// console.log('switchMultiMode', switchMultiMode)
// console.log('src', src)
// console.log('videoIdt', videoIdt)
// console.log('video', video)
// console.log('isloader', isLoader)
// console.log('isActive', isActive)
// console.log('deviceType', deviceType)
// console.log('isMute', isMute)
//condition to show poster when we have one video or multivideo
// useEffect(() => {
//   if (video) {
//     SetswitchMultiMode(false)
//     setIsPlaying(false)
//   } else if (src && videoIdt) {
//     SetswitchMultiMode(true)
//   }
// }, [video, src, videoIdt])
// useEffect(() => {}, [isMultiMode])
// const setMode = (isMultiMode: string) => {
//   if (isMultiMode === 'multivideo') {
//     SetswitchMultiMode(false)
//     setIsPlaying(false)
//   } else if (isMultiMode === 'onevideo') {
//     SetswitchMultiMode(true)
//   } else if (isMultiMode === 'onemultivedeo') {
//     // SetswitchMultiMode(false)
//   }
// }
// setMode(isMultiMode)
// useEffect(() => {
//   if (isMultiMode === 'multivideo') {
//     SetswitchMultiMode(false)
//     setIsPlaying(false)
//   } else if (isMultiMode === 'onevideo') {
//     SetswitchMultiMode(true)
//   }
// }, [isMultiMode])
// !!height &&
// height > 1000 &&
// css`
//   height: calc(100vh - 490px);
// `,
import ShareVideoButton from "components/pages/video/shareVideoButton";
import ShowMoreLess from "components/showMoreLess";
import useWindowSize from "hooks/useWindowSize";
import { UserDeviceTypeEnum } from "models/api/userDeviceTypeEnum";
import { VideoDetailsPartDTO } from "models/api/videoDetailsPartDTO";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import tw, { css, styled } from "twin.macro";
import { useAnalytics } from "utils/analyticsContext";
import { countStats } from "utils/countStats";

interface VideoCarouselItemProps {
  video: VideoDetailsPartDTO;
  onPlay?: () => void;
  isActive?: boolean;
  creatorId?: number;
  isMute?: boolean;
  setIsMute?: Dispatch<SetStateAction<boolean>>;
  deviceType?: UserDeviceTypeEnum;
  shareLink?: string;
  src?: string;
  isVertical?: boolean | undefined;
  handleVideoClick?: () => void;
  videoPosterUrl?: string;
  switchMultiMode: boolean;
}

export default function VideoCarouselItem({
  video,
  onPlay,
  isActive,
  creatorId,
  isMute,
  setIsMute,
  deviceType,
  shareLink,
  src,
  isVertical,
  handleVideoClick,
  videoPosterUrl,
  switchMultiMode,
}: VideoCarouselItemProps) {
  const queryClient = useQueryClient();
  const { setAnalyticsData } = useAnalytics();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenViewed, setHasBeenViewed] = useState<boolean>(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<number>(0); // condition to track the last time logging
  const [initialLoggingDone, setInitialLoggingDone] = useState(false);
  const videoId = video.id;

  const { height } = useWindowSize();

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoader, setisLoader] = useState(true);

  const isAndroid = deviceType === "android";

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    const handleTimeUpdate = () => {
      if (video) {
        const currentTime = Math.floor(video.currentTime);
        const initialPeriod = 5;
        const subsequentPeriod = 10;
        let logPeriod = initialLoggingDone ? subsequentPeriod : initialPeriod;

        // Logging every 5 or 10 seconds viewing
        if (currentTime % logPeriod === 0 && currentTime !== lastLoggedTime) {
          setLastLoggedTime(currentTime);
          setAnalyticsData({
            eventType: "videoTimeView",
            data: {
              creatorId,
              deviceId: "landing-deviceId",
              id: videoId,
              totalTimeWatch: logPeriod,
            },
          });
        }

        if (!initialLoggingDone && currentTime >= initialPeriod) {
          setInitialLoggingDone(true);
        }

        // Condition for a viewing event of more than 3 seconds
        if (!hasBeenViewed && video.currentTime >= 3) {
          videoId &&
            setAnalyticsData({
              eventType: "videoView",
              data: { creatorId, deviceId: "landing-deviceId", id: videoId },
            }).finally(() => queryClient.invalidateQueries(`fan/statistic`));
          setHasBeenViewed(true);
        }
      }
    };

    const handleFullscreenChange = () => {
      if (document.fullscreenElement) {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "fullScreenVideo" },
        });
      } else {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "outFullScreenVideo" },
        });
      }
    };

    const handleVolumeChange = () => {
      if (video?.muted) {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "muteVideo" },
        });
        if (setIsMute) {
          setIsMute(true);
        }
      } else {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "unMuteVideo" },
        });
        if (setIsMute) {
          setIsMute(false);
        }
      }
    };

    const preventFullscreen = (e: Event) => {
      if (isAndroid) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    video?.addEventListener("volumechange", handleVolumeChange);
    video?.addEventListener("timeupdate", handleTimeUpdate);

    if (isAndroid) {
      video?.addEventListener("fullscreenchange", preventFullscreen);
      video?.addEventListener("webkitfullscreenchange", preventFullscreen);
      container?.addEventListener("fullscreenchange", preventFullscreen);
      container?.addEventListener("webkitfullscreenchange", preventFullscreen);
    }

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      video?.removeEventListener("volumechange", handleVolumeChange);
      video?.removeEventListener("timeupdate", handleTimeUpdate);

      if (isAndroid) {
        video?.removeEventListener("fullscreenchange", preventFullscreen);
        video?.removeEventListener("webkitfullscreenchange", preventFullscreen);
        container?.removeEventListener("fullscreenchange", preventFullscreen);
        container?.removeEventListener(
          "webkitfullscreenchange",
          preventFullscreen
        );
      }
    };
  }, [videoRef, hasBeenViewed, videoId, lastLoggedTime, creatorId, isAndroid]);

  useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isActive]);

  const handlePlay = () => {
    if (video && onPlay) {
      onPlay();
    }
  };

  //for one video player to handle loader

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      if (src) {
        setisLoader(false);
      }
      const handlePageLoad = () => {
        setisLoader(false);
      };
      document.addEventListener("DOMContentLoaded", handlePageLoad);
      window.addEventListener("load", handlePageLoad);
      return () => {
        document.removeEventListener("DOMContentLoaded", handlePageLoad);
        window.removeEventListener("load", handlePageLoad);
      };
    }
    return undefined;
  }, [src]);

  //for one video to handle poster and off him  and get the acces to player for user when we have data
  const handlePlayClick = () => {
    if (src && video.id) {
      setIsPlaying(true);
      videoRef.current?.play();
    }
  };

  const videoUrl =
    video?.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p720"
    )?.videoUrl ||
    video?.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p480"
    )?.videoUrl ||
    video?.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p1080"
    )?.videoUrl;
  console.log(switchMultiMode);
  return (
    <div tw="w-full relative" ref={containerRef}>
      {switchMultiMode && (
        <div>
          {" "}
          {!isPlaying && (
            <div
              css={[
                tw` inset-0 flex items-center justify-center w-full xl:min-w-[720px] xl:min-h-[405px] xl:max-w-[880px] xl:max-h-[490px] `,
                tw`w-full`,
                isVertical
                  ? tw`aspect-[9/16] xs:aspect-[16/9]`
                  : tw`aspect-[16/9]`,

                css`
                  background-image: url(${videoPosterUrl});
                  background-size: ${isVertical ? "33% 100%" : "100%"};
                  background-repeat: no-repeat;
                  background-position: center;
                  @media (min-width: 200px) and (max-width: 449px) {
                    background-size: 100%;
                  }
                `,
              ]}
            >
              <LoaderContainer>
                {isLoader && <Loader />}

                <PlayButton
                  onClick={() => {
                    handlePlayClick();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    tw="w-12 h-12 text-black"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </PlayButton>
              </LoaderContainer>
            </div>
          )}
        </div>
      )}

      <div tw="relative">
        {!switchMultiMode ? (
          <div tw="relative w-full">
            {" "}
            <video
              ref={videoRef}
              src={videoUrl}
              controls
              playsInline
              controlsList={
                isAndroid
                  ? "nodownload nofullscreen noremoteplayback"
                  : "nodownload noremoteplayback"
              }
              disablePictureInPicture={isAndroid}
              muted={isMute}
              css={[
                tw`w-fit md:w-full rounded-md`,
                video?.isVertical
                  ? tw`aspect-[9/16] md:aspect-[16/9]`
                  : tw`aspect-[16/9]`,
                isAndroid &&
                  css`
                    &::-webkit-media-controls-fullscreen-button {
                      display: none !important;
                    }
                  `,
              ]}
              id={videoUrl}
              onPlay={handlePlay}
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        ) : (
          <div tw="w-full relative">
            {" "}
            <video
              ref={videoRef}
              onClick={handleVideoClick}
              src={src}
              autoPlay={isPlaying}
              controls={isPlaying}
              playsInline
              muted
              css={[
                tw`w-full`,
                isVertical
                  ? tw`aspect-[9/16] xs:aspect-[16/9]`
                  : tw`aspect-[16/9]`,
                !!height &&
                  height > 1000 &&
                  css`
                    height: calc(100vh - 430px);
                  `,
                !isPlaying && tw`hidden`,
              ]}
              id="video"
            >
              <source src={src} type="video/mp4" />
            </video>
          </div>
        )}

        <Image
          src={"/img/logo-for-video.svg"}
          width={44}
          height={16}
          css={[tw`w-11 h-4 min-w-11 min-h-4 absolute top-4 right-4`]}
          alt={`logo-for-video`}
          quality={100}
        />
        {!switchMultiMode && (
          <Image
            priority
            src={"/img/backgroud-poster.svg"}
            fill
            alt="thumbnails"
            tw="absolute bottom-0 object-cover -z-[1] rounded-md"
            quality={50}
          />
        )}
      </div>
      {!switchMultiMode && (
        <div tw="flex flex-col w-full mt-3">
          <ShowMoreLess
            lineClamp={1}
            isMore={false}
            children={
              <p tw="font-semibold md:text-xl w-fit">{video?.videoTitle}</p>
            }
          />

          <div tw="w-fit">
            <div tw="flex flex-row items-center justify-center gap-4 mt-1">
              <div tw="flex items-center gap-2 text-2xs">
                <Image
                  src={"/google-fonts-icons/bar-chart-gray.svg"}
                  width={19}
                  height={16}
                  tw="h-[16px] w-[19px] min-h-[16px] min-w-[19px]"
                  alt="share-icon-green"
                />
                <span>{countStats(video.videoStats?.viewCount)}</span>
              </div>

              {shareLink && (
                <ShareVideoButton
                  color="gray"
                  isPadding={false}
                  shareLink={shareLink}
                  count={video.videoStats?.shareCount}
                  videoId={video.id}
                  position={"right center"}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const LoaderContainer = styled.div`
  ${tw`relative flex items-center justify-center`}
  width: 100px;
  height: 100px;
`;

const Loader = styled.div`
  ${tw`absolute rounded-full`}
  width: 130%;
  height: 130%;
  animation: spin 1.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    50% {
      transform: rotate(180deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &::after {
    content: "";
    ${tw`absolute border-3 border-white border-t-transparent rounded-full`}
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
  }
`;

const PlayButton = styled.button`
  ${tw`bg-white bg-opacity-70 rounded-full p-4 hover:bg-opacity-100 transition-all relative z-10`}
  width: 80px;
  height: 80px;
`;
===========================
import useTranslation from 'next-translate/useTranslation'
import Link from 'next/link'
import 'twin.macro'
import { useAnalytics } from 'utils/analyticsContext'
import FacebookIcon from '../../public/img/facebook.svg'
import InstagramIcon from '../../public/img/instagram.svg'
import Tiktok from '../../public/img/tiktok.svg'
import { ChangeLanguage } from './changeLanguage'
import DownloadMobileAppDialog from './downloadMobileAppDialog'

export default function Footer() {
  const { t } = useTranslation('common')
  const { sendGAEvent } = useAnalytics()

  const links = [
    {
      href: `/about`,
      label: t('footer.about'),
    },
    {
      href: `/privacy-policy`,
      label: t('footer.privacyPolicy'),
    },
    {
      href: `/products-pricing`,
      label: t('footer.products'),
    },
    {
      href: `/refund-policy`,
      label: t('footer.refundPolicy'),
    },
    {
      href: `/terms-of-use`,
      label: t('footer.rules'),
    },
  ]

  const color = 'black'

  return (
    <footer
      className={`z-1 relative px-5 py-8 md:px-10 md:py-12 md:pt-16 bg-paper text-black`}
    >
      <div tw="flex md:justify-between items-center md:flex-row flex-col">
        <div className="relative w-full max-w-[100%]  md:max-w-[26%]">
          <Link href={'/'}>
            {/* <LogoTextOnlyIcon style={{ fill: color }} /> */}
            <img src="/img/logo-seo.png" alt="Logo" style={{ fill: color }} />
          </Link>
        </div>
        <div className="mt-6 md:flex md:gap-3">
          <div className="flex gap-3">
            <CircleIcon
              href="https://www.instagram.com/refspace_poland"
              icon={InstagramIcon}
              color={color}
            />
            <CircleIcon
              href="https://www.facebook.com/RefSpace-103225402519212"
              icon={FacebookIcon}
              color={color}
            />
            <CircleIcon
              href="https://www.tiktok.com/@refspace.poland"
              icon={Tiktok}
              color={color}
            />
          </div>
        </div>
      </div>
      <div className="md:flex md:items-center md:justify-between md:mt-16 mt-6">
        <ul className="grid grid-cols-2 gap-3 md:flex md:flex-wrap md:gap-8">
          {links.map(({ href, label }) => (
            <li key={label}>
              <Link
                href={href}
                className="transition-all duration-300 hover:text-primary"
              >
                {label}
              </Link>
            </li>
          ))}
          <li>
            <div tw="flex">
              <DownloadMobileAppDialog
                trigger={
                  <p
                    className="transition-all text-base duration-300 hover:text-primary text-black"
                    onClick={() => {
                      sendGAEvent({
                        event: 'button_download_app',
                      })
                    }}
                  >
                    {t('common:modals.downloadApp.button')}
                  </p>
                }
              />
            </div>
          </li>
          <li>
            <div>
              <ChangeLanguage />
            </div>
          </li>
        </ul>
      </div>
      <p
        style={{ color: 'black' }}
        className="text-sm md:mt-10 mt-4 font-light"
      >
        Copyright &#169; {new Date().getFullYear()} RefSpace LTD. Headquarters:
        London, United Kingdom, 85 Great Portland Street First Floor London W1W
        7LT. All rights reserved. Company number: 14127969
      </p>
    </footer>
  )
}

const baseClasses =
  'rounded-md border-[1px] flex items-center justify-center transition-all duration-300 hover:bg-primary hover:cursor-pointer'

const CircleIcon = ({
  href,
  icon: Icon,
  color,
}: {
  href: string
  icon: React.FC<{ className: string; style: any }>
  color: string
}) => (
  <Link
    href={href}
    target="blank"
    className={`${baseClasses} w-[60px] h-[60px] grow border-${color}`}
  >
    <Icon className={`h-[30px] w-[30px] `} style={{ fill: color }} />
  </Link>
)
