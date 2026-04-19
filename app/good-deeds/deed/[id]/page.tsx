import { GoodDeedDeedClient } from "./_components/GoodDeedDeedClient";

export default async function GoodDeedDeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="relative min-h-screen">
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(249,188,96,0.14) 0%, transparent 55%),
            radial-gradient(ellipse 60% 40% at 85% 70%, rgba(171,209,198,0.08) 0%, transparent 45%),
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.03) 100%)
          `,
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(249,188,96,0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(249,188,96,0.2) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <GoodDeedDeedClient id={id} />
    </div>
  );
}
