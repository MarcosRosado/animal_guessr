"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@components/button";
import { v4 as uuidv4 } from "uuid";
import { setCookieIfNotExists } from "@lib/utils";

const Dashboard = () => {
  const router = useRouter();
  const [isOver15, setIsOver15] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  const handleStartGame = async () => {
    setCookieIfNotExists("gameId", uuidv4(), 30);
    router.push("/play");
  };

  const isButtonDisabled = !(isOver15 && consentGiven);

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
          <li>Você tem um limite de 20 segundos para completar cada imagem.</li>
          <li>Uma pontuação será atribuída dependendo da proximidade do animal, variando de 0 a 1000.</li>
          <li>Encontre os animais, e tente conquistar a maior pontuação possível!</li>
        </ul>
        <div className="text-left mb-4">
          <p className="text-lg mb-2">
            <b>Termos de uso:</b>
            <br/>
            Este jogo pretende avaliar quanto tempo as pessoas demoram para identificar as serpentes camufladas.
            <br />
            Para que possamos utilizar as informações coletadas dos jogadores para finalidades científicas, por favor marque as caixas de seleção:
          </p>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isOver15"
              checked={isOver15}
              onChange={(e) => setIsOver15(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isOver15">Sou maior de 15 anos</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="consentGiven"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="consentGiven">
              Eu concedo espontaneamente a licença para reprodução dos dados coletados deste jogo para reprodução
              midiática e em revistas científicas.
            </label>
          </div>
        </div>
        <Button
          onClick={handleStartGame}
          className={`bg-blue-500 text-white px-4 py-2 rounded ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={isButtonDisabled}
        >
          Iniciar Jogo
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;