import React from "react";
import { useRef, useEffect, useMemo } from "react";

export default function VideoFrame({ client_id, src }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.play();
  }, []);

  return (
    <div className="relative w-64 h-48 border-2 border-gray-400 rounded-lg overflow-hidden">
      <video
        ref={ref}
        src={src}
        autoPlay
        className="w-full h-full object-cover"
      ></video>

      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
        {client_id}
      </div>
    </div>
  );
}
