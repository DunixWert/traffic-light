import { internalMutation } from "./_generated/server";
/*
Insert Morale Data into the "morale" Table

This script seeds the "morale" table with a predefined list of emotions
and their associated types (Positive, Neutral, Negative). It checks for
existing entries to avoid duplicates.
*/
// The list of emotions from the project plan
const moraleData = [
  { name: "Good", type: "Positive" },
  { name: "Okay", type: "Neutral" },
  { name: "Struggling", type: "Negative" },
  { name: "Joyful", type: "Positive" },
  { name: "Grateful", type: "Positive" },
  { name: "Serene", type: "Positive" },
  { name: "Interested", type: "Positive" },
  { name: "Amused", type: "Positive" },
  { name: "Hopeful", type: "Positive" },
  { name: "Inspired", type: "Positive" },
  { name: "Awe", type: "Positive" },
  { name: "Love", type: "Positive" },
  { name: "Content", type: "Positive" },
  { name: "Relieved", type: "Positive" },
  { name: "Elated", type: "Positive" },
  { name: "Excited", type: "Positive" },
  { name: "Eager", type: "Positive" },
  { name: "Optimistic", type: "Positive" },
  { name: "Appreciative", type: "Positive" },
  { name: "Blissful", type: "Positive" },
  { name: "Cheerful", type: "Positive" },
  { name: "Triumphant", type: "Positive" },
  { name: "Secure", type: "Positive" },
  { name: "Confident", type: "Positive" },
  { name: "Valued", type: "Positive" },
  { name: "Respected", type: "Positive" },
  { name: "Energetic", type: "Positive" },
  { name: "Lively", type: "Positive" },
  { name: "Playful", type: "Positive" },
  { name: "Thrilled", type: "Positive" },
  { name: "Ecstatic", type: "Positive" },
  { name: "Enthusiastic", type: "Positive" },
  { name: "Sympathetic", type: "Positive" },
  { name: "Kind", type: "Positive" },
  { name: "Curious", type: "Positive" },
  { name: "Sad", type: "Negative" },
  { name: "Angry", type: "Negative" },
  { name: "Fearful", type: "Negative" },
  { name: "Ashamed", type: "Negative" },
  { name: "Guilty", type: "Negative" },
  { name: "Jealous", type: "Negative" },
  { name: "Envious", type: "Negative" },
  { name: "Disgusted", type: "Negative" },
  { name: "Frustrated", type: "Negative" },
  { name: "Lonely", type: "Negative" },
  { name: "Hopeless", type: "Negative" },
  { name: "Depressed", type: "Negative" },
  { name: "Hurt", type: "Negative" },
  { name: "Resentful", type: "Negative" },
  { name: "Bitter", type: "Negative" },
  { name: "Apathetic", type: "Negative" },
  { name: "Discouraged", type: "Negative" },
  { name: "Disappointed", type: "Negative" },
  { name: "Worried", type: "Negative" },
  { name: "Insecure", type: "Negative" },
  { name: "Nervous", type: "Negative" },
  { name: "Panicked", type: "Negative" },
  { name: "Powerless", type: "Negative" },
  { name: "Vulnerable", type: "Negative" },
  { name: "Grumpy", type: "Negative" },
  { name: "Irritated", type: "Negative" },
  { name: "Annoyed", type: "Negative" },
  { name: "Drained", type: "Negative" },
  { name: "Exhausted", type: "Negative" },
  { name: "Miserable", type: "Negative" },
  { name: "Humbled", type: "Negative" },
  { name: "Embarrassed", type: "Negative" },
  { name: "Regretful", type: "Negative" },
  { name: "Skeptical", type: "Negative" },
  { name: "Suspicious", type: "Negative" },
  { name: "Aggravated", type: "Negative" },
  { name: "Defeated", type: "Negative" },
  { name: "Grieving", type: "Negative" },
  { name: "Indifferent", type: "Neutral" },
  { name: "Reflective", type: "Neutral" },
  { name: "Pensive", type: "Neutral" },
  { name: "Thoughtful", type: "Neutral" },
  { name: "Ambivalent", type: "Neutral" },
  { name: "Surprised", type: "Neutral" },
  { name: "Intrigued", type: "Neutral" },
  { name: "Cautious", type: "Neutral" },
  { name: "Reserved", type: "Neutral" },
  { name: "Detached", type: "Neutral" },
  { name: "Numb", type: "Neutral" },
  { name: "Perplexed", type: "Neutral" },
  { name: "Contemplative", type: "Neutral" },
  { name: "Nostalgic", type: "Neutral" },
  { name: "Patient", type: "Neutral" },
  { name: "Accepting", type: "Neutral" },
  { name: "Sentimental", type: "Neutral" },
  { name: "Aware", type: "Neutral" },
  { name: "Serious", type: "Neutral" },
  { name: "Solemn", type: "Neutral" },
  { name: "Mellow", type: "Neutral" },
  { name: "Still", type: "Neutral" },
  { name: "Quiet", type: "Neutral" },
  { name: "Watchful", type: "Neutral" },
  { name: "Analytical", type: "Neutral" },
  { name: "Objective", type: "Neutral" },
  { name: "Impartial", type: "Neutral" },
  { name: "Observant", type: "Neutral" },
  { name: "Uncertain", type: "Neutral" },
  { name: "Disinterested", type: "Neutral" }
] as const; 

export const seedMoraleTable = internalMutation({
  handler: async (ctx) => {
    // 1. Get all existing morale entries from the database
    const existingEmotions = await ctx.db.query("morale").collect();

    // 2. Create a Set of names for fast O(1) lookups
    const existingNames = new Set(existingEmotions.map((e) => e.name));

    // 3. Filter our list to only include emotions NOT in the Set
    const newEmotions = moraleData.filter(
      (morale) => !existingNames.has(morale.name)
    );

    // 4. Check if there's anything new to add
    if (newEmotions.length === 0) {
      const message = "Seeding complete. No new emotions to add.";
      console.log(message);
      return message;
    }

    // 5. Insert only the new emotions
    console.log(`Found ${newEmotions.length} new emotions to add. Seeding...`);
    await Promise.all(
      newEmotions.map((morale) => {
        ctx.db.insert("morale", morale);
      })
    );

    const message = `Seeding complete. Added ${newEmotions.length} new emotions.`;
    console.log(message);
    return message;
  },
});

/*
Insert Team Data into the "teams" Table

This script seeds the "teams" table with a predefined list of team names.
It checks for existing entries to avoid duplicates.
*/
const teams = ["Engineering", "Marketing", "Sales", "HR", "Design"] as const;

export const seedTeamTable = internalMutation({
  handler: async (ctx) => {
    const existingTeams = await ctx.db.query("teams").collect();
    const existingTeamNames = new Set(existingTeams.map((t) => t.name));
    const newTeams = teams.filter((team) => !existingTeamNames.has(team));

    if (newTeams.length === 0) {
      const message = "Seeding complete. No new teams to add.";
      console.log(message);
      return message;
    }
    console.log(`Found ${newTeams.length} new teams to add. Seeding...`);
    await Promise.all(
      newTeams.map((team) => {
        ctx.db.insert("teams", { name: team });
      })
    );
  }
});
export const backfillFeedbackScores = internalMutation({
  args: {},
  handler: async (ctx) => {
    // 1. Fetch all Morale Definitions to build a Lookup Map
    const allMorales = await ctx.db.query("morale").collect();
    const moraleMap = new Map<string, number>();

    allMorales.forEach((m) => {
      // Assign values: Positive=100, Neutral=50, Negative=0
      const val = m.type === "Positive" ? 100 
                : m.type === "Neutral" ? 50 
                : 0;
      moraleMap.set(m._id, val);
    });

    // 2. Fetch ALL existing feedback
    const allFeedback = await ctx.db.query("feedback").collect();
    
    let updatedCount = 0;

    // 3. Iterate and Patch
    for (const fb of allFeedback) {
      // Calculate the score for this specific report
      let totalScore = 0;
      let count = 0;

      for (const moraleId of fb.moraleIds) {
        const score = moraleMap.get(moraleId);
        // We explicitly check for undefined in case a morale ID is stale
        if (score !== undefined) {
          totalScore += score;
          count++;
        }
      }

      // Normalize (Average)
      const newScore = count > 0 ? Math.round(totalScore / count) : 0;

      // 4. Update the record using PATCH (only updates specific fields)
      await ctx.db.patch(fb._id, {
        score: newScore,
      });
      
      updatedCount++;
    }

    return `Success: Backfilled scores for ${updatedCount} feedback records.`;
  },
});