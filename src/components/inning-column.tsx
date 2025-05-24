
"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InningColumnProps {
  inningNumber: 1 | 2;
  scores: string[];
  onScoresUpdate: (scores: string[]) => void;
  inningStats: { runs: number; wickets: number };
  teamName?: string; // Added teamName prop
}

const SCORE_BOX_COUNT = 17;
const MAX_INPUT_LENGTH = 10; 

const isValidInput = (val: string): boolean => {
  const trimmedVal = val.trim();
  if (trimmedVal === '') return true;
  
  const regex = /^(\d{1,3})$|^W$|^(\d{0,3}\/\d{0,2})$|^(\/\d{1,2})$/;
  return regex.test(trimmedVal);
};

export function InningColumn({ inningNumber, scores: initialScores, onScoresUpdate, inningStats, teamName }: InningColumnProps) {
  const [inputValues, setInputValues] = useState<string[]>(() => 
    initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill("")
  );
  const [inputErrors, setInputErrors] = useState<boolean[]>(Array(SCORE_BOX_COUNT).fill(false));

  useEffect(() => {
    setInputValues(initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill(""));
  }, [initialScores]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    const processedValue = value.toUpperCase().slice(0, MAX_INPUT_LENGTH);
    newValues[index] = processedValue;
    setInputValues(newValues);

    const isValid = isValidInput(processedValue);
    const newErrors = [...inputErrors];
    newErrors[index] = !isValid && processedValue.trim() !== '' && !/^\d*\/?$/.test(processedValue.trim());
    setInputErrors(newErrors);

    onScoresUpdate(newValues.map(v => v.trim()));
  };

  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  const cardTitle = teamName && teamName.trim() !== "" ? `${teamName} - ${inningLabel}` : inningLabel;

  return (
    <Card className="w-full md:w-auto md:min-w-[350px] shadow-lg bg-blue-700 dark:bg-blue-800">
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
                inputErrors[index] ? "border-destructive ring-destructive ring-1" : "focus:ring-ring"
              )}
              aria-invalid={inputErrors[index]}
              aria-describedby={inputErrors[index] ? `inning-${inningNumber}-error-${index}` : undefined}
            />
            {inputErrors[index] && (
              <AlertCircle 
                id={`inning-${inningNumber}-error-${index}`} 
                className="h-5 w-5 text-destructive" 
                aria-label="Invalid input" 
              />
            )}
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold p-1 rounded text-foreground">
          Total: {inningStats.runs} runs, {inningStats.wickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}
