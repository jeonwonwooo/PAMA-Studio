'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const ChatbotWidget = () => {
  const pathname = usePathname();
  const FLOWISE_CHATFLOW_ID = process.env.NEXT_PUBLIC_FLOWISE_CHATFLOW_ID;
  const FLOWISE_API_HOST = process.env.NEXT_PUBLIC_FLOWISE_API_HOST;

  // Don't show chatbot on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <Script
      src="https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js"
      type="module"
      strategy="afterInteractive"
      onLoad={() => {
        const bot = (window as any).Chatbot;

        if (!bot) {
          console.error("Terjadi kesalahan, hubungi admin.");
          return;
        }

        if (!FLOWISE_CHATFLOW_ID || !FLOWISE_API_HOST) {
          console.error("Terjadi kesalahan, hubungi admin.");
          console.error("NEXT_PUBLIC_FLOWISE_CHATFLOW_ID:", FLOWISE_CHATFLOW_ID);
          console.error("NEXT_PUBLIC_FLOWISE_API_HOST:", FLOWISE_API_HOST);
          return;
        }

        try {
          bot.init({
            chatflowid: FLOWISE_CHATFLOW_ID,
            apiHost: FLOWISE_API_HOST.replace(/\/$/, ""),
            theme: {
              button: {
                backgroundColor: "#8B1A1A",
                right: 20,
                bottom: 20,
                size: "large",
                zIndex: 9999,
                iconColor: "#ffffff",
              },
              chatWindow: {
                title: "PAMA Assistant 📸",
                titleAvatarSrc: "/logo.png",
                welcomeMessage: "Halo Kak! 👋 Selamat datang di PAMA Studio. Mau abadikan momen spesial apa hari ini? ✨",
                backgroundColor: "#FBF7F1",
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
                  placeholder: "Tanya paket, harga, atau rekomendasi...",
                  backgroundColor: "#ffffff",
                  textColor: "#1a0505",
                  placeholderColor: "#999999",
                  sendButtonColor: "#8B1A1A",
                  focus: {
                    backgroundColor: "#ffffff",
                    borderColor: "#8B1A1A",
                  },
                },
                feedback: {
                  color: "#8B1A1A",
                },
                footer: {
                  textColor: "#3a1a1a",
                  text: "Powered by PAMA Studio",
                  company: "PAMA Studio",
                  companyLink: "https://pama-studio.onrender.com",
                },
                starterPrompts: [
                  "Lihat Paket Foto",
                  "Cara Booking",
                  "Lokasi Studio",
                  "Cek Promo Terbaru"
                ],
              },
            },
          });

          console.log("PAMA Studio Assistant Initialized!");
        } catch (error) {
          console.error("Terjadi kesalahan, hubungi admin.", error);
        }
      }}
      onError={(error) => {
        console.error('Terjadi kesalahan, hubungi admin.', error);
      }}
    />
  );
};

export default ChatbotWidget;
