'use client';

import Script from 'next/script';

const ChatbotWidget = () => {
  const FLOWISE_CHATFLOW_ID = process.env.FLOWISE_CHATFLOW_ID; 

  return (
    <Script
      // ✅ PENTING: src HARUS CDN, BUKAN URL SERVER
      src="https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js" 
      type="module"
      strategy="afterInteractive"
      onLoad={() => {
        const bot = (window as any).Chatbot;
        
        if (bot) {
          console.log("✅ Bot Loading...");
          
          bot.init({
            chatflowid: FLOWISE_CHATFLOW_ID, // Gunakan ID Baru
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
                title: "PAMA Assistant 📸",
                titleAvatarSrc: "/logo.png",
                welcomeMessage: "Halo Kak! 👋 Selamat datang di Pama Studio. Mau abadikan momen spesial apa hari ini? ✨",
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
          
          console.log("✅ Pama Bot Initialized & Connected to YOUR Server!");
        } else {
          console.error("❌ Chatbot script failed to load.");
        }
      }}
      onError={(error) => {
        console.error('❌ Failed to load chatbot script:', error);
      }}
    />
  );
};

export default ChatbotWidget;