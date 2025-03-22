import React, { useState } from 'react';
import { Button } from "@components/button";

interface ResultsProps {
  scores: number[];
  elapsedTime: number;
  playAgainCallback: () => void;
}

const Results: React.FC<ResultsProps> = ({ scores, playAgainCallback, elapsedTime }) => {
  const highScore = Math.max(...scores);
  const totalScore = scores.reduce((acc, score) => acc + score, 0);

  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col md:flex-row items-start justify-center">
        <div className="flex flex-col">
          <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Tempo gasto</h2>
            <p className="text-2xl text-blue-500">{minutes} minuto(s) e {seconds} segundo(s)</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Pontuação total</h2>
            <p className="text-2xl text-blue-500">{Math.ceil(totalScore)}</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
            <h2 className="text-xl font-bold mb-2">Pontuação mais alta</h2>
            <p className="text-2xl text-green-500">{Math.ceil(highScore)} na imagem {scores.indexOf(highScore) + 1}</p>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 m-4 w-80 text-center">
          <h2 className="text-xl font-bold mb-2">Pontuações</h2>
          <ul className="list-disc list-inside">
            {scores.map((score, index) => (
              <li key={index} className="text-lg">
                Imagem {index + 1}: {Math.ceil(score)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col items-center mt-4">
        <Button onClick={playAgainCallback} className="bg-blue-500 text-white px-4 py-2 rounded">
          Jogar novamente
        </Button>
      </div>
    </div>
  );
};

export default Results;