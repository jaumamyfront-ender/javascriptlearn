import ShareVideoButton from "components/pages/video/shareVideoButton";
import ShowMoreLess from "components/showMoreLess";
import { UserDeviceTypeEnum } from "models/api/userDeviceTypeEnum";
import { VideoDetailsPartDTO } from "models/api/videoDetailsPartDTO";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import tw, { css } from "twin.macro";
import { useAnalytics } from "utils/analyticsContext";
import { countStats } from "utils/countStats";

interface VideoCarouselItemProps {
  video: VideoDetailsPartDTO;
  onPlay: () => void;
  isActive: boolean;
  creatorId: number;
  isMute: boolean;
  setIsMute: Dispatch<SetStateAction<boolean>>;
  deviceType: UserDeviceTypeEnum | undefined;
}

export default function VideoCarouselItem({
  video,
  onPlay,
  isActive,
  creatorId,
  isMute,
  setIsMute,
  deviceType,
}: VideoCarouselItemProps) {
  const queryClient = useQueryClient();
  const { setAnalyticsData } = useAnalytics();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasBeenViewed, setHasBeenViewed] = useState<boolean>(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<number>(0); // condition to track the last time logging
  const [initialLoggingDone, setInitialLoggingDone] = useState(false);
  const videoId = video.id;

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
        setIsMute(true);
      } else {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "unMuteVideo" },
        });
        setIsMute(false);
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
    onPlay();
  };

  const videourl =
    video.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p720"
    )?.videoUrl ||
    video.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p480"
    )?.videoUrl ||
    video.videoResolutions.find(
      ({ videoResolutionType }) => videoResolutionType === "p1080"
    )?.videoUrl;

  return (
    <div tw="w-full relative" ref={containerRef}>
      <div tw="relative">
        <video
          ref={videoRef}
          src={videourl}
          controls
          controlsList={
            isAndroid
              ? "nodownload nofullscreen noremoteplayback"
              : "nodownload noremoteplayback"
          }
          disablePictureInPicture={isAndroid}
          muted={isMute}
          css={[
            tw`w-fit md:w-full rounded-md`,
            video.isVertical
              ? tw`aspect-[9/16] md:aspect-[16/9]`
              : tw`aspect-[16/9]`,
            isAndroid &&
              css`
                &::-webkit-media-controls-fullscreen-button {
                  display: none !important;
                }
              `,
          ]}
          id="video"
          onPlay={handlePlay}
        >
          <source src={videourl} type="video/mp4" />
        </video>
        <Image
          src={"/img/logo-for-video.svg"}
          width={44}
          height={16}
          css={[tw`w-11 h-4 min-w-11 min-h-4 absolute top-4 right-4`]}
          alt={`logo-for-video`}
          quality={100}
        />
        <Image
          priority
          src={"/img/backgroud-poster.svg"}
          fill
          alt="thumbnails"
          tw="absolute bottom-0 object-cover -z-[1] rounded-md"
          quality={50}
        />
      </div>
      <div tw="flex flex-col w-full mt-3">
        <ShowMoreLess
          lineClamp={1}
          isMore={false}
          children={
            <p tw="font-semibold md:text-xl w-fit">{video.videoTitle}</p>
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

            <ShareVideoButton
              color="gray"
              isPadding={false}
              shareLink={`${process.env.NEXT_PUBLIC_URL}w/${video.videoKey}`}
              count={video.videoStats?.shareCount}
              videoId={video.id}
              position={"right center"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
