
"use client";

import React, { useState, useMemo } from "react";
import { InningColumn } from "@/components/inning-column";
import { Input } from "@/components/ui/input"; // Added Input
import { cn } from "@/lib/utils";

const SCORE_BOX_COUNT = 17;
const MAX_INPUT_LENGTH = 10;

const calculateInningStats = (scores: string[]): { runs: number; wickets: number } => {
  let runs = 0;
  let wickets = 0;
  scores.forEach(scoreEntry => {
    const s = scoreEntry.toUpperCase().trim();
    if (!s) return;

    if (s.includes('/')) {
      const parts = s.split('/');
      const runPart = parts[0].trim();
      const wicketPart = parts[1].trim();
      
      if (runPart && /^\d+$/.test(runPart)) {
        runs += parseInt(runPart, 10);
      }
      if (wicketPart && /^\d+$/.test(wicketPart)) {
        wickets += parseInt(wicketPart, 10);
      }
    } else if (s === 'W') {
      wickets += 1;
    } else if (/^\d+$/.test(s)) {
      runs += parseInt(s, 10);
    }
  });
  return { runs, wickets };
};

export default function ScoreScribePage() {
  const [inning1Scores, setInning1Scores] = useState<string[]>(Array(SCORE_BOX_COUNT).fill(""));
  const [inning2Scores, setInning2Scores] = useState<string[]>(Array(SCORE_BOX_COUNT).fill(""));
  const [teamName, setTeamName] = useState<string>("Team Name"); // Added teamName state
  
  const inning1Stats = useMemo(() => calculateInningStats(inning1Scores), [inning1Scores]);
  const inning2Stats = useMemo(() => calculateInningStats(inning2Scores), [inning2Scores]);

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen">
      <header className="text-center w-full max-w-md">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">ScoreScribe</h1>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="text-center text-lg border-primary focus:ring-primary"
            aria-label="Team Name"
          />
        </div>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Enter scores: numbers for runs (e.g., 6, 150), W for wicket, or Runs/Wickets (e.g., 4/1, 10/2). Max {MAX_INPUT_LENGTH} chars.
        </p>
      </header>

      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center mt-4">
        <InningColumn
          inningNumber={1}
          scores={inning1Scores}
          onScoresUpdate={setInning1Scores}
          inningStats={inning1Stats}
          teamName={teamName} // Pass teamName
        />
        <InningColumn
          inningNumber={2}
          scores={inning2Scores}
          onScoresUpdate={setInning2Scores}
          inningStats={inning2Stats}
          teamName={teamName} // Pass teamName
        />
      </main>
      
      <footer className="mt-auto py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ScoreScribe. All rights reserved.</p>
      </footer>
    </div>
  );
}
