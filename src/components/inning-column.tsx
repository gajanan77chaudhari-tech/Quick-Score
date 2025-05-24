
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface InningColumnProps {
  inningNumber: 1 | 2;
  scores: string[];
  onScoresUpdate: (scores: string[]) => void;
  inningStats: { runs: number; wickets: number; balls: number; overs: string };
}

const SCORE_BOX_COUNT = 17;
const MAX_INPUT_LENGTH = 10; 

export function InningColumn({ inningNumber, scores: initialScores, onScoresUpdate, inningStats }: InningColumnProps) {
  const [inputValues, setInputValues] = useState<string[]>(() => 
    initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill("")
  );

  useEffect(() => {
    // Ensure inputValues always reflects the prop, especially on reset or external changes.
    // Only update if initialScores is genuinely different to avoid unnecessary re-renders or cursor jumps.
    if (JSON.stringify(initialScores) !== JSON.stringify(inputValues)) {
       setInputValues(initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill(""));
    }
  }, [initialScores]); // Removed inputValues from dependency array

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    newValues[index] = value.slice(0, MAX_INPUT_LENGTH); // Enforce max length
    setInputValues(newValues);
    onScoresUpdate(newValues); 
  };

  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  const cardTitle = inningLabel; 

  return (
    <Card className={cn(
        "w-full md:w-auto md:min-w-[350px] shadow-lg",
        "bg-blue-700 dark:bg-blue-800" 
      )}>
      <CardHeader>
        <CardTitle className="text-gray-100">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: SCORE_BOX_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <label htmlFor={`inning-${inningNumber}-score-${index}`} className="sr-only">
              {cardTitle} - Score entry {index + 1}
            </label>
            <Input
              id={`inning-${inningNumber}-score-${index}`}
              type="text"
              value={inputValues[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 w-full text-center transition-colors duration-300 text-base md:text-sm", 
                "bg-background dark:bg-slate-800 text-foreground dark:text-gray-100",
                "focus:ring-ring"
              )}
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
