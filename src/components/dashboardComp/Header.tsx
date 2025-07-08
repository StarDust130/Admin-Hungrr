import React, { useState, useEffect, FC } from "react";
import axios from "axios";
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
import { Button } from "../ui/button";

interface HeaderProps {
  cafeId: number | string; // Use number or string based on your API
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: FC<HeaderProps> = ({ cafeId, setIsOpen, isOpen }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleStatus = async () => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cafe/toggle-status/${cafeId}`,
        { is_active: !isOpen }
      );
      setIsOpen(!isOpen);
    } catch (error) {
      console.error("Failed to toggle café status:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
      {/* Dashboard Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800 dark:text-white">
          ☕ Café Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">Live updates & orders</p>
      </div>

      {/* Clock & Button */}
      <div className="flex items-center space-x-4">
        {/* Time */}
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-gray-800 dark:text-gray-100">
            {time.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {time.toLocaleDateString([], {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Toggle Button */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className={`flex items-center cursor-pointer space-x-2 px-4 py-2 rounded-md text-sm font-medium border transition-all ${
                isOpen
                  ? "border-green-400 text-green-600 bg-green-100 hover:bg-green-200"
                  : "border-red-400 text-red-600 bg-red-100 hover:bg-red-200"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full animate-pulse ${
                  isOpen ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <span>{isOpen ? "Open 🍽️" : "Closed 💤"}</span>
            </Button>
          </AlertDialogTrigger>

          {/* Dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isOpen ? "Close the café? 🔒" : "Open the café? 🚀"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                {isOpen
                  ? "Your café will stop accepting new orders and become invisible to customers. Existing orders will still be processed."
                  : "Your café will start accepting new orders and show up to hungry customers. Make sure your menu is ready!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus}>
                {isOpen ? "Yes, close it 😴" : "Yes, open it 😎"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
