"use client";

import { HOW_IT_WORKS_STEPS } from "./how-it-works/config";
import { HowItWorksHeader } from "./how-it-works/HowItWorksHeader";
import { HowItWorksStepCard } from "./how-it-works/HowItWorksStepCard";
import { HowItWorksDisclaimer } from "./how-it-works/HowItWorksDisclaimer";
import { HowItWorksCta } from "./how-it-works/HowItWorksCta";
import { useHowItWorksAuth } from "@/hooks/home/useHowItWorksAuth";
import { HomeSectionLayout } from "@/components/home/HomeSectionLayout";

export default function HowItWorks() {
  const { loading, handleStartClick } = useHowItWorksAuth();

  return (
    <section className="py-20 px-4" id="how-it-works">
      <div className="max-w-6xl mx-auto">
        <HowItWorksHeader />

        <HomeSectionLayout
          ariaLabel="Как это работает"
          gridClassName="md:grid-cols-2 lg:grid-cols-4"
          slideBasis="basis-[85%]"
        >
          {HOW_IT_WORKS_STEPS.map((step, index) => (
            <HowItWorksStepCard
              key={step.title}
              step={step}
              index={index}
              steps={HOW_IT_WORKS_STEPS}
            />
          ))}
        </HomeSectionLayout>

        <HowItWorksDisclaimer />

        <HowItWorksCta loading={loading} onStartClick={handleStartClick} />
      </div>
    </section>
  );
}
