"use client";

import { HOW_IT_WORKS_STEPS } from "./how-it-works/config";
import { HowItWorksHeader } from "./how-it-works/HowItWorksHeader";
import { HowItWorksStepCard } from "./how-it-works/HowItWorksStepCard";
import { HowItWorksDisclaimer } from "./how-it-works/HowItWorksDisclaimer";
import { HowItWorksCta } from "./how-it-works/HowItWorksCta";
import { useHowItWorksAuth } from "./how-it-works/useHowItWorksAuth";

export default function HowItWorks() {
  const { loading, handleStartClick } = useHowItWorksAuth();

  return (
    <section className="py-24 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <HowItWorksHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <HowItWorksStepCard
              key={index}
              step={step}
              index={index}
              steps={HOW_IT_WORKS_STEPS}
            />
          ))}
        </div>

        <HowItWorksDisclaimer />

        <HowItWorksCta loading={loading} onStartClick={handleStartClick} />
      </div>
    </section>
  );
}
