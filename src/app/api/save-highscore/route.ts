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
}

export async function POST(req: Request) {

  try {
    const body = await req.json();
    const { name, totalTime, scores, totalScore }: HighscoreData = body;

    // Basic validation
    if (!name || !totalTime || !Array.isArray(scores)) {
      return new Response("Invalid data format", { status: 400 });
    }

    const docRef = await addDoc(collection(firestore, "highscores"), {
      name,
      totalTime,
      scores,
      totalScore,
      timestamp: serverTimestamp(),
    });

    console.log("Document written with ID: ", docRef.id);

    return new Response("Highscore saved!", { status: 200 });
  } catch (error) {
    console.error("Error saving highscore:", error);
    return new Response("Internal server error", { status: 500 });
  }
}