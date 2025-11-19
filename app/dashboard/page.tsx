"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";


interface DashboardData {
  summary: string;
  overallMorale: number; // 0-100
  moraleTrend: number;   
  
  
  // e.g., +3 or -5
  teamStats: {
    id: string;
    name: string;
    status: "Green" | "Amber" | "Red" | "Grey";
    topFeelings: string[];
  }[];
  recentFeedback: {
    _id: string;
    comment: string;
    teamName: string;
    timeAgo: string; 
  }[];
}

export default function DashboardPage() {
  // This query expects your backend implementation
  const data = useQuery(api.dashboard.get) as DashboardData | undefined;

  // Color helpers for the "Traffic Light" logic
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Green": return "bg-green-500";
      case "Amber": return "bg-amber-400"; // Matches design 'Amber' 
      case "Red": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  const getMoraleColorText = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* 1. Auth Loading State */}
      <AuthLoading>
        <div className="flex h-screen w-full items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-slate-200 mb-4"></div>
            <div className="h-4 w-32 bg-slate-200 rounded"></div>
          </div>
        </div>
      </AuthLoading>

      {/* 2. Unauthenticated State */}
      <Unauthenticated>
        <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
          <h1 className="text-2xl font-bold">Traffic Light</h1>
          <p className="text-slate-500">Please sign in to view the dashboard.</p>
          {/* Insert your <SignIn /> component here */}
        </div>
      </Unauthenticated>

      {/* 3. Authenticated Dashboard */}
      <Authenticated>
        <main className="max-w-7xl mx-auto p-6 lg:p-8">
          
          {/* Header */}
          <header className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Traffic Light</h1>
              <p className="text-sm text-slate-500">Admin Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-slate-700">Welcome, Admin</span>
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-sm">
                JV
              </div>
            </div>
          </header>

          {/* AI Summary Section  */}
          <section className="mb-6 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 mb-3">
              AI-Generated Weekly Summary
            </h2>
            <div className="text-slate-600 leading-relaxed">
              {data?.summary ? (
                data.summary
              ) : (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                </div>
              )}
            </div>
          </section>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Column 1: Overall Morale (Span 4)  */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center justify-center min-h-[350px]">
              <h3 className="text-slate-500 font-medium mb-6 uppercase tracking-wide text-sm">Overall Morale</h3>
              
              {/* Percentage Display */}
              <div className={`text-7xl font-bold mb-2 ${getMoraleColorText(data?.overallMorale || 0)}`}>
                {data?.overallMorale ?? "--"}%
              </div>
              
              {/* Status Label */}
              <span className={`text-lg font-medium mb-8 ${getMoraleColorText(data?.overallMorale || 0)}`}>
                ({data?.overallMorale && data.overallMorale >= 50 ? (data.overallMorale >= 80 ? "Green" : "Amber") : "Red"})
              </span>
              
              {/* Progress Bar */}
              <div className="w-full max-w-[200px] bg-slate-100 rounded-full h-3 mb-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${getMoraleColorText(data?.overallMorale || 0).replace('text-', 'bg-')}`} 
                  style={{ width: `${data?.overallMorale || 0}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-slate-400 font-medium">
                {data?.moraleTrend && data.moraleTrend > 0 ? "+" : ""}
                {data?.moraleTrend ?? 0}% from last week
              </p>
            </div>

            {/* Column 2: Pilot Team Status (Span 4)  */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Pilot Team Status</h3>
              <div className="space-y-3">
                {data?.teamStats?.length ? (
                  data.teamStats.map((team) => (
                    <div key={team.id} className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:border-blue-100 transition-colors">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-slate-700">{team.name}</span>
                        {/* Traffic Light Dot */}
                        <div className={`w-3 h-3 rounded-full shadow-sm ${getStatusColor(team.status)}`} />
                      </div>
                      
                      {/* Emotion Tags */}
                      <div className="flex flex-wrap gap-2">
                        {team.topFeelings.map((feeling, idx) => (
                           <span key={idx} className={`text-[10px] px-2 py-1 rounded-full font-medium border ${
                             team.status === "Red" ? "bg-red-50 text-red-600 border-red-100" :
                             team.status === "Amber" ? "bg-amber-50 text-amber-700 border-amber-100" :
                             "bg-green-50 text-green-700 border-green-100"
                           }`}>
                              {feeling}
                           </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">Loading teams...</p>
                )}
              </div>
            </div>

            {/* Column 3: Recent Feedback (Span 4)  */}
            <div className="lg:col-span-4 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Feedback</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {data?.recentFeedback?.length ? (
                  data.recentFeedback.map((item) => (
                    <div key={item._id} className="p-4 rounded-lg border-l-4 border-slate-200 bg-slate-50/50">
                      <p className="text-slate-600 text-sm mb-3 italic">
                        "{item.comment}"
                      </p>
                      <div className="flex justify-between items-center text-xs font-medium text-slate-400">
                        <span>from {item.teamName}</span>
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  ))
                ) : (
                   <div className="text-center py-10 text-slate-400">No feedback yet.</div>
                )}
              </div>
            </div>

          </div>
        </main>
      </Authenticated>
    </div>
  );
}