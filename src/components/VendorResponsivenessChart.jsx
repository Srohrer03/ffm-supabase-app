import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SkeletonLoader } from "./SkeletonLoader";

const mockData = [
  { vendor: "HVAC Pro", responseTime: 2.5 },
  { vendor: "ElectriCorp", responseTime: 4.2 },
  { vendor: "PlumbFix", responseTime: 1.8 },
  { vendor: "SecureTech", responseTime: 3.1 },
  { vendor: "CleanCo", responseTime: 2.9 }
];

export const VendorResponsivenessChart = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SkeletonLoader height="h-48" />;
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="vendor" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => [`${value} hours`, 'Response Time']} />
          <Bar dataKey="responseTime" fill="#0057B8" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2 text-center">Average Response Time (Hours)</p>
    </div>
  );
};