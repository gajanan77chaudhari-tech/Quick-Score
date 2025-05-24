
"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ResultsInningColumn } from '@/components/results-inning-column';
import { ArrowLeft } from 'lucide-react';

// Helper component to use useSearchParams within Suspense
function TeamResultsContent() {
  const searchParams = useSearchParams();

  const teamName = searchParams.get('team') || "Team";
  const scores1String = searchParams.get('scores1');
  const scores2String = searchParams.get('scores2');

  let inning1Scores: string[] = [];
  let inning2Scores: string[] = [];

  try {
    if (scores1String) {
      inning1Scores = JSON.parse(scores1String);
    }
    if (scores2String) {
      inning2Scores = JSON.parse(scores2String);
    }
  } catch (error) {
    console.error("Error parsing scores JSON:", error);
    // Handle error or set default empty scores
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 flex flex-col items-center gap-8 min-h-screen w-full">
      <header className="text-center w-full mt-8 mb-6">
        <div className="flex justify-start w-full mb-4">
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Score Entry
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-bold text-primary">{teamName} - Scorecard</h1>
      </header>

      <main className="flex flex-col md:flex-row gap-6 md:gap-8 w-full items-start justify-center">
        <ResultsInningColumn
          inningNumber={1}
          teamName={teamName}
          scores={inning1Scores}
        />
        <ResultsInningColumn
          inningNumber={2}
          teamName={teamName}
          scores={inning2Scores}
        />
      </main>
      
      <footer className="mt-auto py-4 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} ScoreScribe. All rights reserved.</p>
      </footer>
    </div>
  );
}


export default function TeamResultsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading scores...</div>}>
      <TeamResultsContent />
    </Suspense>
  );
}
