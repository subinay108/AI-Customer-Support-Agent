import { useState, useRef, type ChangeEvent, useEffect } from "react";
import ReactMarkdown from "react-markdown";

type Message = {
  sender: "user" | "agent";
  text?: string;
  image?: string | null;
};

import './chatSupport.css';

export default function ChatSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {sender: 'agent', text: 'Hi, I am an AI Customer Support agent. How can I help you?'}
  ]);
  const [input, setInput] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  // const handleSend = () => {
  //   if (!input && !image) return;

  //   const userMessage: Message = {
  //     sender: "user",
  //     text: input || undefined,
  //     image: image ? URL.createObjectURL(image) : null,
  //   };

  //   setMessages((prev) => [...prev, userMessage]);
  //   setInput("");
  //   setImage(null);
  //   setLoading(true);

  //   // simulate agent reply after delay
  //   setTimeout(() => {
  //     setLoading(false);
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         sender: "agent",
  //         text: "Here is the agent’s answer to your query.",
  //       },
  //     ]);
  //   }, 2000);
  // };

  const handleSend = async () => {
    if (!input && !image) return;

    const userMessage: Message = {
      sender: "user",
      text: input || undefined,
      image: image ? URL.createObjectURL(image) : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setImage(null);
    setLoading(true);

    try {
      // Call your FastAPI backend
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // Add agent's reply
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: data.response || "⚠️ No response from server.",
        },
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "agent",
          text: "❌ Failed to connect to server.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-avatar">
          {/* <img src="" /> */}
        </div>
        <div>
          <div className="agent-name">AI Agent</div>
          <div className="agent-status">Online</div>
        </div>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.map((msg, index) => (
          <div key={index} className="message-container">
            {msg.sender === 'agent' && (
              <div className="chat-avatar">
              </div>
            )}
            <div
              className={`message ${msg.sender === "user" ? "user" : "agent"}`}
            >
              {msg.text && <p><ReactMarkdown>{msg.text}</ReactMarkdown></p>}
              {msg.image && <img src={msg.image} alt="uploaded" />}
            </div>
          </div>
        ))}
        {loading && (
          <div className="message-container">
            <div className="chat-avatar"></div>
            <div className="message agent">
              <div className="typing">
                <p>
                <span></span>
                <span></span>
                <span></span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="input-box">
        <input
          type="text"
          placeholder="Type your query..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <input style={{ display: 'none' }} type="file" onChange={handleFileChange} />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
