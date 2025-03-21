"use client";

import { GridLoader } from "@components/GridLoader";
import { loadAllAssets } from "@lib/utils";
import {useEffect, useRef, useState} from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import {Button} from "@components/button";

const MainPage = () => {
  const [assets, setAssets] = useState<{ image: StaticImport; json: never }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const gridLoaderRef = useRef<{ getScore: () => number | null }>(null);


  useEffect(() => {
    const fetchAssets = async () => {
      const loadedAssets = await loadAllAssets(10); // Load 10 samples
      setAssets(loadedAssets);
    };
    fetchAssets();
  }, []);

  const handleConfirm = () => {
    if (gridLoaderRef.current) {
      const score = gridLoaderRef.current.getScore();
      if (score !== null) {
        setScores([...scores, score]);
        setCurrentScore(score);
        setShowGrid(true);
      }
    }
  };

  const handleContinue = () => {
    if(currentScore == null)
      return;
    setShowGrid(false);
    setCurrentScore(null);
    setCurrentIndex(currentIndex + 1);
  };

  if (currentIndex >= assets.length) {
    const totalScore = scores.reduce((acc, score) => acc + score, 0);
    return <div>Total Score: {totalScore}</div>;
  }

  return (
    <div>
      <GridLoader
        ref={gridLoaderRef}
        key={currentIndex}
        gridData={assets[currentIndex].json}
        image={assets[currentIndex].image}
        showGrid={showGrid}
      />
      <div className="flex items-center justify-center align-middle">
        {currentScore !== null && (
          <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Pontuação atual</h2>
            <p className="text-2xl text-green-500">{Math.ceil(currentScore)}</p>
          </div>
        )}
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
          <h2 className="text-xl font-bold mb-2">Imagem</h2>
          <p className="text-lg">{currentIndex + 1} de {assets.length}</p>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
          <h2 className="text-xl font-bold mb-2">Pontuação total</h2>
          <p className="text-2xl text-blue-500">{scores.reduce((acc, score) => Math.ceil(acc + score), 0) }</p>
        </div>
        {currentScore !== null ? (
          <Button onClick={handleContinue} className="bg-green-500 text-white px-4 py-2 rounded">
            Continuar
          </Button>
        ) : (
          <Button onClick={handleConfirm} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
            Confirmar
          </Button>
        )}
      </div>
    </div>
  );
};

export default MainPage;