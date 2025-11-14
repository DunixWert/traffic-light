"use client";

import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, 
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
// You'll probably move SignOutButton to its own file.
// We don't need useQuery or useConvexAuth on this page.

export default function Home() {
  // 1. Add your mutation for submitting feedback
  //const submitFeedback = useMutation(api.feedback.submit); // (You'll need to create this)

  // 2. Add state for your form inputs [cite: 29-32]
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [team, setTeam] = useState("");
  const [email, setEmail] = useState("");
  const [comment, setComment] = useState("");

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   // 3. Call your mutation
  //   await submitFeedback({
  //     emotions: selectedEmotions,
  //     teamId: team, // You'll need to match this to your schema
  //     email: email,
  //     comment: comment,
  //   });
  //   // Maybe show a "Thank you" message
  // };

  return (
    <main className="p-8 flex flex-col items-center">
      {/* 4. Add your "How are you feeling today?" UI here [cite: 32] */}
      <h1 className="text-3xl font-bold">How are you feeling today?</h1>
      <p className="text-slate-600 mt-2">Your selection is anonymous.</p>
      
      <form className="flex flex-col gap-4 mt-8 w-full max-w-md">
        {/* Add your emotion selectors (Good, Okay, Struggling, etc.) 
          These will update the `selectedEmotions` state.
        */}

        <label>Which team are you on? (Optional)</label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a Team [optional]" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Teams</SelectLabel>
          
        </SelectGroup>
      </SelectContent>
    </Select>
        
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