"use client";

export default function StartPage({ onStart }) {
  return (
    <div
      className="!bg-transparent w-screen h-screen flex flex-col justify-center items-center select-none font-sans text-black"
      style={{
        backgroundImage: "url('/bg.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* 內容 */}
      <div className="border-4 border-black bg-white bg-opacity-80 px-6 py-6 rounded-none shadow-[4px_4px_0px_#222] mb-8 max-w-[420px] w-full flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold mb-2">Welcome to Wawa Machine World!</h1>
        <p className="text-base font-medium leading-relaxed">
          帶走你的煩惱，放鬆心情，享受趣味娃娃機的樂趣！
        </p>
      </div>
      <button
        onClick={onStart}
        className="w-[180px] bg-[#6ec1e4] border-4 border-black rounded-none text-black font-bold py-4 shadow-[4px_4px_0px_#222] hover:bg-[#3b9edb] hover:shadow-[8px_8px_0px_#222] hover:-translate-y-1 hover:scale-105 transition text-center"
      >
        開始遊戲
      </button>
    </div>
  );
}
