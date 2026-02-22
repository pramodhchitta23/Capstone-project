import { useEffect, useRef } from "react";

export default function WaveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(56,189,248,0.25)";

      for (let x = 0; x < width; x++) {
        const y =
          height / 2 +
          Math.sin(x * 0.01 + time) * 20 +
          Math.sin(x * 0.02 + time * 1.5) * 10;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      time += 0.02;
      requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
      }}
    />
  );
}