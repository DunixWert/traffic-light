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

  morale: defineTable({
    name: v.string(), 

    type: v.union(
      v.literal("Positive"),
      v.literal("Neutral"),
      v.literal("Negative")
    ),
  }),

  feedback: defineTable({
    moraleIds: v.array(v.id("morale")),

    teamId: v.optional(v.id("teams")),

    email: v.optional(v.string()),
    comment: v.optional(v.string()),
    score: v.number(),
  }).index("by_team", ["teamId"]),

  summaries: defineTable({
    summary: v.string(), 
    year: v.number(),
    week: v.number(),
  }),

});

