import React from "react";
import { useRef, useEffect, useState } from "react";

export default function VideoFrame({ client_id, src }) {
  const [muteAudio, setMuteAudio] = useState(false);
  const [muteAudioText, setMuteAudioText] = useState("Mute");

  const handleMuteAudio = (e) => {
    e.preventDefault();

    if (muteAudio) {
      setMuteAudio(false);
      setMuteAudioText("Mute");
    } else {
      setMuteAudio(true);
      setMuteAudioText("Unmute");
    }
  };

  const ref = useRef(null);

  useEffect(() => {
    ref.current.play();
  }, []);

  return (
    <div className="relative w-80 h-60 border-2 border-gray-400 rounded-lg overflow-hidden">
      <video
        ref={ref}
        src={src}
        autoPlay
        className="w-full h-full object-cover"
        muted={muteAudio}
      ></video>

      <button
        onClick={handleMuteAudio}
        className="absolute bottom-2 left-2 bg-pink-600 bg-opacity-50 text-white px-2 py-1 rounded-md text-xs"
      >
        {muteAudioText}
      </button>

      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded-md text-xs">
        {client_id}
      </div>
    </div>
  );
}
