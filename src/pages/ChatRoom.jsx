import React from "react";
import VideoFrame from "../components/VideoFrame";

export default function ChatRoom() {
  return (
    <main className="bg-amber-50 flex-auto flex">
      <div className="grid grid-cols-3 gap-3 m-3">
        <VideoFrame></VideoFrame>
        <VideoFrame></VideoFrame>
        <VideoFrame></VideoFrame>
      </div>
      <div className="w-200 border rounded-2xl flex flex-col justify-between items-end">
        <ul className="flex flex-col items-end">
          <li>emil: hello</li>
          <li>another: hi</li>
          <li>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Dignissimos, numquam. Qui possimus eaque eum voluptatibus magni
            quia. Hic suscipit eum ducimus sapiente, vel reprehenderit, ut
            recusandae fugiat reiciendis, nobis tempora!
          </li>
        </ul>
        <input type="text" name="" id="" className="w-120" />
      </div>
    </main>
  );
}
