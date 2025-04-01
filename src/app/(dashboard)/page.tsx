/**
 * AnimalGuessr - Interactive Grid-Based Scoring App
 *
 * AnimalGuessr allows users to interact with a grid-based image and
 * calculate scores based on predefined criteria.
 *
 * Licensed under the GNU General Public License (GPL) v3.0 or later.
 * See LICENSE for details.
 *
 * Author: [Marcos Rosado]
 * Repository: [https://github.com/MarcosRosado/animal_guessr/]
 */

"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/button';
import { v4 as uuidv4 } from 'uuid';
import {setCookieIfNotExists} from "@lib/utils";


const Dashboard = () => {
  const router = useRouter();

  const handleStartGame = async () => {
    setCookieIfNotExists('gameId', uuidv4(), 30);

    router.push('/play');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 m-4 w-full md:w-2/3 lg:w-1/2 text-center">
        <h1 className="text-3xl font-bold mb-4">Regras</h1>
        <p className="text-lg mb-4">
          Bem vindo ao <b>Animalguessr</b>, aqui estão as regras:
        </p>
        <ul className="list-disc list-inside text-left mb-4">
          <li>A cada rodada você será apresentado a uma imagem.</li>
          <li>Sua tarefa é identificar o animal na foto, clicando onde você acredita que ele esteja.</li>
          <li>Você tem um limite de 30 segundos para completar cada imagem.</li>
          <li>Uma pontuação sera atribuída dependendo da proximidade do animal, variando de 0 a 1000.</li>
          <li>Encontre os animais, e tente conquistar a maior pontuação possível!</li>
        </ul>
        <Button onClick={handleStartGame} className="bg-blue-500 text-white px-4 py-2 rounded">
          Iniciar Jogo
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;