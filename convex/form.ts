import {mutation, query} from "./_generated/server";
import { v } from "convex/values";

// Fetching all morale options for use in the EmotionsSelector component
export const getAllMorale = query({
  handler: async (ctx) => {
    const moraleOptions = await ctx.db.query("morale").collect();
    return moraleOptions;
  },
});

//Fetching all teams for use in the Team select field
export const getAllTeams = query({
  handler: async (ctx) => {
    const teams = await ctx.db.query("teams").collect();
    return teams;
  },
});