import { FC } from "react";
import { Header } from "./Header";

export const DashboardLoadingSkeleton: FC = () => (
  <div className="mx-auto max-w-screen-2xl animate-pulse">
    <Header isOpen={false} setIsOpen={() => {}} />
    <main className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-gray-200 dark:bg-neutral-800 rounded-xl"
            ></div>
          ))}
        </div>
        <div className="h-24 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
          <div className="h-64 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
        </div>
        <div className="h-72 bg-gray-200 dark:bg-neutral-800 rounded-xl"></div>
      </div>
      <div className="h-[calc(100vh-10rem)] bg-gray-200 dark:bg-neutral-800 rounded-xl p-5">
        <div className="h-8 w-48 bg-gray-300 dark:bg-neutral-700 rounded mb-4"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-300 dark:bg-neutral-700 rounded-xl"
            ></div>
          ))}
        </div>
      </div>
    </main>
  </div>
);