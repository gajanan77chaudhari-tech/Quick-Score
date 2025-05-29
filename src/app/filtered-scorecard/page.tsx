
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, NotebookPen } from 'lucide-react'; // Removed ListChecks
import { getCanonicalTeamName, parseSingleScoreEntry } from '@/lib/score-parser';

// Define constants used in this file
// const LOCAL_STORAGE_KEY_PREFIX = "scoreScribeAppState_"; // No longer needed here

// Removed AppState and SavedMatchSummary interfaces as they are not used for this simplified page

// Local component to display one inning's filtered details for the *current* team from URL
function CurrentTeamInningDetailsCard({
  inningNumber,
  allScores,
  allEventDetails,
  displayTeamName, // Raw team name from URL for display
  filterTeamName // Canonical team name from URL for filtering
}: {
  inningNumber: 1 | 2;
  allScores: string[];
  allEventDetails: string[];
  displayTeamName: string;
  filterTeamName: string;
}) {
  const inningLabel = inningNumber === 1 ? "1st Inning" : "2nd Inning";
  let displayedEntries: { score: string; detail: string }[] = [];
  let totalRuns = 0;
  let totalWickets = 0;

  if (Array.isArray(allScores) && Array.isArray(allEventDetails)) {
    allScores.forEach((score, index) => {
      const detail = allEventDetails[index] || "";
      const canonicalEventDetailTeam = getCanonicalTeamName(detail);

      // Filter condition: if no filterTeamName from URL, show all. 
      // Otherwise, show if canonical event detail matches canonical filter from URL.
      if (filterTeamName === "" || (canonicalEventDetailTeam !== "" && canonicalEventDetailTeam === filterTeamName)) {
        if (score.trim() !== "" || detail.trim() !== "") { // Show if either score or detail has content for this team
          displayedEntries.push({ score, detail });
          if (score.trim() !== "") { // Only parse score if it exists
            const parsed = parseSingleScoreEntry(score);
            totalRuns += parsed.runs;
            totalWickets += parsed.wickets;
          }
        }
      }
    });
  }
  
  const cardTitleBase = displayTeamName.trim() ? `${displayTeamName.trim().toUpperCase()}` : "";
  const cardTitle = cardTitleBase ? `${cardTitleBase} - ${inningLabel}` : inningLabel;

  return (
    <Card className="w-full md:w-1/2">
      <CardHeader>
        <CardTitle>{cardTitle}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <ScrollArea className="h-[250px] pr-3">
          {displayedEntries.length === 0 ? (
            <p>No scores recorded for {displayTeamName.toUpperCase() || "this inning's filter criteria"}.</p>
          ) : (
            <div className="grid grid-cols-[1fr_auto] gap-x-4 items-center">
              <span className="font-semibold col-span-1 text-muted-foreground">Score Entry</span>
              <span className="font-semibold col-span-1 text-center px-1 text-muted-foreground">Detail/Team</span>
              {displayedEntries.map((entry, i) => (
                <React.Fragment key={i}>
                  <span className="py-0.5 truncate col-span-1">{entry.score || "-"}</span>
                  <span className="py-0.5 truncate col-span-1 text-center px-1">{entry.detail || "-"}</span>
                </React.Fragment>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <p className="text-base font-semibold">
          Total (Filtered): {totalRuns} runs, {totalWickets} wickets
        </p>
      </CardFooter>
    </Card>
  );
}


function FilteredScorecardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Data for the currently selected/viewed team, passed via URL
  const rawFilterTeamNameFromURL = searchParams.get("teamName") || "";
  const inning1ScoresString = searchParams.get("inning1Scores") || "[]";
  const inning1EventDetailsString = searchParams.get("inning1EventDetails") || "[]";
  const inning2ScoresString = searchParams.get("inning2Scores") || "[]";
  const inning2EventDetailsString = searchParams.get("inning2EventDetails") || "[]";

  let currentInning1Scores: string[] = [];
  let currentInning1EventDetails: string[] = [];
  let currentInning2Scores: string[] = [];
  let currentInning2EventDetails: string[] = [];

  try {
    currentInning1Scores = JSON.parse(inning1ScoresString);
    currentInning1EventDetails = JSON.parse(inning1EventDetailsString);
    currentInning2Scores = JSON.parse(inning2ScoresString);
    currentInning2EventDetails = JSON.parse(inning2EventDetailsString);
  } catch (error) {
    console.error("Error parsing current scorecard data from URL:", error);
  }

  const canonicalFilterNameForCurrentTeam = getCanonicalTeamName(rawFilterTeamNameFromURL);
  // Use the raw name for display in the title for user consistency
  const displayTeamNameForTitle = searchParams.get("teamName") || ""; 
  const pageTitle = displayTeamNameForTitle.trim() ? `${displayTeamNameForTitle.trim()}'s Detailed Scorecard` : "Detailed Scorecard";

  // Removed state and useEffect for allSavedMatchSummaries

  // Removed handleViewSavedMatch function

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen w-full bg-background">
      <header className="text-center w-full mt-4 mb-2">
        <div className="flex items-center justify-between w-full max-w-5xl mx-auto">
            <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground flex-grow text-center truncate px-2">
                {pageTitle}
            </h1>
            <Link href="/" passHref>
              <Button variant="outline" aria-label="Go to score entry">
                <NotebookPen className="h-5 w-5 mr-2" /> Score Entry
              </Button>
            </Link>
        </div>
      </header>

      {/* Current Team's Detailed Scorecard */}
      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center mt-4 max-w-5xl mx-auto">
        <CurrentTeamInningDetailsCard
          inningNumber={1}
          allScores={currentInning1Scores}
          allEventDetails={currentInning1EventDetails}
          displayTeamName={displayTeamNameForTitle} 
          filterTeamName={canonicalFilterNameForCurrentTeam}
        />
        <CurrentTeamInningDetailsCard
          inningNumber={2}
          allScores={currentInning2Scores}
          allEventDetails={currentInning2EventDetails}
          displayTeamName={displayTeamNameForTitle}
          filterTeamName={canonicalFilterNameForCurrentTeam} 
        />
      </main>

      {/* Removed "List of All Other Saved Matches" section */}
      
      <footer className="mt-auto py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ScoreScribe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function FilteredScorecardPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-6 rounded-lg shadow-xl bg-card text-card-foreground">
          Loading scorecard...
        </div>
      </div>
    }>
      <FilteredScorecardContent />
    </Suspense>
  );
}
