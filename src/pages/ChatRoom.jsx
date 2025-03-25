import React from "react";
import { useEffect, useRef, useState } from "react";
import VideoFrame from "../components/VideoFrame";

export default function ChatRoom() {
  const [clients, setClients] = useState({});

  const [client_id, setClient_id] = useState();

  const [messages, setMessages] = useState([]);

  const websocketRef = useRef();

  useEffect(() => {
    var date_client_id = Date.now();

    setClient_id(date_client_id);

    var ws = new WebSocket(`ws://localhost:8000/ws/${date_client_id}`);

    websocketRef.current = ws;

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
      } else if (typeof event.data === "object") {
        event.data
          .slice(22, 29)
          .text()
          .then((text) => {
            if (text === "message") {
              var message_blob = event.data.slice(13);
              message_blob.text().then((message_content) => {
                setMessages((prev) => [
                  ...prev,
                  JSON.parse(message_content).message,
                ]);
              });
            } else {
              var sending_id = event.data.slice(0, 13);
              sending_id.text().then((text) => {
                var blob_data = event.data.slice(13);
                var blob = new Blob([blob_data], {
                  type: "video/webm; codecs=vp8",
                });
                setClients((prev) => ({
                  ...prev,
                  [text]: URL.createObjectURL(blob),
                }));
              });
            }
          });
      }
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
    <main className="bg-amber-50 flex-auto flex">
      <div className="grid grid-cols-3 gap-3 m-3">
        {Object.entries(clients).map(([id, blob]) => {
          return <VideoFrame key={id} client_id={id} src={blob}></VideoFrame>;
        })}
      </div>

      <div>
        <div className="max-w-md mx-auto bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 h-64 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 p-2 rounded-lg max-w-[80%] ${
                  message.sender === client_id
                    ? "bg-blue-500 text-white self-end ml-auto"
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
              className="flex-grow mr-2 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
