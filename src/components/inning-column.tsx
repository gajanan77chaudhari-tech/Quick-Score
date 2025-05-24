
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface InningColumnProps {
  inningNumber: 1 | 2;
  scores: string[];
  onScoresUpdate: (scores: string[]) => void;
  inningStats: { runs: number; wickets: number };
  teamName: string; // Added teamName prop
}

const SCORE_BOX_COUNT = 17;
const MAX_INPUT_LENGTH = 10; 

function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const isValidInput = (val: string): boolean => {
  const trimmedVal = val.trim();
  if (trimmedVal === '') return true; 
  
  // Allows:
  // - Number (runs): "0", "6", "10", "123"
  // - 'W' (wicket)
  // - Number + '/' + optional Number (runs/wickets): "4/", "4/1", "10/23"
  // - '/' + Number (0 runs/wickets): "/1", "/10"
  // - Also allows for partial inputs like "4/" or "/" to avoid premature error
  const regex = /^(\d*)$|^W$|^(\d*\/\d*)$|^(\/\d*)$/;
  return regex.test(trimmedVal);
};

export function InningColumn({ inningNumber, scores: initialScores, onScoresUpdate, inningStats, teamName }: InningColumnProps) {
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
    // No trim() here to allow spaces during typing, it's handled in validation/calculation
    const processedValue = value.toUpperCase().slice(0, MAX_INPUT_LENGTH);
    newValues[index] = processedValue;
    setInputValues(newValues);

    const isValid = isValidInput(processedValue);
    const newErrors = [...inputErrors];
    // Show error only if not valid AND not empty (and not just a partially valid like "4/")
    newErrors[index] = !isValid && processedValue.trim() !== '' && !/^\d+\/$/.test(processedValue.trim()) && !/^\/$/.test(processedValue.trim());
    setInputErrors(newErrors);

    onScoresUpdate(newValues);
  };

  return (
    <Card className="w-full md:w-auto md:min-w-[320px] shadow-lg bg-card dark:bg-card">
      <CardHeader>
        <CardTitle className="text-primary">{teamName} - {inningNumber === 1 ? "1st Inning" : "2nd Inning"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {Array.from({ length: SCORE_BOX_COUNT }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <label htmlFor={`inning-${inningNumber}-score-${index}`} className="sr-only">
              {teamName} - Inning {inningNumber} - Score entry {index + 1}
            </label>
            <Input
              id={`inning-${inningNumber}-score-${index}`}
              type="text"
              value={inputValues[index] || ""}
              onChange={(e) => handleInputChange(index, e.target.value)}
              maxLength={MAX_INPUT_LENGTH}
              className={cn(
                "h-9 w-36 text-center transition-colors duration-300", 
                "bg-background dark:bg-slate-800", 
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

    