
"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface InningColumnProps {
  inningNumber: 1 | 2;
  scores: string[];
  onScoresUpdate: (scores: string[]) => void;
  eventDetails: string[];
  onEventDetailsUpdate: (details: string[]) => void;
  inningStats: { runs: number; wickets: number; balls: number; overs: string };
}

const SCORE_BOX_COUNT = 17;
const MAX_INPUT_LENGTH = 10; 

export function InningColumn({ 
  inningNumber, 
  scores, 
  onScoresUpdate, 
  eventDetails,
  onEventDetailsUpdate,
  inningStats 
}: InningColumnProps) {

  const handleScoreInputChange = (index: number, value: string) => {
    const newValues = [...scores];
    const processedValue = value.slice(0, MAX_INPUT_LENGTH);
    newValues[index] = processedValue;
    onScoresUpdate(newValues);
  };

  const handleDetailInputChange = (index: number, value: string) => {
    const newValues = [...eventDetails];
    newValues[index] = value.slice(0, MAX_INPUT_LENGTH); 
    onEventDetailsUpdate(newValues);
  };

  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  const cardTitle = inningLabel;

  return (
    <Card className={cn(
        "w-full md:w-auto md:min-w-[180px] shadow-lg",
        "bg-card" 
      )}>
      <CardHeader>
        <CardTitle className="text-white">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-2 mb-1">
          <Label 
            htmlFor={`inning-${inningNumber}-score-header`} 
            className="text-sm font-medium text-white text-center"
          >
            Score
          </Label>
          <Label 
            htmlFor={`inning-${inningNumber}-detail-header`} 
            className="text-sm font-medium text-white text-center"
          >
            Team
          </Label>
        </div>
        {Array.from({ length: SCORE_BOX_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              id={`inning-${inningNumber}-score-${index}`}
              type="text"
              value={scores[index] || ""}
              onChange={(e) => handleScoreInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 text-center transition-colors duration-300 text-base md:text-sm w-1/2",
                "bg-background dark:bg-slate-800 text-white dark:text-gray-100",
                "focus:ring-ring"
              )}
              aria-label={`Inning ${inningNumber} score entry ${index + 1}`}
            />
            <Input
              id={`inning-${inningNumber}-detail-${index}`}
              type="text"
              value={eventDetails[index] || ""}
              onChange={(e) => handleDetailInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 text-center transition-colors duration-300 text-base md:text-sm w-1/2",
                "bg-background dark:bg-slate-800 text-white dark:text-gray-100",
                "focus:ring-ring"
              )}
              aria-label={`Inning ${inningNumber} detail entry ${index + 1}`}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold text-foreground">
          Total: {inningStats.runs} runs, {inningStats.wickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}
