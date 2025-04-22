
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface ExerciseTipsProps {
  description: string;
  tips: string[];
}

const ExerciseTips: React.FC<ExerciseTipsProps> = ({ description, tips }) => {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="notes" className="border-[#454545]">
        <AccordionTrigger className="text-sm text-gray-400 hover:text-white hover:no-underline py-2">
          Exercise Tips
        </AccordionTrigger>
        <AccordionContent>
          <div className="text-sm text-gray-300 mt-2">
            <p>{description}</p>
            {tips.length > 0 && (
              <ul className="list-disc pl-5 mt-2 space-y-1">
                {tips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ExerciseTips;
