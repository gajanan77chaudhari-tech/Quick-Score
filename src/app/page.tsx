
"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { InningColumn } from "@/components/inning-column";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { RefreshCw } from "lucide-react";
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
  
  const [team1Name, setTeam1Name] = useState<string>("Team 1");
  const [team2Name, setTeam2Name] = useState<string>("Team 2");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

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
    setTeam1Name("Team 1");
    setTeam2Name("Team 2");
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen">
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary">ScoreScribe</h1>
        <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
          Enter scores: numbers for runs (e.g., 6, 10), W for wicket, or Runs/Wickets (e.g., 4/1, 10/2). Max {MAX_INPUT_LENGTH} chars.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="team1Name" className="text-sm font-medium text-muted-foreground">1st Inning Team</Label>
                <Input
                  id="team1Name"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  placeholder="Enter 1st Inning Team Name"
                  className="mt-1 h-9"
                />
              </div>
              <div>
                <Label htmlFor="team2Name" className="text-sm font-medium text-muted-foreground">2nd Inning Team</Label>
                <Input
                  id="team2Name"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  placeholder="Enter 2nd Inning Team Name"
                  className="mt-1 h-9"
                />
              </div>
            </div>
            <p className={cn("p-1 rounded transition-all duration-300", highlightSummary1 ? "bg-accent/30" : "")}>
              {team1Name} (1st): <strong>{inning1Stats.runs} runs</strong>, <strong>{inning1Stats.wickets} wickets</strong>
            </p>
            <p className={cn("p-1 rounded transition-all duration-300", highlightSummary2 ? "bg-accent/30" : "")}>
              {team2Name} (2nd): <strong>{inning2Stats.runs} runs</strong>, <strong>{inning2Stats.wickets} wickets</strong>
            </p>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="data-generation-heading" className="w-full max-w-lg">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle id="data-generation-heading" className="text-xl">Inning Data Options</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setIsDetailModalOpen(true)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              View Detailed Inning Data
            </Button>
          </CardContent>
        </Card>
      </section>

      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center mt-4">
        <InningColumn
          inningNumber={1}
          scores={inning1Scores}
          onScoresUpdate={setInning1Scores}
          inningStats={inning1Stats}
          teamName={team1Name}
        />
        <InningColumn
          inningNumber={2}
          scores={inning2Scores}
          onScoresUpdate={setInning2Scores}
          inningStats={inning2Stats}
          teamName={team2Name}
        />
      </main>
      
      <footer className="mt-auto py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ScoreScribe. All rights reserved.</p>
      </footer>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="text-primary">Detailed Inning Data</DialogTitle>
            <DialogDescription>
              A summary of scores for each team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-2">{team1Name} - 1st Inning</h3>
              <p>Total Runs: <strong className="text-accent-foreground">{inning1Stats.runs}</strong></p>
              <p>Total Wickets: <strong className="text-accent-foreground">{inning1Stats.wickets}</strong></p>
              <div className="mt-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Scores Entered:</h4>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 text-xs mt-1 max-h-40 overflow-y-auto p-2 border rounded-md bg-background">
                  {inning1Scores.filter(s => s.trim() !== "").length > 0 ? (
                    inning1Scores.map((score, index) => (
                      score.trim() !== "" && <span key={`inning1-detail-${index}`} className="p-1.5 bg-muted/70 rounded text-center shadow-sm">{score}</span>
                    ))
                  ) : (
                    <span className="col-span-full text-center p-2 text-muted-foreground">No scores entered for {team1Name}.</span>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-primary mb-2">{team2Name} - 2nd Inning</h3>
              <p>Total Runs: <strong className="text-accent-foreground">{inning2Stats.runs}</strong></p>
              <p>Total Wickets: <strong className="text-accent-foreground">{inning2Stats.wickets}</strong></p>
              <div className="mt-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Scores Entered:</h4>
                 <div className="grid grid-cols-4 sm:grid-cols-5 gap-1 text-xs mt-1 max-h-40 overflow-y-auto p-2 border rounded-md bg-background">
                  {inning2Scores.filter(s => s.trim() !== "").length > 0 ? (
                    inning2Scores.map((score, index) => (
                      score.trim() !== "" && <span key={`inning2-detail-${index}`} className="p-1.5 bg-muted/70 rounded text-center shadow-sm">{score}</span>
                    ))
                  ) : (
                    <span className="col-span-full text-center p-2 text-muted-foreground">No scores entered for {team2Name}.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

    