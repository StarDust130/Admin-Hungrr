"use client";

import Image from "next/image";

interface ComingSoonProps {
  pageName: string;
  description: string;
}

export const ComingSoon: React.FC<ComingSoonProps> = ({
  pageName,
  description,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="max-w-md w-full space-y-5">
        <Image
          src="/coming-soon.png"
          alt="Coming Soon"
          width={260}
          height={260}
          className="mx-auto mb-3"
        />

        <h1 className="text-2xl font-semibold tracking-tight leading-snug">
          🚧 {pageName} is almost ready!
        </h1>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>

        <div className="inline-block rounded-md px-4 py-1 text-sm border border-muted text-muted-foreground">
          We’re putting the final touches on it 🛠️✨
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Thanks for your patience — it’s going to be worth the wait! 🚀
        </p>
      </div>
    </div>
  );
};
