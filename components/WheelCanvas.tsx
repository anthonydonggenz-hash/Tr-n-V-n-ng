
import React, { useRef, useEffect } from 'react';
import type { Student } from '../types';

interface WheelCanvasProps {
  students: Student[];
  width: number;
  height: number;
  isSpinning: boolean;
}

// Pre-defined color pairs for segment gradients
const colors = [
  { light: "#ffcdd2", dark: "#e57373" }, // Red
  { light: "#e1bee7", dark: "#ba68c8" }, // Purple
  { light: "#c5cae9", dark: "#7986cb" }, // Indigo
  { light: "#b3e5fc", dark: "#4fc3f7" }, // Light Blue
  { light: "#b2dfdb", dark: "#4db6ac" }, // Teal
  { light: "#dcedc8", dark: "#aed581" }, // Light Green
  { light: "#fff9c4", dark: "#fff176" }, // Yellow
  { light: "#ffecb3", dark: "#ffd54f" }, // Amber
  { light: "#ffccbc", dark: "#ff8a65" }, // Deep Orange
];


const WheelCanvas: React.FC<WheelCanvasProps> = ({ students, width, height, isSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Cache images to prevent re-loading on every render
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const outsideRadius = centerX - 25;
    const avatarRadius = outsideRadius - 60;
    const textRadius = outsideRadius - 25; // Position for the text
    const insideRadius = 50;
    const avatarSize = 40;

    let animationFrameId: number;

    const drawWheel = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Add a shadow for depth
      ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      const arc = students.length > 0 ? (2 * Math.PI) / students.length : 0;

      students.forEach((student, i) => {
        const angle = i * arc;
        
        // Create radial gradient for the segment
        const colorPair = colors[i % colors.length];
        const gradient = ctx.createRadialGradient(centerX, centerY, insideRadius, centerX, centerY, outsideRadius);
        gradient.addColorStop(0, colorPair.light);
        gradient.addColorStop(1, colorPair.dark);
        ctx.fillStyle = gradient;
        
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 2;

        // Draw the segment path
        ctx.beginPath();
        ctx.arc(centerX, centerY, outsideRadius, angle, angle + arc, false);
        ctx.arc(centerX, centerY, insideRadius, angle + arc, angle, true);
        ctx.closePath();
        
        // Fill and stroke for definition
        ctx.fill();
        ctx.stroke();
        
        // Draw the avatar image
        const img = imageCache.current.get(student.avatar);
        if (img && img.complete) {
          ctx.save();
          
          // Calculate a subtle wobble effect if the wheel is spinning
          const wobbleX = isSpinning ? Math.sin(Date.now() / 150 + i * 0.5) * 2.5 : 0;
          const wobbleY = isSpinning ? Math.cos(Date.now() / 150 + i * 0.5) * 2.5 : 0;

          // Position the avatar, including the wobble effect
          ctx.translate(
            centerX + Math.cos(angle + arc / 2) * avatarRadius + wobbleX,
            centerY + Math.sin(angle + arc / 2) * avatarRadius + wobbleY
          );
          ctx.rotate(angle + arc / 2 + Math.PI / 2);

          // Clip the drawing area to a circle for the avatar
          ctx.beginPath();
          ctx.arc(0, 0, avatarSize / 2, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          
          // Draw the image
          ctx.drawImage(img, -avatarSize / 2, -avatarSize / 2, avatarSize, avatarSize);
          
          ctx.restore(); // Restore context to remove clipping
        }
        
        // Draw the student's name
        ctx.save();
        ctx.fillStyle = "white";
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(
            centerX + Math.cos(angle + arc / 2) * textRadius,
            centerY + Math.sin(angle + arc / 2) * textRadius
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(student.name, 0, 0);
        ctx.restore();
      });

      // Clear shadow before drawing non-spinning parts like the hub
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Draw the center hub for a more polished look
      ctx.strokeStyle = '#a16207'; // A warmer, brownish color for the hub outline
      ctx.lineWidth = 5;

      // Outer hub with gradient
      const hubGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, insideRadius);
      hubGradient.addColorStop(0, '#f1f5f9');
      hubGradient.addColorStop(1, '#e2e8f0');
      ctx.fillStyle = hubGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, insideRadius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      // Inner hub "pin" for decoration
      const pinGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, insideRadius / 2.5);
      pinGradient.addColorStop(0, '#f8fafc');
      pinGradient.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = pinGradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, insideRadius / 2.5, 0, 2 * Math.PI);
      ctx.fill();
    };
    
    const renderLoop = () => {
        drawWheel();
        animationFrameId = requestAnimationFrame(renderLoop);
    };

    const startDrawing = () => {
        if (isSpinning) {
            renderLoop();
        } else {
            drawWheel(); // Draw just once if not spinning
        }
    };
    
    // Preload any new avatar images before drawing
    const imagesToLoad = students.filter(s => !imageCache.current.has(s.avatar));
    if (imagesToLoad.length === 0) {
      startDrawing();
    } else {
        let loadedCount = 0;
        imagesToLoad.forEach(student => {
          const img = new Image();
          img.src = student.avatar;
          img.onload = () => {
            imageCache.current.set(student.avatar, img);
            loadedCount++;
            if (loadedCount === imagesToLoad.length) {
              startDrawing();
            }
          };
          // Handle cases where an image might fail to load
          img.onerror = () => {
            loadedCount++;
            if (loadedCount === imagesToLoad.length) {
              startDrawing();
            }
          };
        });
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };

  }, [students, width, height, isSpinning]);

  return <canvas ref={canvasRef} width={width} height={height} />;
};

export default WheelCanvas;
