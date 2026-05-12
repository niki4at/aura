import { AppNav } from "@/components/app-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <AppNav />
      <main className="flex-1 pb-24 md:pb-12">{children}</main>
    </div>
  );
}
