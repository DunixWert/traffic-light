/*
TODO: 
 Steps:
    1. How to get feedback data from frontend form
        1.1 
    2. Insert feedback data into "feedback" table
    3. Link feedback to "morale" entries via references
    4. Optional: Link feedback to "teams" if provided
    5. Handle optional email and comment fields
*/

import {mutation} from "./_generated/server";
import { v } from "convex/values";
// Mutation to submit feedback
export const submit = mutation({
  // Define the arguments the mutation expects
  args: {
    moraleIds: v.array(v.id("morale")), // Array of selected emotion IDs
    //teamId: v.optional(v.string()),     
    email: v.optional(v.string()),      
    comment: v.optional(v.string()),    
  },
  handler: async (ctx, args) => {
    
    const reportId = await ctx.db.insert("feedback", {
      moraleIds: args.moraleIds,
      //teamId: args.teamId,
      email: args.email,
      comment: args.comment
    });

    return reportId;
  },
});