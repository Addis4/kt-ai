import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { GraduationCap, Search, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export function HomePage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      {/* Greeting Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-[var(--color-neutral-900)]">Welcome back, Nikunj</h1>
        <p className="text-[var(--color-neutral-600)]">Backend Developer · Payments Platform</p>
      </div>

      {/* Primary Action Cards */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 border border-[var(--color-neutral-200)] rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-[var(--primary)]" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-1">Continue Learning Path</h3>
                <p className="text-sm text-[var(--color-neutral-600)]">Step 3 of 7 – Architecture & APIs</p>
              </div>
              <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white">
                Continue Learning
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-6 border border-[var(--color-neutral-200)] rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-[var(--color-info)]/10 flex items-center justify-center flex-shrink-0">
              <Search className="w-6 h-6 text-[var(--color-info)]" />
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold text-[var(--color-neutral-900)] mb-1">Explore Project Knowledge</h3>
                <p className="text-sm text-[var(--color-neutral-600)]">Repos · Jira · Docs</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full border-[var(--color-neutral-300)] hover:bg-[var(--color-neutral-50)]"
              >
                Start Exploring
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Tracker Snapshot */}
      <Card className="p-6 border border-[var(--color-neutral-200)] rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--color-neutral-900)]">Access & Setup Status</h3>
          <a 
            href="#" 
            className="text-sm text-[var(--color-info)] hover:underline font-medium"
          >
            View Tracker →
          </a>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-[var(--color-warning)]/5 rounded-lg border border-[var(--color-warning)]/20">
            <AlertCircle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-neutral-900)]">1 Access Pending</p>
              <p className="text-xs text-[var(--color-neutral-600)]">IAM Role awaiting approval</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-[var(--color-success)]/5 rounded-lg border border-[var(--color-success)]/20">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-neutral-900)]">All repos accessible</p>
              <p className="text-xs text-[var(--color-neutral-600)]">Code access configured</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
