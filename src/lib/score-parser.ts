
/**
 * @fileOverview Utility functions for parsing cricket score entries and calculating stats.
 * - parseSingleScoreEntry: Parses a single score string into runs, wickets, and determines if it's a legal delivery.
 * - calculateTotalStats: Calculates total runs, wickets, legal balls, and overs from an array of score strings,
 *                        optionally filtered by a target team name matching event details.
 * - getCanonicalTeamName: Converts various team name inputs (full names, abbreviations, different cases)
 *                         to a standard canonical form.
 */

const teamAliases: Record<string, string> = {
  'chennai super kings': 'CSK', 'csk': 'CSK',
  'delhi capitals': 'DC', 'dc': 'DC',
  'gujarat titans': 'GT', 'gt': 'GT',
  'kolkata knight riders': 'KKR', 'kkr': 'KKR',
  'lucknow super giants': 'LSG', 'lsg': 'LSG',
  'mumbai indians': 'MI', 'mi': 'MI',
  'punjab kings': 'PBKS', 'pbks': 'PBKS',
  'rajasthan royals': 'RR', 'rr': 'RR',
  'royal challengers bengaluru': 'RCB', 'rcb': 'RCB',
  'sunrisers hyderabad': 'SRH', 'srh': 'SRH',
};

export const getCanonicalTeamName = (inputName: string): string => {
  if (!inputName || typeof inputName !== 'string') {
    return "";
  }
  const normalizedInput = inputName.trim().toLowerCase();
  return teamAliases[normalizedInput] || normalizedInput;
};

export const parseSingleScoreEntry = (scoreEntry: string): { runs: number; wickets: number; isLegalDelivery: boolean } => {
  let parsedRuns = 0;
  let parsedWickets = 0;
  const s = scoreEntry.toUpperCase().trim();

  if (!s) return { runs: 0, wickets: 0, isLegalDelivery: false };

  const isNoBall = s.includes("NB");
  const isWide = s.includes("WD");
  const isLegalDelivery = !(isNoBall || isWide) && s.length > 0;

  let cleanScoreEntryForParsing = s.replace(/NB|WD/gi, '').trim();

  if (cleanScoreEntryForParsing.includes('/')) {
    const parts = cleanScoreEntryForParsing.split('/', 2);
    const runsPart = parts[0];
    const wicketsPart = parts[1];

    const extractedRunsBeforeSlash = runsPart.replace(/[^0-9]/g, "");
    if (extractedRunsBeforeSlash) {
      parsedRuns += parseInt(extractedRunsBeforeSlash, 10);
    }
    parsedWickets += (runsPart.match(/W/gi) || []).length;

    const extractedWicketsAfterSlash = wicketsPart.replace(/[^0-9]/g, "");
    if (extractedWicketsAfterSlash) {
      parsedWickets += parseInt(extractedWicketsAfterSlash, 10);
    }
    parsedWickets += (wicketsPart.match(/W/gi) || []).length;
    
  } else {
    const extractedRuns = cleanScoreEntryForParsing.replace(/[^0-9W]/gi, "").replace(/[^0-9]/g, "");
    if (extractedRuns) {
      parsedRuns += parseInt(extractedRuns, 10);
    }
    parsedWickets += (cleanScoreEntryForParsing.match(/W/gi) || []).length;
  }

  if (isWide) parsedRuns += 1;
  if (isNoBall) parsedRuns +=1;

  return { runs: parsedRuns, wickets: parsedWickets, isLegalDelivery };
};

export const calculateTotalStats = (
  scores: string[],
  eventDetails: string[],
  targetTeamNameInput: string // This is the raw input from the main team name field
): { runs: number; wickets: number; balls: number; overs: string } => {
  let totalRuns = 0;
  let totalWickets = 0;
  let totalLegalBalls = 0;

  const canonicalTargetTeam = getCanonicalTeamName(targetTeamNameInput);

  scores.forEach((scoreEntry, index) => {
    if (!scoreEntry || scoreEntry.trim() === "") return;

    const eventDetailTeamRaw = eventDetails[index] || "";
    const canonicalEventTeam = getCanonicalTeamName(eventDetailTeamRaw);
    
    if (canonicalTargetTeam === "" || (canonicalEventTeam !== "" && canonicalEventTeam === canonicalTargetTeam)) {
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
