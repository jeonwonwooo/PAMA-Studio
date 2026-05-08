'use client';

import Script from 'next/script';

const ChatbotWidget = () => {
  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
      type="module"
      strategy="afterInteractive"
      onLoad={() => {
        const bot = (window as any).Chatbot;
        if (bot) {
          bot.init({
            chatflowid: process.env.FLOWISE_CHATFLOW_ID,
            apiHost: process.env.FLOWISE_API_HOST || "http://localhost:3000",
            theme: {
              button: {
                backgroundColor: "#8B1A1A", // PAMA Brand Red Maroon
                right: 20,
                bottom: 20,
                size: "large",
                zIndex: 9999,
                iconColor: "#ffffff",
              },
              chatWindow: {
                title: "PAMA Assistant",
                titleAvatarSrc: "/logo.png",
                welcomeMessage: "Halo! 👋 Ada yang bisa kami bantu? Tanya tentang paket atau jadwal booking kami.",
                backgroundColor: "#FBF7F1", // PAMA Cream Background
                fontSize: 14,
                fontFamily: "'Inter', sans-serif",
                botMessage: {
                  backgroundColor: "#FFF8E7",
                  textColor: "#1a0505",
                  showAvatar: true,
                  avatarSrc: "/logo.png",
                },
                userMessage: {
                  backgroundColor: "#8B1A1A",
                  textColor: "#ffffff",
                },
                textInput: {
                  placeholder: "Tanya paket, harga, atau jadwal...",
                  backgroundColor: "#ffffff",
                  textColor: "#1a0505",
                  placeholderColor: "#999999",
                  sendButtonColor: "#8B1A1A",
                  focus: {
                    backgroundColor: "#ffffff",
                    borderColor: "#8B1A1A",
                  }
                }
              }
            }
          });
        }
      }}
    />
  );
};

export default ChatbotWidget;