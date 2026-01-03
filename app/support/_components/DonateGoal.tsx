"use client";

export default function DonateGoal({ className = "" }: { className?: string }) {
  return (
    <div className={["donate-goal", className].filter(Boolean).join(" ")}>
      <iframe
        className="donate-goal__iframe"
        src="https://www.donationalerts.com/widget/goal/9297870?token=l6qLr18VbbZIB1dHD34c"
        title="DonationAlerts — цель сбора"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      />
    </div>
  );
}


