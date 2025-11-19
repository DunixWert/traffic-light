import {mutation} from "./_generated/server";
import { v } from "convex/values";

export const submit = mutation({
 
  args: {
    moraleIds: v.array(v.id("morale")), // Array of selected emotion IDs
    teamId: v.optional(v.id("teams")),     
    email: v.optional(v.string()),      
    comment: v.optional(v.string()),    
  },
  handler: async (ctx, args) => {
    const selectedMorales = await Promise.all(
      args.moraleIds.map((id) => ctx.db.get(id))
    );

    let totalScore = 0;
    let count = 0;

    for (const m of selectedMorales) {
      if (!m) continue;
      
      // Assign values: Positive=100, Neutral=50, Negative=0
      const val = m.type === "Positive" ? 100 
                : m.type === "Neutral" ? 50 
                : 0;
      
      totalScore += val;
      count++;
    }
    const normalizedScore = count > 0 ? Math.round(totalScore / count) : 0;

    const reportId = await ctx.db.insert("feedback", {
      moraleIds: args.moraleIds,
      teamId: args.teamId,
      email: args.email,
      comment: args.comment,
      score: normalizedScore, //used to calculate overall morale
    });

    return reportId;
  },
});