'use client';

import Script from 'next/script';

const ChatbotWidget = () => {
  // Ambil nilai dari Environment Variables (Harus diisi di Render/Vercel)
  const FLOWISE_CHATFLOW_ID = process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID; 
  const FLOWISE_API_HOST = process.env.NEXT_PUBLIC_FLOWISE_API_HOST; 

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js" 
      type="module"
      strategy="afterInteractive"
      onLoad={() => {
        const bot = (window as any).Chatbot;
        
        if (!bot) {
          console.error("❌ Error: Library Flowise belum dimuat.");
          return;
        }

        // Validasi Data
        if (!FLOWISE_CHATFLOW_ID || !FLOWISE_API_HOST) {
          console.error("❌ Error: Environment Variables belum diset!");
          console.log("Cek terminal untuk melihat pesan error detail.");
          return;
        }

        console.log("✅ Bot Loading...");
        console.log("Target Server:", FLOWISE_API_HOST);
        console.log("Target ID:", FLOWISE_CHATFLOW_ID);

        try {
          bot.init({
            chatflowid: FLOWISE_CHATFLOW_ID,
            
            // Paksa gunakan URL dari env, pastikan format https://tanpa-slash
            apiHost: FLOWISE_API_HOST.replace(/\/$/, ""), 
            
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
        } catch (error) {
          console.error("❌ Error initializing bot:", error);
        }
      }}
      onError={(error) => {
        console.error('❌ Failed to load chatbot script:', error);
      }}
    />
  );
};

export default ChatbotWidget;