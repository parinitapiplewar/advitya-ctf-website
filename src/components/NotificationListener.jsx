"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "react-toastify";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function NotificationListener() {
  const { token } = useAuth();
  const [firstBlood, setFirstBlood] = useState(null);

  useNotifications((event) => {
    if (event.type === "FIRST_BLOOD") {
      setFirstBlood({
        user: event.user,
        team: event.team,
        challenge: event.challenge,
        value: event.value,
        startTime: Date.now(),
      });

      setTimeout(() => {
        setFirstBlood(null);
      }, 5000);
    }

    if (event.type === "SOLVE") {
      toast.info(event.message, {
        position: "bottom-right",
        autoClose: 4000,
        theme: "dark",
      });
    }
  }, token);

  const glitterParticles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 0.3,
    duration: 2 + Math.random() * 1,
  }));

  return (
    <>
      {firstBlood && (
        <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/40" />

          {/* Glitter particles */}
          {glitterParticles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-1 h-1 bg-white rounded-full animate-glitter"
              style={{
                left: `${particle.left}%`,
                top: "-10px",
                animation: `glitter ${particle.duration}s linear ${particle.delay}s infinite`,
                opacity: 0.8,
              }}
            />
          ))}

          {/* Main content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 animate-fadeIn">
            {/* Top accent line */}
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-white to-transparent mb-8" />

            {/* Main title - Red and Pulsating */}
            <div className="relative">
              {/* Red glow effect */}
              <div className="absolute -inset-20 blur-3xl bg-red-600/20 opacity-70 animate-pulse" />

              <h1
                className="relative text-center font-black text-red-500 tracking-tighter animate-pulse"
                style={{
                  fontSize: "clamp(48px, 9vw, 120px)",
                  textShadow:
                    "0 0 40px rgba(239, 68, 68, 0.8), 0 4px 20px rgba(0, 0, 0, 0.8), 0 0 60px rgba(239, 68, 68, 0.5)",
                  letterSpacing: "-2px",
                  lineHeight: "1",
                }}
              >
                FIRST BLOOD
              </h1>

              {/* Bottom accent line */}
              <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mt-8 mx-auto" />
            </div>

            {/* Event details - Single line */}
            <div className="mt-16 text-center max-w-5xl">
              <p
                className="text-white font-bold tracking-wide"
                style={{ fontSize: "clamp(18px, 3vw, 40px)" }}
              >
                <span className="text-red-400">{firstBlood.user}</span>
                {firstBlood.team && (
                  <>
                    {" "}
                    <span className="text-white/70">from</span>{" "}
                    <span className="text-white/90">{firstBlood.team}</span>
                  </>
                )}
                {" "}
                <span className="text-white/70">solved</span>{" "}
                <span className="text-yellow-400">{firstBlood.challenge}</span>
                {" "}
                <span className="text-white/70">for</span>{" "}
                <span className="text-green-400 font-black">+{firstBlood.value} pts</span>
              </p>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-12 w-20 h-1 bg-red-500/50" />
          </div>

          <style>{`
            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes glitter {
              0% {
                transform: translateY(0) translateX(0);
                opacity: 0.8;
              }
              100% {
                transform: translateY(100vh) translateX(${Math.random() * 100 - 50}px);
                opacity: 0;
              }
            }

            .animate-fadeIn {
              animation: fadeIn 0.6s ease-out forwards;
            }
          `}</style>
        </div>
      )}
    </>
  );
}