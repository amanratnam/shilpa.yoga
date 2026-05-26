import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import type { Stat } from "@/content/home";

export function StatStrip({ stats }: { stats: Stat[] }) {
  return (
    <Section tone="light">
      <Reveal>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-2 border-l border-brand-green/20 pl-5">
              <dt className="text-h2 font-semibold leading-none text-brand-green">
                {stat.value}
              </dt>
              <dd className="text-small text-brand-stone">{stat.label}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
