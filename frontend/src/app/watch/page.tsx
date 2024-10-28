import { HomeVideo } from "@/components/HomeVideo";
import { NavBar } from "@/components/NavBar";
import { VideoMetaData } from "@/components/VideoMetaData";
import { VideoPlayer } from "@/components/VideoPlayer";
import prisma from "@/db";
import { redirect } from "next/navigation";

export default async function watchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { v: videoId, t: timeStamp } = await searchParams;

  if (!videoId) {
    redirect("/");
  }

  const videos = await prisma.video.findMany({ take: 2 });

  const video = await prisma.video.findUnique({
    where: {
      id: videoId,
    },
  });

  if (!video) {
    redirect("/");
  }

  return (
    <div>
      <NavBar />
      <main className="flex">
        <div className="flex-1 m-5">
          <VideoPlayer video={video} timeStamp={timeStamp} />
          <VideoMetaData video={video} />
        </div>
        <div className="w-1/4 flex flex-col m-4 gap-5">
          {videos.map((video) => (
            <HomeVideo video={video} key={video.id} />
          ))}
        </div>
      </main>
    </div>
  );
}
