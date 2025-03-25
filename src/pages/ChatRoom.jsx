import React from "react";
import { useEffect, useRef, useState } from "react";
import VideoFrame from "../components/VideoFrame";

export default function ChatRoom() {
  const [clients, setClients] = useState({});

  useEffect(() => {
    var client_id = Date.now();

    var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);

    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
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

    ws.onmessage = function (event) {
      if (typeof event.data === "string") {
        var client_event = event.data;
        client_event = client_event
          .replace("[", "")
          .replace("]", "")
          .split(",");
        if (client_event[0] === '"disconnect"') {
          setClients((prev) => {
            var client_id = client_event[1];
            const { [client_id]: _, ...rest } = prev;
            return rest;
          });
        }
      } else {
        var sending_id = event.data.slice(0, 13);
        sending_id.text().then((text) => {
          var blob_data = event.data.slice(13);
          var blob = new Blob([blob_data], { type: "video/webm; codecs=vp8" });
          setClients((prev) => ({
            ...prev,
            [text]: URL.createObjectURL(blob),
          }));
        });
      }
    };
  }, []);

  return (
    <main className="bg-amber-50 flex-auto flex">
      <div className="grid grid-cols-3 gap-3 m-3">
        {Object.entries(clients).map(([id, blob]) => {
          return <VideoFrame key={id} client_id={id} src={blob}></VideoFrame>;
        })}
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
