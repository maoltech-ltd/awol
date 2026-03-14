// src/context/InsightsContext.tsx
import React, { createContext, useState, ReactNode } from "react";

const initialInsights = [
  "20+ Projects Completed",
  "3+ Years of Freelancing",
  "99% Client Satisfaction",
  "20K+ Subscribers",
  "Authored In-Depth Course on Educative",
  "Contributed as a Technical Course Reviewer 📝",
  "Recipient of the Hackernoon Noonies Award 🏆",
];

// Define the context type
interface InsightsContextType {
  insights: string[];
  addInsight: (newInsight: string) => void;
}

// Create the context with default values
export const InsightsContext = createContext<InsightsContextType>({
  insights: [],
  addInsight: () => {},
});

export const InsightsProvider = ({ children }: { children: ReactNode }) => {
  const [insights, setInsights] = useState(initialInsights);

  // Function to add new insight while keeping max length = 7
  const addInsight = (newInsight: string) => {
    setInsights((prev) => {
      const updated = [newInsight, ...prev]; // add to front
      if (updated.length > 7) {
        updated.pop(); // remove last element
      }
      return updated;
    });
  };

  return (
    <InsightsContext.Provider value={{ insights, addInsight }}>
      {children}
    </InsightsContext.Provider>
  );
};
