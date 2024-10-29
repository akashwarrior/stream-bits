"use client";

import { HomeVideo } from "@/components/HomeVideo";
import { NavBar } from "@/components/NavBar";
import getVideos from "@/lib/actions/getVideos";
import { Video } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Home() {
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    getVideos().then((data) => {
      setVideos(data);
    });
  }, []);

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-10">
        {videos?.map((video) => (
          <HomeVideo video={video} key={video.id} />
        ))}
      </div>
    </div>
  );
}
