/** @format */

"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface StrategyHeaderProps {
  isUserStrategy: boolean;
}

export const StrategyHeader = ({ isUserStrategy }: StrategyHeaderProps) => {
  const router = useRouter();

  return (
    <div className="mb-5 flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      <h1 className="text-2xl font-bold">Your Strategy</h1>
    </div>
  );
};
