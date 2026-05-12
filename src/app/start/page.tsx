import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function StartPage() {
  return (
    <main className="aura-gradient relative min-h-screen overflow-hidden">
      <div className="grain absolute inset-0 -z-10" aria-hidden />
      <OnboardingFlow />
    </main>
  );
}
