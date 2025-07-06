import { ServerCrash } from "lucide-react";
import { FC } from "react";

export const ErrorDisplay: FC<{ message: string }> = ({ message }) => (
  <div className="flex flex-col items-center justify-center h-[80vh] text-center text-red-500">
    <ServerCrash size={64} className="mb-4" />
    <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong.</h2>
    <p>{message}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);