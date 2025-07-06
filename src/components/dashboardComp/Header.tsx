"use client";
import React, { useState, useEffect, FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HeaderProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Header: FC<HeaderProps> = ({ isOpen, setIsOpen }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
      <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
        Today's Dashboard
      </h1>
      <div className="flex items-center space-x-4">
        <div className="text-right">
          <p className="font-mono font-semibold text-lg text-gray-700 dark:text-gray-200">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {time.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 border ${
                isOpen
                  ? "border-emerald-500/50 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20"
                  : "border-red-500/50 text-red-600 bg-red-500/10 hover:bg-red-500/20"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                  isOpen ? "bg-emerald-500" : "bg-red-500"
                }`}
              ></span>
              <span>{isOpen ? "Cafe Open" : "Cafe Closed"}</span>
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {isOpen ? "CLOSE" : "OPEN"} the cafe?
                This will affect live orders and your public menu.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => setIsOpen(!isOpen)}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
