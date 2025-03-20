"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import sample1 from "@/assets/images/sample1.jpg";
import sample1json from "@/assets/dataset/sample1.json";
import { MapPin } from "lucide-react";
import { calculateScore } from "@/lib/utils";

interface GridData {
  name: string;
  grid: number[][];
  maxDistance: number;
  weightsGrid: number[][];
}

const COLUMNS = 96;
const ROWS = 54;

const MainPage = () => {
  const [gridData, setGridData] = useState<GridData>({
    name: "",
    grid: [],
    maxDistance: 0,
    weightsGrid: [],
  });
  const [marker, setMarker] = useState<{ x: number; y: number } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setGridData(sample1json);
    const handleResize = () => {
      if (imageRef.current) {
        const { width, height } = imageRef.current.getBoundingClientRect();
        setImageSize({ width, height });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleGridClick = (row: number, col: number) => {
    setMarker({ x: col, y: row });
    const distance = gridData.weightsGrid[row][col];
    const score = calculateScore(distance, gridData.maxDistance);
    console.log(`Clicked on row: ${row}, col: ${col}, Distance: ${distance}, Score: ${score}`);
  };

  const cellWidth = imageSize.width / COLUMNS;
  const cellHeight = imageSize.height / ROWS;

  return (
    <div className="relative w-full max-w-7xl mx-auto">
      <div className="relative">
        <Image
          ref={imageRef}
          src={sample1}
          alt="Sample"
          layout="responsive"
          width={1920}
          height={1080}
        />
        <div
          className="absolute top-0 left-0 w-full h-full grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLUMNS}, ${cellWidth}px)`,
            gridTemplateRows: `repeat(${ROWS}, ${cellHeight}px)`,
          }}
        >
          {gridData.grid.flatMap((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border border-transparent${cell === 1 ? " border bg-green-500/50 bg-opacity-20 border-green-500/50" : " bg-transparent"}`}
                style={{ width: cellWidth, height: cellHeight }}
                onClick={() => handleGridClick(rowIndex, colIndex)}
              />
            ))
          )}
        </div>
        {marker && (
          <MapPin
            size={30}
            className="absolute text-red-500"
            style={{
              left: marker.x * cellWidth + cellWidth / 2,
              top: marker.y * cellHeight + cellHeight / 2,
              transform: "translate(-50%, -100%)",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default MainPage;