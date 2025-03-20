"use client";

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import sample1 from "@/assets/images/sample1.jpg"
import sample1json from "@/assets/dataset/sample1.json"
import { MapPin } from "lucide-react";
import {calculateScore} from "@lib/utils";

interface gridData {
  name: string;
  grid: number[][];
  maxDistance: number;
  weightsGrid: number[][];
}

const MainPage = () => {
  const [gridData, setGridData] = useState<gridData>({ name: "", grid: [], maxDistance: 0, weightsGrid: [] });
  const [marker, setMarker] = useState<{ x: number; y: number }>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  useEffect(() => {
    setGridData(sample1json);
    const handleResize = () => {
      if (imageRef.current) {
        const { width, height } = imageRef.current.getBoundingClientRect();
        setImageSize({ width, height });
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleGridClick = (row: number, col: number) => {
    setMarker({ x: col, y: row });
    const distance = gridData.weightsGrid[row][col];
    console.log(`Distance to nearest 1: ${distance}`);
    // Calculate score
    const score = calculateScore(distance, gridData.maxDistance);
    console.log(`Distance to nearest 1: ${distance}, Score: ${score}`);
    console.log(`Clicked on row: ${row}, col: ${col}`);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex justify-center items-center">
      {/* Background Image */}
      <div className="relative w-full h-full">
        <Image
          ref={imageRef}
          src={sample1}
          alt="Background"
          layout="fill"  // This keeps the image's intrinsic size
          objectFit="contain" // Keeps the image's aspect ratio and makes it fit in the container
        />
        {/* Grid Overlay */}
        <div
          className="absolute top-0 left-0"
          style={{
            width: imageSize.width,
            height: imageSize.height,
            display: 'grid',
            gridTemplateColumns: `repeat(96, 1fr)`, // 96 columns for the grid
            gridTemplateRows: `repeat(54, 1fr)`, // 54 rows for the grid
          }}
        >
          {gridData.grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`flex justify-center items-center cursor-pointer ${cell === 1 ? "bg-green-500/50" : "bg-transparent"}`}
                onClick={() => handleGridClick(rowIndex, colIndex)}
                style={{
                  width: `${imageSize.width / 96}px`, // Calculate column width based on image width
                  height: `${imageSize.height / 54}px`, // Calculate row height based on image height
                }}
              >
                {marker && marker.x === colIndex && marker.y === rowIndex && (
                    <MapPin size={40} style={{ fill: "currentColor" }} className="text-red-500" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
