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

import { firestore } from "@lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Define types
interface Score {
  level: string;
  score: number;
}

interface HighscoreData {
  name: string;
  totalTime: number;
  scores: Score[];
  totalScore: number;
  sessionId: string;
}

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const { name, totalTime, scores, totalScore, sessionId }: HighscoreData = body;

    // Basic validation
    if (!name || !totalTime || !Array.isArray(scores) || !totalScore || !sessionId) {
      return new Response("Invalid data format", { status: 400 });
    }

    const docRef = await addDoc(collection(firestore, "highscores"), {
      name:name,
      totalTime:totalTime,
      scores:scores,
      totalScore:totalScore,
      sessionId:sessionId,
      timestamp: serverTimestamp(),
    });

    console.log("Document written with ID: ", docRef.id);

    return new Response("Highscore saved!", { status: 200 });
  } catch (error) {
    console.error("Error saving highscore:", error);
    return new Response("Internal server error", { status: 500 });
  }
}