import type { NextApiRequest, NextApiResponse } from "next";
import { firestore } from "@/lib/firebase";
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
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, totalTime, scores }: HighscoreData = req.body;

    // Basic validation
    if (!name || !totalTime || !Array.isArray(scores)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // Save to Firestore
    await addDoc(collection(firestore, "highscores"), {
      name,
      totalTime,
      scores,
      timestamp: serverTimestamp(),
    });

    return res.status(200).json({ message: "Highscore saved!" });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
