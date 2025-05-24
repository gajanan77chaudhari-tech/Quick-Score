
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { InningColumn } from "@/components/inning-column";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const SCORE_BOX_COUNT = 17;

const calculateInningStats = (scores: string[]): { runs: number; wickets: number } => {
  let runs = 0;
  let wickets = 0;
  scores.forEach(scoreEntry => {
    const s = scoreEntry.toUpperCase().trim();
    if (!s) return; // Skip empty entries

    if (s.includes('/')) {
      const parts = s.split('/');
      const runPart = parts[0];
      const wicketPart = parts[1];
      
      if (runPart && /^\d+$/.test(runPart)) {
        runs += parseInt(runPart, 10);
      }
      if (wicketPart && /^\d+$/.test(wicketPart)) {
        const wicketCount = parseInt(wicketPart, 10);
        if (wicketCount > 0) {
           wickets += wicketCount;
        }
      }
    } else if (s === 'W') {
      wickets += 1;
    } else if (/^\d+$/.test(s)) { // Allows multi-digit runs directly
      runs += parseInt(s, 10);
    }
  });
  return { runs, wickets };
};

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}


export default function ScoreScribePage() {
  const [inning1Scores, setInning1Scores] = useState<string[]>(Array(SCORE_BOX_COUNT).fill(""));
  const [inning2Scores, setInning2Scores] = useState<string[]>(Array(SCORE_BOX_COUNT).fill(""));

  const inning1Stats = useMemo(() => calculateInningStats(inning1Scores), [inning1Scores]);
  const inning2Stats = useMemo(() => calculateInningStats(inning2Scores), [inning2Scores]);

  const [highlightSummary1, setHighlightSummary1] = useState(false);
  const [highlightSummary2, setHighlightSummary2] = useState(false);
  
  const prevInning1Stats = usePrevious(inning1Stats);
  const prevInning2Stats = usePrevious(inning2Stats);

  useEffect(() => {
    if (prevInning1Stats && (inning1Stats.runs !== prevInning1Stats.runs || inning1Stats.wickets !== prevInning1Stats.wickets)) {
      setHighlightSummary1(true);
      const timer = setTimeout(() => setHighlightSummary1(false), 500);
      return () => clearTimeout(timer);
    }
  }, [inning1Stats, prevInning1Stats]);

  useEffect(() => {
     if (prevInning2Stats && (inning2Stats.runs !== prevInning2Stats.runs || inning2Stats.wickets !== prevInning2Stats.wickets)) {
      setHighlightSummary2(true);
      const timer = setTimeout(() => setHighlightSummary2(false), 500);
      return () => clearTimeout(timer);
    }
  }, [inning2Stats, prevInning2Stats]);

  const handleResetGame = () => {
    setInning1Scores(Array(SCORE_BOX_COUNT).fill(""));
    setInning2Scores(Array(SCORE_BOX_COUNT).fill(""));
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen">
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">ScoreScribe</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Enter scores: numbers for runs (e.g., 6, 10), W for wicket, or Runs/Wickets (e.g., 4/1, 10/2). Max 10 chars.
        </p>
      </header>

      <section aria-labelledby="game-summary-heading" className="w-full max-w-lg">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle id="game-summary-heading" className="text-2xl">Game Summary</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleResetGame} aria-label="Reset Game">
              <RefreshCw className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 text-base sm:text-lg pt-4">
            <p className={cn("p-1 rounded transition-all duration-300", highlightSummary1 ? "bg-accent/30" : "")}>
              1st Inning: <strong>{inning1Stats.runs} runs</strong>, <strong>{inning1Stats.wickets} wickets</strong>
            </p>
            <p className={cn("p-1 rounded transition-all duration-300", highlightSummary2 ? "bg-accent/30" : "")}>
              2nd Inning: <strong>{inning2Stats.runs} runs</strong>, <strong>{inning2Stats.wickets} wickets</strong>
            </p>
          </CardContent>
        </Card>
      </section>

      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center">
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
