import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal } from "lucide-react";
import clsx from "clsx";
import io from "socket.io-client";

const socket = io("http://localhost:9999"); // or your deployed endpoint
const mySocketId = crypto.randomUUID(); // unique per tab

export default function GuideForum() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const message = {
      sender: "You",
      message: input.trim(),
      senderId: mySocketId,
      timestamp: new Date().toISOString(), // Set timestamp here
    };

    setMessages((prev) => [...prev, { ...message, fromSelf: true }]);
    socket.emit("chatMessage", message);
    setInput("");
  };

  useEffect(() => {
    socket.on("chatMessage", (msg) => {
      if (msg.senderId !== mySocketId) {
        setMessages((prev) => [...prev, { ...msg, fromSelf: false }]);
      }
    });

    socket.on("chatHistory", (history) => {
      const processed = history.map((msg) => ({
        ...msg,
        fromSelf: msg.senderId === mySocketId,
      }));
      setMessages(processed);
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] max-h-[85vh] px-4 py-2">
      <h2 className="text-lg font-semibold mb-2">My Classroom</h2>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx("flex flex-col", {
              "self-end items-end": msg.fromSelf,
              "self-start items-start": !msg.fromSelf,
            })}
          >
            {!msg.fromSelf && (
              <span className="text-xs font-semibold text-gray-500">
                {msg.sender}
              </span>
            )}
            <div
              className={clsx(
                "rounded-xl px-4 py-2 text-sm whitespace-pre-wrap shadow relative",
                msg.fromSelf
                  ? "bg-blue-100 text-gray-800"
                  : "bg-emerald-100 text-gray-800",
              )}
            >
              {msg.message}
              {msg.timestamp && (
                <div className="text-[10px] text-gray-500 mt-1 text-right">
                  {formatTime(msg.timestamp)}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t mt-2 pt-2 flex items-center gap-2">
        <Input
          placeholder="Write to Students..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend} size="icon" variant="outline">
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
