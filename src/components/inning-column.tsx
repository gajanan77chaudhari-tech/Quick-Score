
"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InningColumnProps {
  inningNumber: 1 | 2;
  scores: string[];
  onScoresUpdate: (scores: string[]) => void;
  inningStats: { runs: number; wickets: number };
}

const SCORE_BOX_COUNT = 17;
const MAX_INPUT_LENGTH = 4; // Allows for "R/WW" e.g., "6/10"

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const isValidInput = (val: string): boolean => {
  if (val === '') return true;
  // No need to call toUpperCase() here as it's done in handleInputChange
  // Allows:
  // - Single digit 0-6
  // - 'W'
  // - Digit (0-6) + '/' + zero or more Digits (e.g., 4/, 4/1, 0/12)
  const regex = /^([0-6])$|^W$|^([0-6])\/(\d*)$/; // Changed \d+ to \d* to allow "R/" as valid intermediate
  return regex.test(val);
};

export function InningColumn({ inningNumber, scores: initialScores, onScoresUpdate, inningStats }: InningColumnProps) {
  const [inputValues, setInputValues] = useState<string[]>(() => 
    initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill("")
  );
  const [inputErrors, setInputErrors] = useState<boolean[]>(Array(SCORE_BOX_COUNT).fill(false));
  const [highlightScore, setHighlightScore] = useState(false);

  useEffect(() => {
    setInputValues(initialScores.length === SCORE_BOX_COUNT ? initialScores : Array(SCORE_BOX_COUNT).fill(""));
  }, [initialScores]);

  const prevRuns = usePrevious(inningStats.runs);
  const prevWickets = usePrevious(inningStats.wickets);

  useEffect(() => {
    if (prevRuns !== undefined && prevWickets !== undefined && (inningStats.runs !== prevRuns || inningStats.wickets !== prevWickets)) {
      setHighlightScore(true);
      const timer = setTimeout(() => setHighlightScore(false), 500);
      return () => clearTimeout(timer);
    }
  }, [inningStats.runs, inningStats.wickets, prevRuns, prevWickets]);

  const handleInputChange = (index: number, value: string) => {
    const newValues = [...inputValues];
    // Uppercase, trim, then slice
    const processedValue = value.toUpperCase().trim().slice(0, MAX_INPUT_LENGTH);
    newValues[index] = processedValue;
    setInputValues(newValues);

    const isValid = isValidInput(processedValue);
    const newErrors = [...inputErrors];
    // An empty processedValue is valid (clearing the input), but don't show error for it
    // Show error if not valid AND not empty.
    // Also, if it ends with just a slash (e.g., "4/"), it's a valid partial input for typing,
    // but not a "complete" entry for calculation (calculateInningStats handles this).
    // We only mark as error if it's invalid *and* not empty.
    // "4/" will pass isValidInput now, so it won't be marked as error.
    newErrors[index] = !isValid && processedValue !== '';
    setInputErrors(newErrors);

    onScoresUpdate(newValues); // Pass the array which contains the processed value
  };

  return (
    <Card className="w-full md:w-auto md:min-w-[300px] shadow-lg bg-blue-500/30 dark:bg-blue-700/50">
      <CardHeader>
        <CardTitle className="text-primary">{inningNumber === 1 ? "1st Inning" : "2nd Inning"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: SCORE_BOX_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <label htmlFor={`inning-${inningNumber}-score-${index}`} className="sr-only">
              Score for ball {index + 1}
            </label>
            <Input
              id={`inning-${inningNumber}-score-${index}`}
              type="text"
              value={inputValues[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 w-20 text-center transition-colors duration-300",
                "bg-background dark:bg-slate-900", 
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
        <p 
          className={cn(
            "text-lg font-semibold transition-all duration-300 p-1 rounded",
            highlightScore ? "bg-accent/30" : ""
          )}
        >
          Total: {inningStats.runs} runs, {inningStats.wickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}
