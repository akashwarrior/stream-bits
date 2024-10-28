import { HomeVideo } from "@/components/HomeVideo";
import { NavBar } from "@/components/NavBar";
import prisma from "@/db";

export default async function Home() {
  const videos = await prisma.video.findMany({ take: 10 });

  return (
    <div>
      <NavBar />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 m-10">
        {videos.map((video) => (
          <HomeVideo video={video} key={video.id} />
        ))}
      </div>
    </div>
  );
}
