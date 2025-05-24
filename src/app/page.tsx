
"use client";

import React, { useState, useMemo } from "react";
import { InningColumn } from "@/components/inning-column";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, RotateCcw } from "lucide-react";

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
  const [teamName, setTeamName] = useState<string>(""); 
  
  const inning1Stats = useMemo(() => calculateInningStats(inning1Scores), [inning1Scores]);
  const inning2Stats = useMemo(() => calculateInningStats(inning2Scores), [inning2Scores]);

  const handleResetGame = () => {
    setTeamName("");
    setInning1Scores(Array(SCORE_BOX_COUNT).fill(""));
    setInning2Scores(Array(SCORE_BOX_COUNT).fill(""));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Game Options">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleResetGame} className="cursor-pointer">
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Reset Scores</span>
            </DropdownMenuItem>
            {/* Future options can be added here */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <header className="text-center w-full max-w-md mt-12 sm:mt-10 md:mt-8"> {/* Added margin-top to prevent overlap */}
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter Team Name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className={cn(
              "text-center text-2xl font-semibold text-foreground bg-accent/10 dark:bg-accent/20 border-primary focus:ring-primary placeholder:text-muted-foreground/70",
              "w-full max-w-xs mx-auto" 
            )}
            aria-label="Team Name"
          />
        </div>
      </header>

      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center mt-4">
        <InningColumn
          inningNumber={1}
          scores={inning1Scores}
          onScoresUpdate={setInning1Scores}
          inningStats={inning1Stats}
        />
        <InningColumn
          inningNumber={2}
          scores={inning2Scores}
          onScoresUpdate={setInning2Scores}
          inningStats={inning2Stats}
        />
      </main>
      
      <footer className="mt-auto py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ScoreScribe. All rights reserved.</p>
      </footer>
    </div>
  );
}
