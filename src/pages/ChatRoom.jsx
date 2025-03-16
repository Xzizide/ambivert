import React from "react";
import { useEffect, useRef } from "react";

export default function ChatRoom() {
  var client_id = Date.now();

  var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);

  const localCamRef = useRef();

  const remoteCamRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        localCamRef.current.srcObject = stream;
        localCamRef.current.play();

        var mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = async function (event) {
          if (event.data.size > 0 && ws.readyState === WebSocket.OPEN) {
            ws.send(await event.data.bytes());
          }
        };

        mediaRecorder.start();

        setInterval(() => {
          mediaRecorder.stop();
          mediaRecorder.start();
        }, 500);
      });
  }, []);

  ws.onmessage = function (event) {
    var blob = new Blob([event.data], { type: "video/webm; codecs=vp8" });
    remoteCamRef.current.src = URL.createObjectURL(blob);
    remoteCamRef.current.play();
  };
  return (
    <main className="bg-amber-50 flex-auto flex">
      <div className="grid grid-cols-3 gap-3 m-3">
        <video
          ref={localCamRef}
          className="border-2 rounded-2xl bg-amber-500"
        ></video>
        <video
          ref={remoteCamRef}
          className="border-2 rounded-2xl bg-amber-500"
        ></video>
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
