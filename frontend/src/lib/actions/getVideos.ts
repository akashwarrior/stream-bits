"use server";

import prisma from "@/db";

export default async function getVideos() {
    const videos = await prisma.video.findMany();
    return videos;
}
