"use client";

import { useMutation,useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmotionsSelector } from "@/components/ui/emotions-selector";
import {
  Select, 
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  
} from "@/components/ui/select";
import { MoraleData, MoraleType } from "@/lib/types";

// You'll probably move SignOutButton to its own file.
// We don't need useQuery or useConvexAuth on this page.

export default function Home() {
  // TODO: Add submit to Convex
  // 1. Add your mutation for submitting feedback
  //const submitFeedback = useMutation(api.feedback.submit); // (You'll need to create this)
  const rawMoraleOptions = useQuery(api.form.getAllMorale);

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
  

  return (
    <main className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold">How are you feeling today?</h1>
      <p className="text-slate-600 mt-2">Your selection is anonymous.</p>
      
      <form className="flex flex-col gap-4 mt-8 w-full max-w-md">
        <EmotionsSelector 
          moraleData={moraleOptions} 
          selectedIds={selectedEmotions}
          onChange={setSelectedEmotions}
          isLoading={isLoading}/>
        
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

        <button 
          type="submit" 
          className="bg-blue-600 text-white p-3 rounded-lg font-medium"
        >
          Submit Status
        </button>
      </form>
    </main>
  );
}