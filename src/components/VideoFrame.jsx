import React from "react";
import { useRef, useEffect } from "react";

export default function VideoFrame() {
  const camera_ref = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        camera_ref.current.srcObject = stream;
        camera_ref.current.play();
      });
  }, []);
  return (
    <div>
      <video
        ref={camera_ref}
        className="border-2 rounded-2xl bg-amber-500"
      ></video>
    </div>
  );
}
