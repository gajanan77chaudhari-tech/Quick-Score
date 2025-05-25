
"use client";

import React, { Suspense } from "react"; 
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FilteredInningColumn } from "@/components/filtered-inning-column"; 
import { ArrowLeft } from "lucide-react";
import { getCanonicalTeamName } from "@/lib/score-parser"; // Import for consistency, though teamName from URL should be canonical

function FilteredScorecardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // teamName from URL should already be canonical if sent correctly from page.tsx
  const filterTeamNameFromURL = searchParams.get("teamName") || "";
  const inning1ScoresString = searchParams.get("inning1Scores") || "[]";
  const inning1EventDetailsString = searchParams.get("inning1EventDetails") || "[]";
  const inning2ScoresString = searchParams.get("inning2Scores") || "[]";
  const inning2EventDetailsString = searchParams.get("inning2EventDetails") || "[]";

  let inning1Scores: string[] = [];
  let inning1EventDetails: string[] = [];
  let inning2Scores: string[] = [];
  let inning2EventDetails: string[] = [];

  try {
    inning1Scores = JSON.parse(inning1ScoresString);
    inning1EventDetails = JSON.parse(inning1EventDetailsString);
    inning2Scores = JSON.parse(inning2ScoresString);
    inning2EventDetails = JSON.parse(inning2EventDetailsString);
  } catch (error) {
    console.error("Error parsing scorecard data from URL:", error);
  }
  
  // Use the (already canonical) team name from URL for the page title
  const pageTitle = filterTeamNameFromURL.trim() ? `${filterTeamNameFromURL.trim().toUpperCase()}'s Detailed Scorecard` : "Detailed Scorecard";

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen w-full">
      <header className="text-center w-full mt-4 mb-2">
        <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
            <Button variant="outline" size="icon" onClick={() => router.back()} aria-label="Go back">
                <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-semibold text-foreground flex-grow text-center">
                {pageTitle}
            </h1>
            <div className="w-10"></div> 
        </div>
      </header>

      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center mt-4 max-w-5xl mx-auto">
        <FilteredInningColumn
          inningNumber={1}
          filterTeamName={filterTeamNameFromURL} // Pass the canonical name
          allScores={inning1Scores}
          allEventDetails={inning1EventDetails}
        />
        <FilteredInningColumn
          inningNumber={2}
          filterTeamName={filterTeamNameFromURL} // Pass the canonical name
          allScores={inning2Scores}
          allEventDetails={inning2EventDetails}
        />
      </main>
      
      <footer className="mt-auto py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ScoreScribe. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default function FilteredScorecardPage() {
  return (
    <Suspense fallback={<div>Loading scorecard...</div>}>
      <FilteredScorecardContent />
    </Suspense>
  );
}
