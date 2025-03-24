import React from "react";
import { useRef, useEffect } from "react";

export default function VideoFrame({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current.play();
  }, []);
  return <video ref={ref} src={src} autoPlay></video>;
}
