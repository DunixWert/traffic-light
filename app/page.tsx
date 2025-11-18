"use client";

import { useMutation,useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { use, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmotionsSelector } from "@/components/ui/emotions-selector";
import { MoraleData, MoraleType } from "@/lib/types";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const TOAST_DURATION = 2000;
//Helper function
const isValidEmail = (email: string) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export default function Home() {
  const rawMoraleOptions = useQuery(api.form.getAllMorale);
  const submitFeedback = useMutation(api.feedback.submit);
  const getColorForType = (type: MoraleType): string => {
  switch (type) {
    case 'Positive':
      return 'border-green-500 bg-green-50';
    case 'Neutral':
      return 'border-amber-500 bg-amber-50';
    case 'Negative':
      return 'border-red-500 bg-red-50';
    default:
      return 'gray';
  }


};
  const moraleOptions: MoraleData[] = (rawMoraleOptions || []).map(option => ({
    id: option._id, 
    name: option.name,
    type: option.type as MoraleType, 
    color: getColorForType(option.type as MoraleType), 
  }));
  const isLoading = rawMoraleOptions === undefined; // for loading state of emotion selector
  
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  //const [team, setTeam] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // UI loading state
  const [showMore, setShowMore] = useState(false); // State for "More Emotions" toggle

  // --- DYNAMIC BACKGROUND ---
  useEffect(() => {
    if (!moraleOptions.length) return;

    // 1. Find the objects for the selected IDs
    const selectedItems = moraleOptions.filter(m => selectedEmotions.includes(m.id));
    
    // 2. Determine dominance
    const hasPositive = selectedItems.some(i => i.type === 'Positive');
    const hasNegative = selectedItems.some(i => i.type === 'Negative');
    const hasNeutral = selectedItems.some(i => i.type === 'Neutral');

    let start = "rgba(255, 99, 71, 0.01)"; // Default Red
    let mid   = "rgba(255, 165, 0, 0.01)"; // Default Amber
    let end   = "rgba(50, 205, 50, 0.01)"; // Default Green

    // Logic: If purely one type, flood the background with that color
    // If mixed (e.g. Bittersweet), keep the rainbow
    if (selectedItems.length > 0) {
      if (hasPositive && !hasNegative && !hasNeutral) {
        // Purely Positive -> All Green
        start = mid = end = "rgba(50, 205, 50, 0.03)";
      } else if (hasNegative && !hasPositive && !hasNeutral) {
        // Purely Negative -> All Red
        start = mid = end = "rgba(255, 38, 0, 0.03)";
      } else if (hasNeutral && !hasPositive && !hasNegative) {
         // Purely Neutral -> All Amber
        start = mid = end = "rgba(255, 165, 0, 0.03)";
      }
    }

    // 3. Apply to Body
    document.body.style.setProperty('--traffic-start', start);
    document.body.style.setProperty('--traffic-mid', mid);
    document.body.style.setProperty('--traffic-end', end);

  }, [selectedEmotions, moraleOptions]);
  // --- DYNAMIC BACKGROUND LOGIC END ---

  // 4. Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEmotions.length === 0) {
      toast.warning("Selection Required", {
        description: "Please choose at least one emotion to continue.",
        duration: TOAST_DURATION,
        icon: <span className="text-lg">⚠️</span> 
      });
      return;
    }
    if (email && !isValidEmail(email)) {
      toast.error("Invalid Email", {
        description: "Please enter a valid email address (e.g., user@example.com) or leave the field empty.",
        duration: TOAST_DURATION,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the mutation
      await submitFeedback({
        moraleIds: selectedEmotions as Id<"morale">[], // Cast string[] to Convex IDs
        //teamId: team || undefined, 
        email: email || undefined,
        comment: comment || undefined,
      });

      // Success Feedback
      toast("Success ", {
          description: "Successfully submitted your status report!"
        });
      
      // Reset Form
      setSelectedEmotions([]);
      setEmail("");
      setComment("");
      if (showMore) {
          setShowMore(false);
      }
      // Optional: Keep team/email if you want them to persist
      
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error("Submission Failed", {
        description: "An error occurred while submitting your status. Please try again later.",
        duration: TOAST_DURATION,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="p-8 flex flex-col items-center">

      <h1 className="text-3xl font-bold">How are you feeling today?</h1>
      <p className="text-slate-600 mt-2">Your selection is anonymous.</p>
      
      <form onSubmit={handleSubmit}className="flex flex-col gap-4 mt-8 w-full max-w-md " noValidate>
        <EmotionsSelector 
          moraleData={moraleOptions} 
          selectedIds={selectedEmotions}
          onChange={setSelectedEmotions}
          isLoading={isLoading}
          showMore={showMore}
          onToggleShowMore={() => setShowMore(!showMore)}
          />
        
        {/*#TODO: Readd Team field and add */}
        {/* <label>Which team are you on? (Optional)</label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Team [optional]" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
          
        </SelectGroup>
      </SelectContent>
    </Select> */}
        
        <label>Your email (Optional)</label>
        <Input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          placeholder="you@example.com"
        />

        <label>Any details to share? (Optional)</label>
        <Textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)}
        />

        <Button 
          type="submit" 
          disabled={isSubmitting || isLoading}
          className="bg-blue-600 text-white p-3 rounded-lg font-medium"
        >
          Submit Status
        </Button>
      </form>
    </main>
  );
}