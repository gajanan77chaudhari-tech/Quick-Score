
"use client";

import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { parseSingleScoreEntry, calculateTotalStats } from "@/lib/score-parser";
import { cn } from "@/lib/utils";

interface ResultsInningColumnProps {
  inningNumber: 1 | 2;
  teamName: string; // Will receive the team name, possibly empty
  scores: string[];
}

export function ResultsInningColumn({ inningNumber, teamName, scores }: ResultsInningColumnProps) {
  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  // Trim the team name to handle names with only spaces or if it's an empty string
  const trimmedTeamName = teamName.trim(); 
  
  // Conditionally create the card title based on whether a team name is present
  const cardTitle = trimmedTeamName ? `${trimmedTeamName} - ${inningLabel}` : inningLabel;

  const processedScores = scores.map(score => ({
    original: score,
    parsed: parseSingleScoreEntry(score),
  })).filter(s => s.original.trim() !== ""); // Filter out empty original entries for display

  const inningStats = calculateTotalStats(scores);

  return (
    <Card className={cn(
        "w-full md:w-auto md:min-w-[350px] shadow-lg",
        "bg-blue-700 dark:bg-blue-800" // Matching InningColumn style
      )}>
      <CardHeader>
        <CardTitle className="text-gray-100">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-3"> {/* Adjust height as needed */}
          {processedScores.length > 0 ? (
            <ul className="space-y-2">
              {processedScores.map((scoreData, index) => (
                <li key={index} className="p-2 rounded-md bg-background/20 dark:bg-slate-700/30 text-sm text-gray-200 dark:text-gray-300">
                  <span className="font-medium">Entry {index + 1}:</span> "{scoreData.original}"
                  <br />
                  <span className="ml-4 font-light">➔ {scoreData.parsed.runs} Runs, {scoreData.parsed.wickets} Wickets</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-300 italic">No scores recorded for this inning.</p>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold text-foreground">
          Total: {inningStats.runs} runs, {inningStats.wickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}
