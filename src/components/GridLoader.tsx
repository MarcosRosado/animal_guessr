import React, {forwardRef, Ref, useEffect, useImperativeHandle, useRef, useState} from "react";

import {calculateScore} from "@lib/utils";
import Image from "next/image";

import {MapPin} from "lucide-react";
import {StaticImport} from "next/dist/shared/lib/get-img-props";

interface GridLoaderProps {
  gridData: GridData;
  image: StaticImport;
  showGrid?: boolean;
  canSetMarker: boolean;
}

interface GridLoaderRef {
  getScore: () => number | null;
}

const COLUMNS = 96;
const ROWS = 54;

interface GridData {
  name: string;
  grid: number[][];
  maxDistance: number;
  weightsGrid: number[][];
}

const GridLoader = forwardRef<GridLoaderRef, GridLoaderProps>((props, ref) => {
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
    setGridData(props.gridData);
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
    if(props.showGrid || !props.canSetMarker)
      return;
    setMarker({ x: col, y: row });
    const distance = gridData.weightsGrid[row][col];
    const score = calculateScore(distance, gridData.maxDistance);
    console.log(`Clicked on row: ${row}, col: ${col}, Distance: ${distance}, Score: ${score}`);
  };

  const cellWidth = imageSize.width / COLUMNS;
  const cellHeight = imageSize.height / ROWS;

  useImperativeHandle(ref, () => ({
    getScore: () => {
      if (marker) {
        const distance = gridData.weightsGrid[marker.y][marker.x];
        return calculateScore(distance, gridData.maxDistance);
      }
      return null;
    }
  }));

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div className="relative mt-8">
        <Image
          ref={imageRef}
          src={props.image}
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
                className={`border-transparent${cell === 1 && props.showGrid ? "border bg-red-500/50 bg-opacity-20" : " bg-transparent"}`}
                style={{width: cellWidth, height: cellHeight}}
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
              fill: "currentColor",
            }}
          />
        )}
      </div>
    </div>
  );
});

GridLoader.displayName = 'GridLoader';

export {GridLoader};