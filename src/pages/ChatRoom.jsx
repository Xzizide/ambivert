import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoFrame from "../components/VideoFrame";

export default function ChatRoom() {
  const [clients, setClients] = useState({});

  const [client_id, setClient_id] = useState();

  const [messages, setMessages] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const websocketRef = useRef();

  const streamRef = useRef();

  useEffect(() => {
    setClient_id(searchParams.get("client_id"));

    var ws = new WebSocket(
      `ws://localhost:8000/v1/ws/${searchParams.get("client_id")}/${searchParams.get("personal_description")}`
    );

    websocketRef.current = ws;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        streamRef.current = stream;
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
            client_id = client_id.slice(1, -1);
            const { [client_id]: _, ...rest } = prev;
            return rest;
          });
        }
      } else if (typeof event.data === "object") {
        event.data.text().then((text) => {
          var name_separation_index = text.search("n4m3s3p4r4tor");
          if (
            text.slice(
              name_separation_index + 22,
              name_separation_index + 29
            ) === "message"
          ) {
            var message_blob = event.data.slice(name_separation_index + 13);
            message_blob.text().then((message_content) => {
              setMessages((prev) => [
                ...prev,
                JSON.parse(message_content).message,
              ]);
            });
          } else {
            var sending_id = text.slice(0, name_separation_index);
            var blob_data = event.data.slice(name_separation_index + 13);
            var blob = new Blob([blob_data], {
              type: "video/webm; codecs=vp8",
            });
            setClients((prev) => ({
              ...prev,
              [sending_id]: URL.createObjectURL(blob),
            }));
          }
        });
      }
    };
    return () => {
      ws.close();
      streamRef.current.getTracks().forEach(function (track) {
        track.stop();
      });
    };
  }, []);

  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: client_id,
    };

    websocketRef.current.send(
      new Blob([JSON.stringify({ type: "message", message: newMessage })])
    );

    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const bottomMessagesRef = useRef();

  useEffect(() => {
    bottomMessagesRef.current?.scrollIntoView();
  }, [messages]);

  return (
    <main className="bg-pink-100 flex-auto flex">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 m-20">
        {Object.entries(clients).map(([id, blob]) => {
          return <VideoFrame key={id} client_id={id} src={blob}></VideoFrame>;
        })}
      </div>

      <div className="w-100 mx-auto mr-0 bg-white flex flex-col max-h-177">
        <div className="p-4 flex-grow overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                message.sender === client_id
                  ? "bg-pink-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-black mr-auto"
              }`}
            >
              {message.sender}: {message.text}
            </div>
          ))}
          <div ref={bottomMessagesRef}></div>
        </div>

        <div className="flex p-4 border-t border-gray-200">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-100 block text-sm font-medium text-gray-700"
          />
          <button
            onClick={handleSendMessage}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
