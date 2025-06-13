/** @format */

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StrategyHeaderProps {
  isUserStrategy: boolean;
}

export const StrategyHeader = ({ isUserStrategy }: StrategyHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-5 flex items-center gap-4">
      <Button
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={16} />
        Back
      </Button>
      <h1 className="text-2xl font-bold">Your Strategy</h1>
    </div>
  );
};
