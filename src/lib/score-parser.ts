
/**
 * @fileOverview Utility functions for parsing cricket score entries.
 * - parseSingleScoreEntry: Parses a single score string into runs, wickets, and determines if it's a legal delivery.
 * - calculateTotalStats: Calculates total runs, wickets, legal balls, and overs from an array of score strings, optionally filtered by a target team name matching event details.
 */

export const parseSingleScoreEntry = (scoreEntry: string): { runs: number; wickets: number; isLegalDelivery: boolean } => {
  let parsedRuns = 0;
  let parsedWickets = 0;
  const s = scoreEntry.toUpperCase().trim();

  if (!s) return { runs: 0, wickets: 0, isLegalDelivery: false }; // No score means no runs, no wickets, not a legal ball

  const isNoBall = s.includes("NB");
  const isWide = s.includes("WD");
  
  // A delivery is legal if it's not a No Ball or a Wide, and there's some content indicating an event.
  // An empty string or just "NB" or "WD" without runs/wickets might not be a bowled ball.
  // However, for simplicity, we will count any entry with content as a ball unless it's NB/WD.
  // The core requirement for a legal ball is that it's NOT a NoBall or Wide.
  const isLegalDelivery = !(isNoBall || isWide) && s.length > 0;


  // Remove all known non-score related annotations for run/wicket parsing.
  // Keep W for wicket, numbers for runs.
  // Handle slash for run/wicket separation.
  let cleanScoreEntryForParsing = s.replace(/NB|WD/gi, '').trim(); // Remove NB/WD for parsing runs/wickets from the event itself

  if (cleanScoreEntryForParsing.includes('/')) {
    const parts = cleanScoreEntryForParsing.split('/', 2);
    const runsPart = parts[0];
    const wicketsPart = parts[1];

    // Extract runs from the part before '/'
    const extractedRunsBeforeSlash = runsPart.replace(/[^0-9]/g, "");
    if (extractedRunsBeforeSlash) {
      parsedRuns += parseInt(extractedRunsBeforeSlash, 10);
    }
    // Count 'W's before the slash as wickets
    parsedWickets += (runsPart.match(/W/gi) || []).length;

    // Extract wickets from the part after '/'
    const extractedWicketsAfterSlash = wicketsPart.replace(/[^0-9]/g, "");
    if (extractedWicketsAfterSlash) {
      parsedWickets += parseInt(extractedWicketsAfterSlash, 10);
    }
    // Count 'W's after the slash as wickets (though typically it's numbers after slash)
    parsedWickets += (wicketsPart.match(/W/gi) || []).length;
    
  } else { // No slash, parse whole string
    const extractedRuns = cleanScoreEntryForParsing.replace(/[^0-9W]/gi, "").replace(/[^0-9]/g, "");
    if (extractedRuns) {
      parsedRuns += parseInt(extractedRuns, 10);
    }
    parsedWickets += (cleanScoreEntryForParsing.match(/W/gi) || []).length;
  }

  // Add runs for wide or no-ball itself
  if (isWide) parsedRuns += 1;
  if (isNoBall) parsedRuns +=1;

  return { runs: parsedRuns, wickets: parsedWickets, isLegalDelivery };
};

export const calculateTotalStats = (
  scores: string[],
  eventDetails: string[],
  targetTeamName: string
): { runs: number; wickets: number; balls: number; overs: string } => {
  let totalRuns = 0;
  let totalWickets = 0;
  let totalLegalBalls = 0;

  const trimmedTargetTeamName = targetTeamName.trim().toLowerCase();

  scores.forEach((scoreEntry, index) => {
    if (!scoreEntry || scoreEntry.trim() === "") return; // Skip empty score entries

    const eventTeamName = (eventDetails[index] || "").trim().toLowerCase();

    // If a targetTeamName is specified, only count scores for that team.
    // If no targetTeamName is specified (it's empty), count all scores.
    if (trimmedTargetTeamName === "" || eventTeamName === trimmedTargetTeamName) {
      const parsed = parseSingleScoreEntry(scoreEntry);
      totalRuns += parsed.runs;
      totalWickets += parsed.wickets;
      if (parsed.isLegalDelivery) {
        totalLegalBalls += 1;
      }
    }
  });

  const fullOvers = Math.floor(totalLegalBalls / 6);
  const ballsInCurrentOver = totalLegalBalls % 6;
  const oversString = `${fullOvers}.${ballsInCurrentOver}`;

  return { runs: totalRuns, wickets: totalWickets, balls: totalLegalBalls, overs: oversString };
};
