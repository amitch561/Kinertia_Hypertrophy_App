
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SquareSplitVertical, SquareSplitHorizontal, Square, SquarePlus } from "lucide-react";

type SplitType = "push_pull_legs" | "upper_lower" | "full_body" | "custom";

interface SplitCard {
  type: SplitType;
  icon: React.ReactNode;
  title: string;
  description: string;
  recommendation: string;
  focusGroups: { title: string; muscles: string }[];
}

interface SplitTypeCardsProps {
  splitType: SplitType;
  onSplitTypeChange: (type: SplitType) => void;
}

const splitCards: SplitCard[] = [
  {
    type: "push_pull_legs",
    icon: <SquareSplitVertical className="h-6 w-6" />,
    title: "Push/Pull/Legs (PPL)",
    description: "Separates pushing, pulling, and leg muscles across 3-day rotations.",
    recommendation: "Ideal for intermediate to advanced lifters training 3–6 days/week.",
    focusGroups: [
      { title: "Push", muscles: "Chest, Shoulders, Triceps" },
      { title: "Pull", muscles: "Back, Biceps" },
      { title: "Legs", muscles: "Quads, Hamstrings, Glutes, Calves" }
    ]
  },
  {
    type: "upper_lower",
    icon: <SquareSplitHorizontal className="h-6 w-6" />,
    title: "Upper/Lower",
    description: "Alternates between upper and lower body days.",
    recommendation: "Simple and effective for training 3–4 days/week.",
    focusGroups: [
      { title: "Upper", muscles: "Chest, Back, Shoulders, Arms" },
      { title: "Lower", muscles: "Quads, Hamstrings, Glutes, Calves" }
    ]
  },
  {
    type: "full_body",
    icon: <Square className="h-6 w-6" />,
    title: "Full Body",
    description: "Each session targets all major muscle groups.",
    recommendation: "Best for beginners or users with limited training days (2–3/week).",
    focusGroups: [
      { title: "Every Session", muscles: "Total-body training" }
    ]
  },
  {
    type: "custom",
    icon: <SquarePlus className="h-6 w-6" />,
    title: "Custom",
    description: "Create your own split by assigning muscle groups to each day.",
    recommendation: "Ideal for advanced or experienced users who want full control.",
    focusGroups: []
  }
];

const SplitTypeCards: React.FC<SplitTypeCardsProps> = ({ splitType, onSplitTypeChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {splitCards.map((card) => (
      <Card
        key={card.type}
        className={`cursor-pointer transition-all duration-200 ${
          splitType === card.type
            ? "bg-[#E65A00] border-[#FF7A22]"
            : "bg-[#2F2F2F] border-[#454545] hover:border-[#E65A00]"
        }`}
        onClick={() => onSplitTypeChange(card.type)}
      >
        <CardHeader>
          <div className="flex items-center gap-2">
            {card.icon}
            <CardTitle className="text-lg">{card.title}</CardTitle>
          </div>
          <CardDescription className={`${
            splitType === card.type ? "text-gray-200" : "text-gray-400"
          }`}>
            {card.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className={`text-sm mb-3 ${
            splitType === card.type ? "text-gray-200" : "text-gray-400"
          }`}>
            {card.recommendation}
          </p>
          {card.focusGroups.length > 0 && (
            <div className="space-y-2">
              {card.focusGroups.map((group, idx) => (
                <div key={idx} className="text-sm">
                  <span className="font-semibold">{group.title}:</span>{" "}
                  <span className={
                    splitType === card.type ? "text-gray-200" : "text-gray-400"
                  }>{group.muscles}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default SplitTypeCards;
