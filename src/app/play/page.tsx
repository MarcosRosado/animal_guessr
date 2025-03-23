"use client";

import { GridLoader } from "@components/GridLoader";
import {loadAllAssets, usePageLoaded} from "@lib/utils";
import { useEffect, useRef, useState } from "react";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Button } from "@components/button";
import Results from "@components/Results";
import {clsx} from "clsx";
import {useRouter} from "next/navigation";

const START_TIME = 10;

const MainPage = () => {
  const [assets, setAssets] = useState<{ image: StaticImport; json: never }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [timeSpentOnEachImage, setTimeSpentOnEachImage] = useState<number[]>([]);
  const [showGrid, setShowGrid] = useState(false);
  const [currentScore, setCurrentScore] = useState<number | null>(null);
  const gridLoaderRef = useRef<{ getScore: () => number | null }>(null);
  const [startTime, setStartTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(START_TIME); // 1 minute by default
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const isPageLoaded = usePageLoaded();
  const router = useRouter();

  useEffect(() => {
    const fetchAssets = async () => {
      const loadedAssets = await loadAllAssets(1); // Load 10 samples
      setAssets(loadedAssets);
    };
    fetchAssets();
  }, []);

  useEffect(() => {
    if(timeLeft === 0) {
      handleTimeEnd();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (isPageLoaded) {
      startTimer();
      handleStartTimer();
    }
  }, [isPageLoaded]);

  const handleConfirm = () => {
    if (gridLoaderRef.current) {
      const score = gridLoaderRef.current.getScore();
      if (score !== null) {
        setScores([...scores, score]);
        setTimeSpentOnEachImage([...timeSpentOnEachImage, START_TIME - timeLeft]);
        setCurrentScore(score);
        setShowGrid(true);
        stopTimer();
      }
    }
  };

  const handleContinue = () => {
    if (currentScore == null) return;
    setShowGrid(false);
    setCurrentScore(null);
    setCurrentIndex(currentIndex + 1);
    resetTimer();
  };

  const resetGame = () => {
    setScores([]);
    setCurrentIndex(0);
    setShowGrid(false);
    setCurrentScore(null);
    setStartTime(0);
    setTimeSpentOnEachImage([]);
    resetTimer();
    startTimer();
  };

  const handleMainMenu = () => {
    router.push("/");
  }

  const handleStartTimer = () => {
    if (startTime === 0) {
      setStartTime(Date.now());
    }
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
  };

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(START_TIME);
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    setTimerInterval(interval);
  };

  const resetTimer = () => {
    if (timerInterval) clearInterval(timerInterval);
    setTimeLeft(START_TIME);
  };

  const handleTimeEnd = async () => {
    const scoresCopy = [...scores];
    stopTimer();
    setCurrentScore(0);
    setScores([...scoresCopy, 0]);
    setTimeSpentOnEachImage([...timeSpentOnEachImage, START_TIME - timeLeft]);
    handleContinue();
    await submitHighscore("Anonymous");
  };

  const submitHighscore = async (name: string) => {
    const currentScores = [...scores];
    const data = {
      name: name,
      totalTime: Date.now() - startTime,
      scores: currentScores.map((score, index) => ({
        level: `${assets[index].json["name"]}`,
        score: score,
        timeSpentOnImage: timeSpentOnEachImage[index],
      })),
      totalScore: currentScores.reduce((acc, score) => Math.ceil(acc + score), 0),
    };

    await fetch("/api/save-highscore", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  useEffect(() => {
    if (currentIndex >= assets.length && scores.length > 0) {
      submitHighscore("Anonymous");
    }
  }, [currentIndex]);

  if (currentIndex >= assets.length) {
    return (
      <>
        <Results
          scores={scores}
          playAgainCallback={resetGame}
          elapsedTime={Date.now() - startTime}
          mainMenuCallback={handleMainMenu}
        />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <GridLoader
          ref={gridLoaderRef}
          key={currentIndex}
          gridData={assets[currentIndex].json}
          image={assets[currentIndex].image}
          showGrid={showGrid}
          startTimerCallback={handleStartTimer}
        />
      </div>
      <div className="flex flex-col items-center justify-center p-4 w-full">
        {/* Mobile Layout */}
        <div className="block md:hidden w-full flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={clsx('h-4 rounded-full', {
                'bg-green-500': timeLeft > START_TIME - START_TIME / 3,
                'bg-yellow-500': timeLeft <= START_TIME - START_TIME / 3 && timeLeft > START_TIME / 3,
                'bg-red-500': timeLeft <= START_TIME / 3,
              })}
              style={{width: `${(timeLeft / START_TIME) * 100}%`}}
            ></div>
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
          {currentScore !== null && (
            <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
              <h2 className="text-xl font-bold mb-2">Pontuação Atual</h2>
              <p className="text-2xl text-green-500">{Math.ceil(currentScore)}</p>
            </div>
          )}
          <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Imagem</h2>
            <p className="text-lg">{currentIndex + 1} de {assets.length}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Pontuação Total</h2>
            <p className="text-2xl text-blue-500">{scores.reduce((acc, score) => Math.ceil(acc + score), 0)}</p>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex md:flex-col md:items-center w-full">
          <div className="w-3/5 bg-gray-200 rounded-full h-4 mb-4">
            <div
              className={clsx('h-4 rounded-full', {
                'bg-green-500': timeLeft > START_TIME - START_TIME / 3,
                'bg-yellow-500': timeLeft <= START_TIME - START_TIME / 3 && timeLeft > START_TIME / 3,
                'bg-red-500': timeLeft <= START_TIME / 3,
              })}
              style={{width: `${(timeLeft / START_TIME) * 100}%`}}
            ></div>
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
          <div className="flex flex-row flex-wrap justify-center">
            <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
              <h2 className="text-xl font-bold mb-2">Pontuação Atual</h2>
              <p className="text-2xl text-green-500">{Math.ceil(currentScore as number)}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
              <h2 className="text-xl font-bold mb-2">Imagem</h2>
              <p className="text-lg">{currentIndex + 1} de {assets.length}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
              <h2 className="text-xl font-bold mb-2">Pontuação Total</h2>
              <p className="text-2xl text-blue-500">{scores.reduce((acc, score) => Math.ceil(acc + score), 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;