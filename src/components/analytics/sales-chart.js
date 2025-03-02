'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

/**
 * Sales Chart component
 * @param {Object} props - Component props
 * @param {Array} props.data - Sales data
 */
export function SalesChart({ data }) {
  const [timeframe, setTimeframe] = useState('monthly'); // weekly, monthly, yearly

  const formatData = () => {
    if (!data || data.length === 0) return [];
    
    // For demo purposes, we'll generate sample data if real data not provided
    if (data.length < 5) {
      // Generate sample data
      return generateSampleData();
    }
    
    return data;
  };

  const generateSampleData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const currentMonth = now.getMonth();
    
    return months.slice(0, currentMonth + 1).map((month, index) => ({
      name: month,
      sales: Math.floor(Math.random() * 5000) + 1000,
      subscriptions: Math.floor(Math.random() * 3000) + 500,
    }));
  };

  const chartData = formatData();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>
              Track your one-time and subscription sales
            </CardDescription>
          </div>
          <div className="mt-4 sm:mt-0">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                onClick={() => setTimeframe('weekly')}
                className={`px-3 py-1.5 text-xs font-medium rounded-l-md ${
                  timeframe === 'weekly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Weekly
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('monthly')}
                className={`px-3 py-1.5 text-xs font-medium ${
                  timeframe === 'monthly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('yearly')}
                className={`px-3 py-1.5 text-xs font-medium rounded-r-md ${
                  timeframe === 'yearly' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value).split('.')[0]} 
              />
              <Tooltip 
                formatter={(value) => formatCurrency(value)} 
                labelFormatter={(label) => `${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sales"
                name="One-time Sales"
                stroke="#8884d8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line
                type="monotone"
                dataKey="subscriptions"
                name="Subscription Revenue"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 mt-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(chartData.reduce((acc, item) => acc + (item.sales || 0), 0))}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Subscription Revenue</p>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(chartData.reduce((acc, item) => acc + (item.subscriptions || 0), 0))}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Growth</p>
            <p className="text-2xl font-bold mt-2 text-success">+12.5%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}