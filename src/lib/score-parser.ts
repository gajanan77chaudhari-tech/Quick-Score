
/**
 * @fileOverview Utility functions for parsing cricket score entries.
 * - parseSingleScoreEntry: Parses a single score string into runs and wickets.
 * - calculateTotalStats: Calculates total runs and wickets from an array of score strings.
 */

export const parseSingleScoreEntry = (scoreEntry: string): { runs: number; wickets: number } => {
  let runs = 0;
  let wickets = 0;
  const s = scoreEntry.toUpperCase().trim().replace(/\s/g, ''); // Remove all spaces

  if (!s) return { runs: 0, wickets: 0 };

  if (s.includes('/')) {
    const parts = s.split('/', 2);
    const runsPart = parts[0];
    const wicketsPart = parts[1];

    // Extract runs from before the slash
    const extractedRuns = runsPart.replace(/[^0-9]/g, "");
    if (extractedRuns) {
      runs += parseInt(extractedRuns, 10);
    }
    // Count 'W's as wickets from before the slash
    wickets += (runsPart.match(/W/g) || []).length;

    // Extract wicket numbers from after the slash
    const extractedWickets = wicketsPart.replace(/[^0-9]/g, "");
    if (extractedWickets) {
      wickets += parseInt(extractedWickets, 10);
    }
    // Count 'W's as wickets from after the slash
    wickets += (wicketsPart.match(/W/g) || []).length;
    
  } else { // No slash
    // Extract all numbers as runs
    const extractedRuns = s.replace(/[^0-9]/g, "");
    if (extractedRuns) {
      runs += parseInt(extractedRuns, 10);
    }
    // Count all 'W's as wickets
    wickets += (s.match(/W/g) || []).length;
  }
  return { runs, wickets };
};

export const calculateTotalStats = (scores: string[]): { runs: number; wickets: number } => {
  let totalRuns = 0;
  let totalWickets = 0;
  scores.forEach(scoreEntry => {
    if (scoreEntry.trim() === "") return; // Skip empty entries for total calculation
    const parsed = parseSingleScoreEntry(scoreEntry);
    totalRuns += parsed.runs;
    totalWickets += parsed.wickets;
  });
  return { runs: totalRuns, wickets: totalWickets };
};
