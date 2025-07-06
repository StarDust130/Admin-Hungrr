import { BrainCircuit } from "lucide-react";
import { useEffect, useState } from "react";

export const AiSuggestions: FC<{ cafeId: string | null }> = ({ cafeId }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!cafeId) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/summary/ai/${cafeId}`)
      .then((res) => res.json())
      .then((data) =>
        setInsight(data.aiInsight || "No insights available at the moment.")
      )
      .catch(() => setInsight("Could not fetch AI insights."))
      .finally(() => setLoading(false));
  }, [cafeId]);

  return (
    <div className="border border-purple-500/20 dark:border-purple-400/20 bg-gradient-to-br from-purple-50/50 to-white dark:from-neutral-900 dark:to-purple-900/20 rounded-xl p-6 overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <BrainCircuit className="h-7 w-7 text-purple-500 dark:text-purple-400 mr-3" />
          <h3 className="font-semibold text-lg text-purple-600 dark:text-purple-400">
            Hungrr AI - Insights
          </h3>
        </div>
        <div className="font-mono text-sm space-y-2 text-gray-700 dark:text-gray-300">
          {loading ? (
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 dark:bg-neutral-700 rounded w-1/2"></div>
            </div>
          ) : (
            <p>{insight}</p>
          )}
        </div>
      </div>
    </div>
  );
};
