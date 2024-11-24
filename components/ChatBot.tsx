// ChatBot.tsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <>
      {/* Chat Bubble Button */}
      <div
        onClick={toggleChatbot}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          borderRadius: "50%",
          backgroundColor: "#007bff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          zIndex: 1000,
        }}
      >
        {/* Replace this with an icon or image as desired */}
        <span style={{ color: "#fff", fontSize: "24px" }}>💬</span>
      </div>

      {/* Chatbot Iframe */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "500px",
            zIndex: 999,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <iframe
            src="https://cdn.botpress.cloud/webchat/v2.2/shareable.html?configUrl=https://files.bpcontent.cloud/2024/11/24/04/20241124040730-5ZPYZ3CT.json"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allow="microphone; geolocation; camera"
          ></iframe>
        </motion.div>
      )}
    </>
  );
};

export default ChatBot;
