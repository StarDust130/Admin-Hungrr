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
import { useCafe } from "@/context/CafeContext";

interface HeaderProps {
  cafeId: number | string; // Use number or string based on your API
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Header: FC<HeaderProps> = ({ cafeId, setIsOpen, isOpen }) => {
  const [time, setTime] = useState(new Date());
  const { cafe } = useCafe();

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
          📈 {cafe?.name || "Café"} Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          View today&apos;s orders, performance, and real-time updates.
        </p>
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
              className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold border transition-all duration-300
        ${
          isOpen
            ? "border-green-400 bg-green-100 text-green-700 dark:bg-green-800/10 dark:text-green-300"
            : "border-red-400 bg-red-100 text-red-700 dark:bg-red-800/10 dark:text-red-300"
        }
        ${
          isOpen
            ? "hover:shadow-[0_0_10px_2px_rgba(34,197,94,0.3)] dark:hover:shadow-[0_0_10px_2px_rgba(74,222,128,0.2)]"
            : "hover:shadow-[0_0_10px_2px_rgba(239,68,68,0.3)] dark:hover:shadow-[0_0_10px_2px_rgba(248,113,113,0.2)]"
        }`}
            >
              {/* Pulse dot */}
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
                {isOpen
                  ? `Close ${cafe?.name || "the café"}? 🔒`
                  : `Open ${cafe?.name || "the café"}? 🚀`}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-muted-foreground mt-1">
                {isOpen
                  ? `${
                      cafe?.name || "The café"
                    } will stop accepting new orders and will be hidden from customers. Ongoing orders will still be served.`
                  : `${
                      cafe?.name || "The café"
                    } will go live and start accepting orders. Get ready to serve some smiles! 🍽️`}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleStatus}>
                {isOpen ? `Yes, close it 😴` : `Yes, open it 😎`}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};
