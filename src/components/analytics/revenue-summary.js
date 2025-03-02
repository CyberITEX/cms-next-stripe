'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * Revenue Summary component
 * @param {Object} props - Component props
 * @param {Object} props.data - Revenue data
 */
export function RevenueSummary({ data }) {
  // Fallback data if none provided
  const revenueData = data || {
    totalRevenue: 0,
    previousRevenue: 0,
    transactionFees: 0,
    previousFees: 0,
    netRevenue: 0,
    previousNet: 0
  };
  
  // Calculate percentage changes
  const revenueChange = calculatePercentageChange(
    revenueData.totalRevenue, 
    revenueData.previousRevenue
  );
  
  const feesChange = calculatePercentageChange(
    revenueData.transactionFees, 
    revenueData.previousFees
  );
  
  const netChange = calculatePercentageChange(
    revenueData.netRevenue, 
    revenueData.previousNet
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue Summary</CardTitle>
        <CardDescription>
          Financial overview of your digital store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Total Revenue */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(revenueData.totalRevenue)}
              </p>
            </div>
            <PercentageChange value={revenueChange} />
          </div>
          
          {/* Transaction Fees */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Transaction Fees (5%)</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(revenueData.transactionFees)}
              </p>
            </div>
            <PercentageChange value={feesChange} />
          </div>
          
          {/* Net Revenue */}
          <div className="flex items-center justify-between pb-4 border-t pt-4">
            <div>
              <p className="text-sm font-medium">Net Revenue</p>
              <p className="text-2xl font-bold mt-1">
                {formatCurrency(revenueData.netRevenue)}
              </p>
            </div>
            <PercentageChange value={netChange} />
          </div>
        </div>
        
        {/* Additional insights */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Insights</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-0.5">
                <TrendingUp className="h-3 w-3 text-primary" />
              </span>
              <span>
                Your net revenue has {netChange >= 0 ? 'increased' : 'decreased'} by 
                <span className={netChange >= 0 ? 'text-success font-medium' : 'text-destructive font-medium'}>
                  {' '}{Math.abs(netChange)}%{' '}
                </span>
                compared to last period.
              </span>
            </li>
            <li className="flex items-start">
              <span className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center mr-2 mt-0.5">
                <TrendingUp className="h-3 w-3 text-primary" />
              </span>
              <span>
                Transaction fees represent {((revenueData.transactionFees / revenueData.totalRevenue) * 100).toFixed(1)}% of your total revenue.
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Helper component to display percentage changes
 */
function PercentageChange({ value }) {
  if (value === 0) {
    return <div className="text-sm text-muted-foreground">0.0%</div>;
  }
  
  const isPositive = value > 0;
  
  return (
    <div className={`flex items-center ${isPositive ? 'text-success' : 'text-destructive'}`}>
      {isPositive ? (
        <TrendingUp className="h-4 w-4 mr-1" />
      ) : (
        <TrendingDown className="h-4 w-4 mr-1" />
      )}
      <span className="text-sm font-medium">{isPositive ? '+' : ''}{value}%</span>
    </div>
  );
}

/**
 * Calculate percentage change between two values
 * @param {number} current - Current value
 * @param {number} previous - Previous value
 * @returns {number} - Percentage change
 */
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  
  const change = ((current - previous) / previous) * 100;
  return parseFloat(change.toFixed(1));
}