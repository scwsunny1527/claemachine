"use client";

import { useState, useRef } from "react";
import FloatingWidget from "@/component/FloatingWidget";
import MusicButton from "@/component/MusicButton";
import ResetButton from "@/component/ResetButton";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  RoundedBox,
  CameraControls,
  Environment,
  useGLTF,
  ContactShadows,
  PerspectiveCamera,
  KeyboardControls,
  useKeyboardControls,
  Box,
} from "@react-three/drei";
import gsap from "gsap";
import React, { Suspense } from "react";

// 熊娃娃資料
const bearTypes = [
  {
    name: "Lazy Bear（懶懶熊）",
    description:
      "慢吞吞、最愛打瞌睡，什麼都懶得動。垂垂的眼睛、鬆軟的肚肚、常抱著枕頭或毛毯。",
    quote: "“Can I nap here forever...?”",
    img: "/41.webp",
  },
  {
    name: "Chubby Bear（胖胖熊）",
    description:
      "超愛吃，總在找甜甜圈或蜂蜜。圓滾滾、有顆閃亮的鼻子，嘴邊常沾點糖霜。",
    quote: "“Snack first, everything later!”",
    img: "/42.webp",
  },
  {
    name: "Coolio Bear（酷熊）",
    description:
      "帥氣自信、喜歡滑板和音樂，走到哪都很有風格。戴墨鏡、耳機或棒球帽。",
    quote: "“Stay chill, stay cool.”",
    img: "/43.webp",
  },
];

// 沒中獎角色
const goneBear = {
  name: "Gone Bear（消失熊）",
  description:
    "他不是你錯過的娃娃，而是「你沒夾到的空氣本身」，他從來不在機台裡。沒人見過他，永遠出現在「沒有出現」的那一刻。",
  img: "/44.webp",
};

// ResultModal 元件
function ResultModal({ isWin, prizeIndex, onClose }) {
  const currentBear = isWin ? bearTypes[prizeIndex] : goneBear;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="result-title"
      aria-describedby="result-desc"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      <div
        className="bg-white border-4 border-black shadow-[4px_4px_0_#222] rounded-none p-6 max-w-[360px] w-full text-center select-none"
        onClick={(e) => e.stopPropagation()}
        style={{
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          color: "#000",
        }}
      >
        <img
          src={currentBear.img}
          alt={currentBear.name}
          className="mx-auto mb-4 w-40 h-40 object-cover border-4 border-black shadow-[4px_4px_0_#222]"
          style={{ imageRendering: "pixelated" }}
        />
        <h2
          id="result-title"
          className="font-extrabold text-2xl mb-2"
          style={{ textShadow: "none", color: "#ff6600" }}
        >
          {isWin ? "中獎了" : "沒中獎"}
        </h2>
        <h3
          className="font-bold text-xl mb-2"
          style={{ textShadow: "none", color: "#000" }}
        >
          {currentBear.name}
        </h3>
        <p
          className="font-medium text-base mb-2"
          style={{ textShadow: "none", color: "#000" }}
        >
          {currentBear.description}
        </p>
        {isWin && (
          <p
            className="italic text-sm"
            style={{ textShadow: "none", color: "#3b9edb" }}
          >
            {currentBear.quote}
          </p>
        )}
        <button
          onClick={onClose}
          className="mt-6 bg-[#6ec1e4] border-4 border-black shadow-[4px_4px_0_#222] rounded-none py-3 px-8 font-bold text-black transition hover:bg-[#3b9edb] hover:shadow-[8px_8px_0_#222]"
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          }}
        >
          確定
        </button>
      </div>
    </div>
  );
}

function ClawModel({ clawPos, isLowering, hasPrize, prizeIndex }) {
  const clawModel = useGLTF("/claw.glb");
  const clawModelRef = useRef();

  useFrame(() => {
    if (clawModelRef.current) {
      clawModelRef.current.traverse((child) => {
        if (child.name === "claw")
          child.position.set(clawPos.x, clawPos.y, clawPos.z);
        if (isLowering) return;
        if (child.name === "clawBase")
          child.position.set(clawPos.x, clawPos.y + 0.15, clawPos.z);
        if (child.name === "track")
          child.position.set(0.011943, clawPos.y + 0.15, clawPos.z);
        if (child.name === "bearClassic")
          child.visible = hasPrize && prizeIndex === 0;
        if (child.name === "bearSnow") child.visible = hasPrize && prizeIndex === 1;
        if (child.name === "bearRainbow")
          child.visible = hasPrize && prizeIndex === 2;
      });
    }
  });

  return <primitive ref={clawModelRef} object={clawModel.scene} scale={[0.6, 0.6, 0.6]} />;
}

function Camera({
  setClawPos,
  boxRef,
  clawPos,
  isLowering,
  setIsLowering,
  hasPrize,
  setHasPrize,
  prizeIndex,
  setPrizeIndex,
  winCount,
  setWinCount,
  setShowResultModal,
  setModalIsWin,
  setModalPrizeIndex,
}) {
  const cameraRef = useRef();
  const [, getKeys] = useKeyboardControls();

  useFrame(() => {
    if (cameraRef.current) cameraRef.current.lookAt(0, 1, 0);
  });

  useFrame(() => {
    const { forward, backward, left, right, jump } = getKeys();
    const speed = 0.01;
    const limitX = 0.4;
    const limitZ = 0.4;

    if (boxRef.current && !isLowering) {
      if (forward)
        setClawPos({ x: clawPos.x, y: clawPos.y, z: Math.max(clawPos.z - speed, -limitZ) });
      if (backward)
        setClawPos({ x: clawPos.x, y: clawPos.y, z: Math.min(clawPos.z + speed, limitZ) });
      if (left)
        setClawPos({ x: Math.max(clawPos.x - speed, -limitX), y: clawPos.y, z: clawPos.z });
      if (right)
        setClawPos({ x: Math.min(clawPos.x + speed, limitX), y: clawPos.y, z: clawPos.z });

      if (jump) {
        setHasPrize(false);
        setIsLowering(true);

        const random = Math.random();
        let isWin = false;
        let prizeIdx = -1;

        if (random < 0.15) {
          isWin = true;
          prizeIdx = 0;
        } else if (random < 0.3) {
          isWin = true;
          prizeIdx = 1;
        } else if (random < 0.45) {
          isWin = true;
          prizeIdx = 2;
        } else {
          isWin = false;
          prizeIdx = -1;
        }

        gsap.timeline()
          .to(clawPos, { y: 2, duration: 2 })
          .to(clawPos, { y: 2.7, duration: 3 })
          .then(() => {
            setIsLowering(false);
            setHasPrize(isWin);
            setPrizeIndex(prizeIdx);
            if (isWin) {
              setWinCount(winCount + 1);
            }
            setModalIsWin(isWin);
            setModalPrizeIndex(prizeIdx);
            setShowResultModal(true);
          });
      }
    }
  });

  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1, 3]} />;
}

export default function Home() {
  const [started, setStarted] = useState(false);

  const boxRef = useRef();
  const isHidden = true;

  const [clawPos, setClawPos] = useState({ x: -0.4, y: 2.7, z: 0.2 });
  const [isLowering, setIsLowering] = useState(false);
  const [hasPrize, setHasPrize] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(-1);

  const [winCount, setWinCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [showResultModal, setShowResultModal] = useState(false);
  const [modalIsWin, setModalIsWin] = useState(false);
  const [modalPrizeIndex, setModalPrizeIndex] = useState(-1);

  const resetClaw = () => {
    if (!isLowering) {
      setClawPos({ x: -0.4, y: 2.7, z: 0.2 });
      setHasPrize(false);
      setPrizeIndex(-1);
    }
  };

  const toggleMusic = () => setIsPlaying((prev) => !prev);

  if (!started) {
    return (
      <div
        className="w-full min-h-[100vh] flex flex-col justify-center items-center bg-cover bg-center select-none font-sans text-black"
        style={{ backgroundImage: "url('/bg.webp')" }}
      >
        <div className="border-4 border-black bg-white bg-opacity-80 px-6 py-6 rounded-none shadow-[4px_4px_0px_#222] mb-8 max-w-[420px] w-full flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold mb-2">Welcome to Wawa Machine World!</h1>
          <p className="text-base font-medium leading-relaxed">
            帶走你的煩惱，放鬆心情，享受趣味娃娃機的樂趣！
          </p>
        </div>
        <button
          onClick={() => setStarted(true)}
          className="w-[180px] bg-[#6ec1e4] border-4 border-black rounded-none text-black font-bold py-4 shadow-[4px_4px_0px_#222] hover:bg-[#3b9edb] hover:shadow-[8px_8px_0px_#222] hover:-translate-y-1 hover:scale-105 transition text-center"
        >
          開始遊戲
        </button>
      </div>
    );
  }
  

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(135deg, #e0f0ff 0%, #6ec1e4 100%)",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        color: "#000",
        userSelect: "none",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* 左上角控制區 */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          zIndex: 3000,
        }}
      >
        <FloatingWidget />
        <MusicButton isPlaying={isPlaying} toggleMusic={toggleMusic} />
        <ResetButton onClick={resetClaw} disabled={isLowering} />
      </div>

      {/* 右上角中獎次數 */}
      <div
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          backgroundColor: "#6ec1e4",
          padding: "8px 16px",
          border: "4px solid #000",
          boxShadow: "4px 4px 0 #222",
          fontWeight: "bold",
          fontSize: 14,
          color: "#000",
          borderRadius: 0,
          userSelect: "none",
          zIndex: 3000,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
          textAlign: "center",
          minWidth: 120,
        }}
      >
        中獎次數: {winCount}
      </div>

      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas
          shadows
          dpr={[1, 1]}
          style={{ imageRendering: "pixelated", background: "transparent" }}
          gl={{ preserveDrawingBuffer: true, alpha: true }}
        >
          <color attach="background" args={["transparent"]} />
          <ambientLight intensity={Math.PI / 2} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
          <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />

          {!isHidden && (
            <RoundedBox args={[1, 1, 1]} radius={0.05} smoothness={4} bevelSegments={4} creaseAngle={0.4}>
              <meshPhongMaterial color="#f3f3f3" />
            </RoundedBox>
          )}

          <Box ref={boxRef} args={[0.1, 0.1, 0.1]} position={[0, 0, 0]}>
            <meshPhongMaterial color="#f3f3f3" />
          </Box>

          <Suspense fallback={null}>
            <ClawModel clawPos={clawPos} isLowering={isLowering} hasPrize={hasPrize} prizeIndex={prizeIndex} />
          </Suspense>

          <Environment
            background={true}
            backgroundBlurriness={0.5}
            backgroundIntensity={1}
            environmentIntensity={1}
            preset={"city"}
          />

          <ContactShadows opacity={1} scale={10} blur={10} far={10} resolution={256} color="#222" />

          <Camera
            boxRef={boxRef}
            clawPos={clawPos}
            setClawPos={setClawPos}
            isLowering={isLowering}
            setIsLowering={setIsLowering}
            hasPrize={hasPrize}
            setHasPrize={setHasPrize}
            prizeIndex={prizeIndex}
            setPrizeIndex={setPrizeIndex}
            winCount={winCount}
            setWinCount={setWinCount}
            setShowResultModal={setShowResultModal}
            setModalIsWin={setModalIsWin}
            setModalPrizeIndex={setModalPrizeIndex}
          />

          <CameraControls enablePan={false} enableZoom={false} />
          {/* axesHelper 已移除 */}
        </Canvas>
      </KeyboardControls>

      {showResultModal && (
        <ResultModal
          isWin={modalIsWin}
          prizeIndex={modalPrizeIndex}
          onClose={() => setShowResultModal(false)}
        />
      )}
    </div>
  );
}
