
"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { parseSingleScoreEntry } from "@/lib/score-parser";
import { cn } from "@/lib/utils";

interface FilteredInningColumnProps {
  inningNumber: 1 | 2;
  filterTeamName: string;
  allScores: string[];
  allEventDetails: string[];
}

interface DisplayEntry {
  originalScore: string;
  originalDetail: string;
  parsedRuns: number;
  parsedWickets: number;
  isLegal: boolean;
}

export function FilteredInningColumn({
  inningNumber,
  filterTeamName,
  allScores,
  allEventDetails,
}: FilteredInningColumnProps) {
  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  const cardTitle = filterTeamName.trim()
    ? `${filterTeamName.trim()} - ${inningLabel}`
    : inningLabel;

  const { displayedEntries, totalRuns, totalWickets } = useMemo(() => {
    const entries: DisplayEntry[] = [];
    let runs = 0;
    let wickets = 0;
    let legalBalls = 0; // Kept for consistency with parser, though not directly displayed in footer

    const trimmedFilterName = filterTeamName.trim().toLowerCase();

    allScores.forEach((score, index) => {
      const detail = allEventDetails[index] || "";
      const trimmedDetail = detail.trim().toLowerCase();

      if (trimmedFilterName === "" || trimmedDetail === trimmedFilterName) {
        if (score.trim() !== "") { // Only process non-empty score strings
          const parsed = parseSingleScoreEntry(score);
          entries.push({
            originalScore: score,
            originalDetail: detail,
            parsedRuns: parsed.runs,
            parsedWickets: parsed.wickets,
            isLegal: parsed.isLegalDelivery,
          });
          runs += parsed.runs;
          wickets += parsed.wickets;
          if (parsed.isLegalDelivery) {
            legalBalls += 1;
          }
        }
      }
    });
    return { displayedEntries: entries, totalRuns: runs, totalWickets: wickets, totalLegalBalls: legalBalls };
  }, [allScores, allEventDetails, filterTeamName]);

  return (
    <Card className={cn(
        "w-full md:w-auto md:min-w-[300px] shadow-lg", 
        "bg-green-700 dark:bg-green-800" // Different color for scorecard page
      )}>
      <CardHeader>
        <CardTitle className="text-gray-100">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-200 max-h-[400px] overflow-y-auto">
        {displayedEntries.length === 0 ? (
          <p>No scores recorded for {filterTeamName.trim() || "this inning"}.</p>
        ) : (
          <div className="grid grid-cols-[1fr_auto] gap-x-4 items-center"> {/* Adjusted grid columns */}
            <span className="font-semibold col-span-1">Score Entry</span>
            <span className="font-semibold col-span-1 text-center px-1">Team</span>
            {/* Removed "Parsed (R/W)" header */}
            {displayedEntries.map((entry, index) => (
              <React.Fragment key={index}>
                <span className="py-1 truncate col-span-1">{entry.originalScore}</span>
                <span className="py-1 truncate col-span-1 text-center px-1">{entry.originalDetail || "-"}</span>
                {/* Removed parsed data display column */}
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold text-gray-100">
          Total: {totalRuns} runs, {totalWickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}
    
