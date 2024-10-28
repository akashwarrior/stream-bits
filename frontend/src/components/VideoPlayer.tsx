"use client";

import { Video } from "@prisma/client";
import Hls from "hls.js";
import { useEffect, useRef } from "react";

export function VideoPlayer({
  video,
  timeStamp,
}: {
  video: Video;
  timeStamp?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videos = videoRef.current!;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(video.url);
      hls.attachMedia(videos);

      hls.on(Hls.Events.MANIFEST_PARSED, function () {
        videos.currentTime = parseFloat(timeStamp || "0");
        videos.play();
      });

      hls.on(Hls.Events.ERROR, () => {
        videos.src = video.url;
        videos.currentTime = parseFloat(timeStamp || "0");
        videos.play();
      });

      return () => {
        hls.destroy();
      };
    } else {
      videos.src = video.url;
      videos.currentTime = parseFloat(timeStamp || "0");
      videos.play();
    }

    return () => {
      videos.pause();
    };
  }, []);

  return <video ref={videoRef} controls className="w-full h-fit rounded-md"></video>;
}
