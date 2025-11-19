import { query } from "./_generated/server";



// Helper functions 

function calculateOverallScore(feedbackList: any[]) {
  if (feedbackList.length === 0) return 0;
  const scores = feedbackList.map((fb) => fb.score);
  // Simple average logic
  const total = scores.reduce((acc, curr) => acc + curr, 0);
  return Math.round(total / scores.length);
}


function calculateTrend(allFeedback: any[], daysAgo: number) {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;
  const windowDuration = daysAgo * msInDay;
  
  const startOfCurrent = now - windowDuration;
  const startOfPrevious = now - (windowDuration * 2);

  
  const currentPeriod = allFeedback.filter(f => f._creationTime >= startOfCurrent);
  const previousPeriod = allFeedback.filter(f => 
    f._creationTime >= startOfPrevious && f._creationTime < startOfCurrent
  );

  const currentAvg = calculateOverallScore(currentPeriod);
  const previousAvg = calculateOverallScore(previousPeriod);

  return currentAvg - previousAvg;
}


function calculateTeamStats(teams: any[], allFeedback: any[], moraleLookup: Map<string, any>) {
  return teams.map((team) => {
    
    const teamFeedback = allFeedback.filter((f) => f.teamId === team._id);

    const statusCounts = { Green: 0, Amber: 0, Red: 0 };
    const feelingCounts = new Map<string, number>();

    
    for (const fb of teamFeedback) {
      // Note: Make sure your schema uses 'morales' or 'moraleIds' consistently. 
      // I am assuming 'morales' based on previous context.
      const moraleIds = fb.morale || fb.moraleIds || []; 
      
      for (const mId of moraleIds) {
        const def = moraleLookup.get(mId);
        if (!def) continue;

        if (def.type === "Positive") statusCounts.Green++;
        else if (def.type === "Neutral") statusCounts.Amber++;
        else if (def.type === "Negative") statusCounts.Red++;

        feelingCounts.set(def.name, (feelingCounts.get(def.name) || 0) + 1);
      }
    }

    // Determine Status
    let status = "Grey";
    if (teamFeedback.length > 0) {
      if (statusCounts.Red >= statusCounts.Amber && statusCounts.Red >= statusCounts.Green) status = "Red";
      else if (statusCounts.Amber >= statusCounts.Green) status = "Amber";
      else status = "Green";
    }

    // Top 3 Feelings
    const topFeelings = Array.from(feelingCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name]) => name);

    return {
      id: team._id,
      name: team.name,
      status,
      topFeelings,
      reportCount: teamFeedback.length
    };
  });
}

// --------------------------------------------------------------------------
// 2. MAIN QUERY (The Aggregator)
// --------------------------------------------------------------------------

export const get = query({
  args: {},
  handler: async (ctx) => {
    //Fetching in parallel
    const [latestSummary, teams, allMorales, allFeedback] = await Promise.all([
      ctx.db.query("summaries").order("desc").first(),
      ctx.db.query("teams").collect(),
      ctx.db.query("morale").collect(), 
      ctx.db.query("feedback").collect(), 
    ]);

    // PREPARE LOOKUPS
    const moraleMap = new Map();
    allMorales.forEach(m => moraleMap.set(m._id, m));

    const teamNameMap = new Map();
    teams.forEach(t => teamNameMap.set(t._id, t.name));

    // Overall Morale 
    const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
    const recentFeedback = allFeedback.filter(f => 
      f._creationTime >= (Date.now() - sevenDaysMs)
    );
    const overallMorale = calculateOverallScore(recentFeedback);

    // Trend (Compare last 7 days vs previous 7)
    const moraleTrend = calculateTrend(allFeedback, 7);

    // Team Stats
    const teamStats = calculateTeamStats(teams, allFeedback, moraleMap);

    // Recent Feed (Formatted for UI)
    const recentFeedFormatted = allFeedback
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, 10)
      .map(f => ({
        _id: f._id,
        comment: f.comment,
        teamName: teamNameMap.get(f.teamId) || "Unknown",
        timeAgo: new Date(f._creationTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }));

    return {
      summary: latestSummary?.summary || "No summary available.",
      overallMorale,
      moraleTrend,
      teamStats,
      recentFeedback: recentFeedFormatted
    };
  },
});


//Old Code that I wrote, above is a refactored version written by Gemini
// import {mutation, query} from "./_generated/server";
// import { v } from "convex/values";
// import { Id } from "./_generated/dataModel";
// import { calculateAverage } from "../lib/utils";
// import {differenceInDays} from "date-fns";

// export const getSummary = query({
//   handler: async (ctx) => {
//     const summaries = await ctx.db.query("summaries").order("desc").first();
//     return summaries;
//   },
// });

// // Overall Morale Calculation
// export const getOverallMorale = query({
//     args: {
//         daysAgo: v.number(), 
//     },
//     handler: async (ctx,args) => {
//         const today = Date.now();
//         const msInDay = 24 * 60 * 60 * 1000;
//         const cutoffTime = today - (args.daysAgo * msInDay);

//         const recentFeedback = await ctx.db
//             .query("feedback")
//             .withIndex("by_creation_time", (q) => q.gte("_creationTime", cutoffTime))
//             .collect();

//         if (recentFeedback.length === 0) {
//             return 0; 
//         }
//         const scores = recentFeedback.map((fb) => fb.score);
//         const averageScore = calculateAverage(scores);
//         return averageScore;
//     },
// });

// //morale trend
// export const getMoraleTrend = query({
//   args: {
//     daysAgo: v.number(), 
//   },
//   handler: async (ctx, args) => {
//     const now = Date.now();
//     const msInDay = 24 * 60 * 60 * 1000;
    
//     const windowDuration = args.daysAgo * msInDay;
//     const startOfCurrentPeriod = now - windowDuration;
//     const startOfPreviousPeriod = now - (windowDuration * 2);

//     // 1. OPTIMIZATION: Fetch all data for BOTH periods in one query
//     // We start fetching from the beginning of the PREVIOUS period.
//     const rawFeedback = await ctx.db
//       .query("feedback")
//       .withIndex("by_creation_time", (q) => q.gte("_creationTime", startOfPreviousPeriod))
//       .collect();

//     // 2. Partition the data into buckets
//     let currentSum = 0;
//     let currentCount = 0;
//     let previousSum = 0;
//     let previousCount = 0;

//     for (const f of rawFeedback) {
//       if (f._creationTime >= startOfCurrentPeriod) {
//         // This belongs to the Current Period 
//         currentSum += f.score;
//         currentCount++;
//       } else {
//         // This belongs to the Previous Period 
//         previousSum += f.score;
//         previousCount++;
//       }
//     }
//     const currentAvg = currentCount > 0 ? Math.round(currentSum / currentCount) : 0;
//     const previousAvg = previousCount > 0 ? Math.round(previousSum / previousCount) : 0;
    
//     return currentAvg - previousAvg;
//   },
// });

// //teamStats
// export const getAllTeams = query({
//     handler: async(ctx) => {
//         const allTeams = await ctx.db.query("teams").collect();
//         return allTeams;
//     }
// });

// export const getTeamStats = query({
//   handler: async (ctx) => {
//     //Fetch all Morale definitions once to create a Lookup Map.
//     const allMoraleDocs = await ctx.db.query("morale").collect();
//     const moraleLookup = new Map<string, typeof allMoraleDocs[0]>();
    
//     allMoraleDocs.forEach((m) => {
//       moraleLookup.set(m._id, m);
//     });

//     const teams = await ctx.db.query("teams").collect();

//     //Process each team in parallel
//     const teamStats = await Promise.all(
//       teams.map(async (team) => {
//         // Fetch only this team's feedback
//         const teamFeedback = await ctx.db
//           .query("feedback")
//           .withIndex("by_team", (q) => q.eq("teamId", team._id))
//           .collect();

//         // Aggregation Counters
//         const statusCounts = { Green: 0, Amber: 0, Red: 0 };
//         const feelingCounts = new Map<string, number>();

        
//         for (const fb of teamFeedback) {
//           for (const moraleId of fb.moraleIds) {
//             const moraleDef = moraleLookup.get(moraleId);
//             if (!moraleDef) continue;

//             // A. Count Status (Type -> Color)
//             if (moraleDef.type === "Positive") statusCounts.Green++;
//             else if (moraleDef.type === "Neutral") statusCounts.Amber++;
//             else if (moraleDef.type === "Negative") statusCounts.Red++;

//             // B. Count Specific Feelings
//             const currentCount = feelingCounts.get(moraleDef.name) || 0;
//             feelingCounts.set(moraleDef.name, currentCount + 1);
//           }
//         }

//         //Get dominiant status
//         let dominantStatus: "Green" | "Amber" | "Red" | "Grey" = "Grey";
//         let maxCount = 0;

//         // If there is no feedback, status remains Grey
//         if (teamFeedback.length > 0) {
//             if (statusCounts.Red >= statusCounts.Amber && statusCounts.Red >= statusCounts.Green) {
//                 dominantStatus = "Red";
//             } else if (statusCounts.Amber >= statusCounts.Green) {
//                 dominantStatus = "Amber";
//             } else {
//                 dominantStatus = "Green";
//             }
//         }

//         // Convert Map to Arrays,sort and take top 3 feelings
//         const sortedFeelings = Array.from(feelingCounts.entries())
//           .sort((a, b) => b[1] - a[1]) 
//           .slice(0, 3)                 
//           .map(([name]) => name);      

//         return {
//           id: team._id,
//           name: team.name,
//           status: dominantStatus,
//           topFeelings: sortedFeelings,
//           reportCount: teamFeedback.length
//         };
//       })
//     );

//     return teamStats;
//   },
// });

// //weekly Feedback
// export const getWeeklyFeedback = query({
//     args:{
//         daysAgo: v.number(),
//     },
//     handler: async(ctx,args) => {
//         const today = Date.now();
//         const msInDay = 24 * 60 * 60 * 1000;
//         const cutoffTime = today - (args.daysAgo * msInDay);
//         const weeklyFeedback = await ctx.db
//             .query("feedback")
//             .withIndex("by_creation_time", (q) => q.gte("_creationTime", cutoffTime))
//             .collect();
//         return weeklyFeedback;
//     }
// });
