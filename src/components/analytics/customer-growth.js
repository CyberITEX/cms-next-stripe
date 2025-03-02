'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Customer Growth component
 * @param {Object} props - Component props
 * @param {Array} props.data - Customer growth data
 */
export function CustomerGrowth({ data }) {
  const [timeframe, setTimeframe] = useState('monthly'); // weekly, monthly, yearly
  
  // Generate sample data if not provided
  const chartData = data || generateSampleData();
  
  // Placeholder function for generating sample data
  function generateSampleData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulativeTotal = 100; // Starting with some base
    
    return months.map(month => {
      const newCustomers = Math.floor(Math.random() * 30) + 5;
      cumulativeTotal += newCustomers;
      
      return {
        name: month,
        newCustomers,
        totalCustomers: cumulativeTotal
      };
    });
  }
  
  // Calculate growth metrics
  const totalNewCustomers = chartData.reduce((sum, item) => sum + item.newCustomers, 0);
  const averageMonthlyGrowth = (totalNewCustomers / chartData.length).toFixed(1);
  const currentTotal = chartData[chartData.length - 1]?.totalCustomers || 0;
  const growthRate = (
    (chartData[chartData.length - 1]?.newCustomers / 
    (chartData[chartData.length - 1]?.totalCustomers - chartData[chartData.length - 1]?.newCustomers)) * 100
  ).toFixed(1);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div>
            <CardTitle>Customer Growth</CardTitle>
            <CardDescription>
              Track your customer acquisition and growth
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
            <BarChart
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
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar 
                yAxisId="left"
                dataKey="newCustomers" 
                name="New Customers" 
                fill="#8884d8" 
                barSize={20}
              />
              <Bar 
                yAxisId="right"
                dataKey="totalCustomers" 
                name="Total Customers" 
                fill="#82ca9d" 
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Metrics summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Total Customers</p>
            <p className="text-2xl font-bold mt-2">
              {currentTotal}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">New this period</p>
            <p className="text-2xl font-bold mt-2">
              {totalNewCustomers}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Monthly Growth</p>
            <p className="text-2xl font-bold mt-2">
              {averageMonthlyGrowth}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-muted/50">
            <p className="text-sm font-medium text-muted-foreground">Growth Rate</p>
            <p className="text-2xl font-bold mt-2 text-success">
              +{growthRate}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}