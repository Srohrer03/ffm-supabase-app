import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { SkeletonLoader } from "./SkeletonLoader";

const mockData = [
  { month: "Jan", thisYear: 45000, lastYear: 52000 },
  { month: "Feb", thisYear: 42000, lastYear: 48000 },
  { month: "Mar", thisYear: 38000, lastYear: 51000 },
  { month: "Apr", thisYear: 41000, lastYear: 49000 },
  { month: "May", thisYear: 39000, lastYear: 47000 },
  { month: "Jun", thisYear: 36000, lastYear: 45000 }
];

export const CostSavingsChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonLoader height="h-48" />;
  }

  const currentMonth = data[data.length - 1];
  const savings = currentMonth.lastYear - currentMonth.thisYear;
  const savingsPercent = ((savings / currentMonth.lastYear) * 100).toFixed(1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          {savings > 0 ? (
            <TrendingDown className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingUp className="h-5 w-5 text-red-500" />
          )}
          <div>
            <p className="text-2xl font-bold text-gray-800">
              ${savings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">
              {savingsPercent}% vs last year
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, '']} />
            <Line 
              type="monotone" 
              dataKey="thisYear" 
              stroke="#0057B8" 
              strokeWidth={2}
              name="This Year"
            />
            <Line 
              type="monotone" 
              dataKey="lastYear" 
              stroke="#94A3B8" 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Last Year"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};