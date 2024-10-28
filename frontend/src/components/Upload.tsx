"use client";

import axios from "axios";
import { useRef } from "react";

export function Upload({ id }: { id: string }) {
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const thumbnailRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const title = titleRef.current?.value;
    const description = descriptionRef.current?.value;
    const author = authorRef.current?.value;
    const thumbnail = thumbnailRef.current?.files?.[0];
    const video = videoRef.current?.files?.[0];

    if (!title || !description || !author || !thumbnail || !video) {
      alert("Please fill all the fields");
      return;
    }

    const chunkSize = 1024 * 1024 * 5; // 5MB chunk size
    const totalChunks = Math.ceil(video.size / chunkSize);

    let start = 0;
    const uploadPromises = [];

    for (let i = 0; i < totalChunks; i++) {
      const chunk = video.slice(start, start + chunkSize);
      start += chunkSize;

      const chunkFormData = new FormData();
      chunkFormData.append("filename", video.name);
      chunkFormData.append("chunk", chunk);
      chunkFormData.append("totalChunks", totalChunks.toString());
      chunkFormData.append("chunkIndex", i.toString());

      uploadPromises.push(
        axios.post("http://localhost:3001/upload/initiate", chunkFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
      );
    }

    await Promise.all(uploadPromises);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("thumbnail", thumbnail);
    formData.append("filename", video.name);
    formData.append("id", id);

    await axios.put(process.env.NEXT_PUBLIC_UPLOAD_URL as string, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg p-10">
      <div className="mb-4">
        <input
          className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
          type="text"
          name="title"
          id="title"
          placeholder="Title"
          ref={titleRef}
        />
      </div>
      <div className="mb-4">
        <input
          className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
          type="text"
          name="description"
          id="description"
          placeholder="Description"
          ref={descriptionRef}
        />
      </div>
      <div className="mb-4">
        <input
          className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500 text-black"
          type="text"
          name="author"
          id="author"
          placeholder="Author"
          ref={authorRef}
        />
      </div>
      <div className="mb-4">
        <input
          className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          type="file"
          name="thumbnail"
          id="thumbnail"
          accept="image/*"
          ref={thumbnailRef}
        />
      </div>
      <div className="mb-4">
        <input
          className="px-3 py-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
          type="file"
          name="video"
          id="video"
          accept="video/*"
          ref={videoRef}
        />
      </div>
      <button
        type="button"
        onClick={handleUpload}
        className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Upload
      </button>
    </div>
  );
}
