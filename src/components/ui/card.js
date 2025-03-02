import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Card component
 * @param {Object} props - Card props
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Card content
 * @param {React.HTMLAttributes} props.props - Other card props
 */
export function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card header component
 * @param {Object} props - Card header props
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Card header content
 * @param {React.HTMLAttributes} props.props - Other card header props
 */
export function CardHeader({ className, children, ...props }) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card title component
 * @param {Object} props - Card title props
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Card title content
 * @param {React.HTMLAttributes} props.props - Other card title props
 */
export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        "text-2xl font-semibold leading-none tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

/**
 * Card description component
 * @param {Object} props - Card description props
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Card description content
 * @param {React.HTMLAttributes} props.props - Other card description props
 */
export function CardDescription({ className, children, ...props }) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </p>
  );
}

/**
 * Card content component
 * @param {Object} props - Card content props
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Card content content
 * @param {React.HTMLAttributes} props.props - Other card content props
 */
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("p-6 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

/**
 * Card footer component
 * @param {Object} props - Card footer props
 * @param {string} [props.className] - Additional classes
 * @param {React.ReactNode} props.children - Card footer content
 * @param {React.HTMLAttributes} props.props - Other card footer props
 */
export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    >
      {children}
    </div>
  );
}