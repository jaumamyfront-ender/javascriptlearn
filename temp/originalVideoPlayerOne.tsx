import useWindowSize from "hooks/useWindowSize";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useQueryClient } from "react-query";
import tw, { css, styled } from "twin.macro";
import { useAnalytics } from "utils/analyticsContext";

interface VideoWatcherProps {
  src: string;
  isVertical: boolean | undefined;
  videoId?: number;
  creatorId?: number;
  handleVideoClick: () => void;
  videoPosterUrl: string;
}

const VideoWatcher: React.FC<VideoWatcherProps> = ({
  src,
  isVertical,
  videoId,
  creatorId,
  handleVideoClick,
  videoPosterUrl,
}) => {
  const queryClient = useQueryClient();
  const { setAnalyticsData } = useAnalytics();
  const { height } = useWindowSize();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasBeenViewed, setHasBeenViewed] = useState<boolean>(false);
  const [lastLoggedTime, setLastLoggedTime] = useState<number>(0);
  const [initialLoggingDone, setInitialLoggingDone] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoader, setisLoader] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

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
      } else {
        setAnalyticsData({
          eventType: "click",
          data: { clickType: "unMuteVideo" },
        });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    video?.addEventListener("volumechange", handleVolumeChange);
    video?.addEventListener("timeupdate", handleTimeUpdate);
    video?.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      video?.removeEventListener("volumechange", handleVolumeChange);
      video?.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [videoRef, hasBeenViewed, videoId, lastLoggedTime, creatorId, src]);
  useEffect(() => {
    if (src && videoId && creatorId) {
      setisLoader(false);
    } else {
      setisLoader(true);
    }
  }, [src, videoId]);
  const handlePlayClick = () => {
    if (src && videoId) {
      setIsPlaying(true);
      videoRef.current?.play();
      setisLoader(false);
    }
  };

  console.log(isLoader);
  return (
    <div tw="relative">
      {!isPlaying && (
        <div
          css={[
            tw` inset-0 flex items-center justify-center w-full`,
            tw`w-full`,
            isVertical ? tw`aspect-[9/16] xs:aspect-[16/9]` : tw`aspect-[16/9]`,
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
          isVertical ? tw`aspect-[9/16] xs:aspect-[16/9]` : tw`aspect-[16/9]`,
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
      <Image
        src={"/img/logo-for-video.svg"}
        width={44}
        height={16}
        css={[tw`w-11 h-4 min-w-11 min-h-4 absolute top-4 right-4`]}
        alt={`logo-for-video`}
        quality={100}
      />
    </div>
  );
};

const LoaderContainer = styled.div`
  ${tw`relative flex items-center justify-center`}
  width: 100px;
  height: 100px;
`;

const Loader = styled.div`
  ${tw`absolute border-3 border-white border-opacity-30 rounded-full`}
  width: 100%;
  height: 100%;
  animation: spin 1.5s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  &::after {
    content: "";
    ${tw`absolute top-0 start-0 border-3 border-white border-t-transparent rounded-full`}
    width: calc(100% - 8px);
    height: calc(100% - 8px);
  }
`;

const PlayButton = styled.button`
  ${tw`bg-white bg-opacity-70 rounded-full p-4 hover:bg-opacity-100 transition-all relative z-10`}
  width: 80px;
  height: 80px;
`;

export default VideoWatcher;
