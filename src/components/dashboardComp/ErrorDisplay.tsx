import { ServerCrash } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";

export const ErrorDisplay: FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center justify-center h-[80vh]  p-4">
    <div className="flex flex-col items-center justify-center p-8 rounded-xl shadow-lg max-w-md w-full text-center">
      <ServerCrash size={64} className="mb-4 text-red-500" />
      <h2 className="text-3xl font-semibold text-slate-800 mb-2">
        Oops! Something went wrong.
      </h2>
      <p className="text-slate-600">{message}</p>
      <Button
        onClick={() => window.location.reload()}
        variant={"destructive"}
      >
        Refresh Page
      </Button>
    </div>
  </div>
);