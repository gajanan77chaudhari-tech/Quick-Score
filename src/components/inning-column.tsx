
"use client";

import React, { useState, useEffect } from "react";
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
  scores: initialScores, 
  onScoresUpdate, 
  eventDetails: initialEventDetails,
  onEventDetailsUpdate,
  inningStats 
}: InningColumnProps) {
  const [scoreInputValues, setScoreInputValues] = useState<string[]>(() => 
    initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill("")
  );
  const [detailInputValues, setDetailInputValues] = useState<string[]>(() =>
    initialEventDetails.length === SCORE_BOX_COUNT ? initialEventDetails : Array(SCORE_BOX_COUNT).fill("")
  );

  useEffect(() => {
    if (JSON.stringify(initialScores) !== JSON.stringify(scoreInputValues)) {
       setScoreInputValues(initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill(""));
    }
  }, [initialScores, scoreInputValues]); // Added scoreInputValues to dependencies

  useEffect(() => {
    if (JSON.stringify(initialEventDetails) !== JSON.stringify(detailInputValues)) {
      setDetailInputValues(initialEventDetails.length === SCORE_BOX_COUNT ? initialEventDetails : Array(SCORE_BOX_COUNT).fill(""));
    }
  }, [initialEventDetails, detailInputValues]); // Added detailInputValues to dependencies


  const handleScoreInputChange = (index: number, value: string) => {
    const newValues = [...scoreInputValues];
    newValues[index] = value.slice(0, MAX_INPUT_LENGTH);
    setScoreInputValues(newValues);
    onScoresUpdate(newValues); 
  };

  const handleDetailInputChange = (index: number, value: string) => {
    const newValues = [...detailInputValues];
    newValues[index] = value.slice(0, MAX_INPUT_LENGTH);
    setDetailInputValues(newValues);
    onEventDetailsUpdate(newValues);
  };

  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  const cardTitle = inningLabel;

  return (
    <Card className={cn(
        "w-full md:w-auto md:min-w-[450px] shadow-lg", // Increased min-width
        "bg-blue-700 dark:bg-blue-800" 
      )}>
      <CardHeader>
        <CardTitle className="text-gray-100">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="grid grid-cols-2 gap-x-2 mb-2">
          <Label htmlFor={`inning-${inningNumber}-score-header`} className="text-sm font-medium text-gray-200 dark:text-gray-300">Score</Label>
          <Label htmlFor={`inning-${inningNumber}-detail-header`} className="text-sm font-medium text-gray-200 dark:text-gray-300">Team</Label>
        </div>
        {Array.from({ length: SCORE_BOX_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              id={`inning-${inningNumber}-score-${index}`}
              type="text"
              value={scoreInputValues[index] || ""}
              onChange={(e) => handleScoreInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 w-full text-center transition-colors duration-300 text-base md:text-sm flex-1", 
                "bg-background dark:bg-slate-800 text-foreground dark:text-gray-100",
                "focus:ring-ring"
              )}
              aria-label={`Inning ${inningNumber} score entry ${index + 1}`}
            />
            <Input
              id={`inning-${inningNumber}-detail-${index}`}
              type="text"
              value={detailInputValues[index] || ""}
              onChange={(e) => handleDetailInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 w-full text-center transition-colors duration-300 text-base md:text-sm flex-1", 
                "bg-background dark:bg-slate-800 text-foreground dark:text-gray-100",
                "focus:ring-ring"
              )}
              aria-label={`Inning ${inningNumber} detail entry ${index + 1}`}
            />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold p-1 rounded text-foreground">
          Total: {inningStats.runs} runs, {inningStats.wickets} wickets in {inningStats.overs} overs
        </p>
      </CardFooter>
    </Card>
  );
}
