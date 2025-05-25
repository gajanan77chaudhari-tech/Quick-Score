
"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { parseSingleScoreEntry, getCanonicalTeamName } from "@/lib/score-parser";
import { cn } from "@/lib/utils";

interface FilteredInningColumnProps {
  inningNumber: 1 | 2;
  filterTeamName: string; // This should be the canonical team name
  allScores: string[];
  allEventDetails: string[];
}

interface DisplayEntry {
  originalScore: string;
  originalDetail: string; // Display the original detail
  parsedRuns: number;
  parsedWickets: number;
  isLegal: boolean;
}

export function FilteredInningColumn({
  inningNumber,
  filterTeamName, // Expected to be canonical
  allScores,
  allEventDetails,
}: FilteredInningColumnProps) {
  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  // Card title uses the canonical filterTeamName
  const cardTitle = filterTeamName.trim()
    ? `${filterTeamName.trim().toUpperCase()} - ${inningLabel}`
    : inningLabel;

  const { displayedEntries, totalRuns, totalWickets } = useMemo(() => {
    const entries: DisplayEntry[] = [];
    let runs = 0;
    let wickets = 0;
    
    // The filterTeamName prop is already canonical
    const canonicalFilterName = filterTeamName.trim(); // Already canonical, just trim

    allScores.forEach((score, index) => {
      const originalDetail = allEventDetails[index] || "";
      const canonicalEventDetail = getCanonicalTeamName(originalDetail); // Canonicalize event detail for comparison

      // Filter condition: if no filterTeamName, show all. Otherwise, show if canonical event detail matches canonical filter.
      if (canonicalFilterName === "" || (canonicalEventDetail !== "" && canonicalEventDetail === canonicalFilterName)) {
        if (score.trim() !== "") { 
          const parsed = parseSingleScoreEntry(score);
          entries.push({
            originalScore: score,
            originalDetail: originalDetail, // Store original detail for display
            parsedRuns: parsed.runs,
            parsedWickets: parsed.wickets,
            isLegal: parsed.isLegalDelivery,
          });
          runs += parsed.runs;
          wickets += parsed.wickets;
        }
      }
    });
    return { displayedEntries: entries, totalRuns: runs, totalWickets: wickets };
  }, [allScores, allEventDetails, filterTeamName]);

  return (
    <Card className={cn(
        "w-full md:w-auto md:min-w-[300px] shadow-lg", 
        "bg-card" // Using default card background
      )}>
      <CardHeader>
        <CardTitle className="text-foreground">{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground max-h-[400px] overflow-y-auto">
        {displayedEntries.length === 0 ? (
          <p>No scores recorded for {filterTeamName.trim().toUpperCase() || "this inning"}.</p>
        ) : (
          <div className="grid grid-cols-[1fr_auto] gap-x-4 items-center">
            <span className="font-semibold col-span-1">Score Entry</span>
            <span className="font-semibold col-span-1 text-center px-1">Team</span>
            {displayedEntries.map((entry, index) => (
              <React.Fragment key={index}>
                <span className="py-1 truncate col-span-1">{entry.originalScore}</span>
                {/* Display the original detail the user entered */}
                <span className="py-1 truncate col-span-1 text-center px-1">{entry.originalDetail || "-"}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-lg font-semibold text-foreground">
          Total: {totalRuns} runs, {totalWickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}
