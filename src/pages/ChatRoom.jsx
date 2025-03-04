import React from "react";
import VideoFrame from "../components/VideoFrame";

export default function ChatRoom() {
  return (
    <main className="bg-amber-50 flex-auto">
      <div className="grid grid-cols-3 gap-3 m-3">
        <VideoFrame></VideoFrame>
        <VideoFrame></VideoFrame>
        <VideoFrame></VideoFrame>
      </div>
    </main>
  );
}
