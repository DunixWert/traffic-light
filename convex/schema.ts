import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";


export default defineSchema({
  ...authTables,
  numbers: defineTable({
    value: v.number(),
  }),
  teams: defineTable({
    name: v.string(), 
  }),

  /**
   * Stores the available morale options/feelings.
   */
  morale: defineTable({
    name: v.string(), // Corresponds to "NameOfFeeling" 

    type: v.union(
      v.literal("Positive"),
      v.literal("Neutral"),
      v.literal("Negative")
    ),
  }),

  feedback: defineTable({
    moraleIds: v.array(v.id("morale")),

    // Foreign key to the "teams" table. Optional as per the form[cite: 30].
    teamId: v.optional(v.id("teams")),

    // Optional fields from the "Feedback" table  and form[cite: 31, 32].
    email: v.optional(v.string()),
    comment: v.optional(v.string()),
    
    // The "TimeSent" field  is automatically handled by
    // Convex's "_creationTime" property on every document.
  }),

  /**
   * Stores the AI-generated weekly summaries[cite: 22].
   * Based on the "Summaries" table in the diagram.
   */
  summaries: defineTable({
    summary: v.string(), // The text content of the summary 
    // Represents "period (week of Year)"  in a queryable format
    year: v.number(),
    week: v.number(),
  }),

  /**
   * Stores admin user data, linking to Convex Auth.
   * This is for the administrator dashboard[cite: 13, 23].
   */
});

