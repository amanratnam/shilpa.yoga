import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Section tone="dark" className="grid min-h-[70vh] place-items-center">
      <div className="flex flex-col items-center gap-8 text-center">
        <SectionHeading
          align="center"
          eyebrow="404"
          title="This page wandered off the mat"
          intro="The page you're looking for doesn't exist or has moved. Let's get you back to your practice."
        />
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button href="/" tone="dark">
            Back home
          </Button>
          <Button href="/classes" tone="dark" variant="secondary">
            See classes
          </Button>
        </div>
      </div>
    </Section>
  );
}
