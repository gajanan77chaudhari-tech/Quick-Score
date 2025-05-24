
/**
 * @fileOverview Utility functions for parsing cricket score entries.
 * - parseSingleScoreEntry: Parses a single score string into runs, wickets, and determines if it's a legal delivery.
 * - calculateTotalStats: Calculates total runs, wickets, legal balls, and overs from an array of score strings.
 */

export const parseSingleScoreEntry = (scoreEntry: string): { runs: number; wickets: number; isLegalDelivery: boolean } => {
  let parsedRuns = 0;
  let parsedWickets = 0;
  const s = scoreEntry.toUpperCase().trim();

  if (!s) return { runs: 0, wickets: 0, isLegalDelivery: false };

  const isNoBall = s.includes("NB");
  const isWide = s.includes("WD");
  const isLegalDelivery = !(isNoBall || isWide);

  const cleanScoreEntryForParsing = s.replace(/\s/g, ''); // Remove all internal spaces

  if (cleanScoreEntryForParsing.includes('/')) {
    const parts = cleanScoreEntryForParsing.split('/', 2);
    const runsPart = parts[0];
    const wicketsPart = parts[1];

    const extractedRuns = runsPart.replace(/[^0-9]/g, "");
    if (extractedRuns) {
      parsedRuns += parseInt(extractedRuns, 10);
    }
    parsedWickets += (runsPart.match(/W/g) || []).length;

    const extractedWickets = wicketsPart.replace(/[^0-9]/g, "");
    if (extractedWickets) {
      parsedWickets += parseInt(extractedWickets, 10);
    }
    parsedWickets += (wicketsPart.match(/W/g) || []).length;
    
  } else { // No slash
    const extractedRuns = cleanScoreEntryForParsing.replace(/[^0-9]/g, "");
    if (extractedRuns) {
      parsedRuns += parseInt(extractedRuns, 10);
    }
    parsedWickets += (cleanScoreEntryForParsing.match(/W/g) || []).length;
  }

  let finalRuns = parsedRuns;
  if (isWide) finalRuns += 1;  // Add 1 run for a wide delivery
  if (isNoBall) finalRuns +=1; // Add 1 run for a no-ball delivery

  return { runs: finalRuns, wickets: parsedWickets, isLegalDelivery };
};

export const calculateTotalStats = (scores: string[]): { runs: number; wickets: number; balls: number; overs: string } => {
  let totalRuns = 0;
  let totalWickets = 0;
  let totalLegalBalls = 0;

  scores.forEach(scoreEntry => {
    // Process non-empty entries. parseSingleScoreEntry handles internal trimming.
    if (scoreEntry.trim() === "") return; 
    const parsed = parseSingleScoreEntry(scoreEntry);
    totalRuns += parsed.runs;
    totalWickets += parsed.wickets;
    if (parsed.isLegalDelivery) {
      totalLegalBalls += 1;
    }
  });

  const fullOvers = Math.floor(totalLegalBalls / 6);
  const ballsInCurrentOver = totalLegalBalls % 6;
  const oversString = `${fullOvers}.${ballsInCurrentOver}`;

  return { runs: totalRuns, wickets: totalWickets, balls: totalLegalBalls, overs: oversString };
};
