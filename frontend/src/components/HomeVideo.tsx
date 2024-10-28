"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Hls from "hls.js";
import { Video } from "@prisma/client";

export function HomeVideo({ video }: { video: Video }) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const durationRef = useRef<HTMLInputElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    if (isPlaying) {
      if (Hls.isSupported()) {
        if (hlsRef.current == null) {
          hlsRef.current = new Hls();
        }
        hlsRef.current.lowLatencyMode = true;
        hlsRef.current.loadSource(video.url);
        hlsRef.current.attachMedia(videoRef.current!);

        hlsRef.current.on(Hls.Events.ERROR, () => {
          videoRef.current!.src = video.url;
        });
      } else {
        videoRef.current!.src = video.url;
      }

      videoRef!.current?.addEventListener('loadeddata', () => {
        durationRef.current!.max = videoRef.current!.duration.toString();
      });

      videoRef.current!.currentTime = parseFloat(durationRef.current?.value ?? "0");
      videoRef.current!.addEventListener("timeupdate", () => {
        durationRef.current!.value = videoRef.current!.currentTime.toString();
      });
      videoRef.current!.play();
    } else {
      videoRef.current!.pause();
    }

    return () => {
      videoRef.current?.removeEventListener("timeupdate", () => { });
      videoRef.current?.pause();
    };
  }, [isPlaying]);

  return (
    <div
      onClick={(e) => {
        if (e.target instanceof HTMLInputElement) return;
        router.push(`/watch?v=${video.id}&t=${durationRef.current?.value.toString()}`)
      }}
      onMouseEnter={() => setIsPlaying(true)}
      onMouseLeave={() => setIsPlaying(false)}
      className="border rounded-md overflow-hidden hover:scale-105 transition-all duration-200 group active:scale-100 cursor-pointer"
    >
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-40 object-cover block group-hover:hidden"
      />
      <div className="hidden group-hover:block relative">
        <video
          className="w-full h-40 object-cover pointer-events-none"
          autoPlay
          muted
          ref={videoRef}
        />
        <input
          type="range"
          ref={durationRef}
          onClick={(e) => e.preventDefault()}
          defaultValue={0}
          onChange={(e) => {
            videoRef.current!.currentTime = parseFloat(e.target.value);
          }}
          className="accent-red-500 absolute z-20 -bottom-1 left-0 w-full h-1 rounded-lg cursor-pointer hover:h-1.5 transition-all duration-200"
        />
      </div>

      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">{video.title}</h2>
        <p className="text-gray-700">{video.author}</p>
        <p className="text-gray-700">{video.description}</p>
      </div>
    </div>
  );
}
