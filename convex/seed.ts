import { internalMutation } from "./_generated/server";

// The list of emotions from the project plan
const moraleData = [
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