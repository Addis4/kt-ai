import { Card } from "@/app/components/ui/card";
import { Progress } from "@/app/components/ui/progress";
import { 
  TrendingUp, 
  FileText, 
  GitBranch,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Clock
} from "lucide-react";

export function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Dashboard</h1>

      {/* Progress Overview */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6 border border-[var(--color-neutral-200)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Onboarding Progress</p>
              <p className="text-3xl font-semibold text-[var(--color-neutral-900)]">60%</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
            </div>
          </div>
          <Progress value={60} className="h-2 mb-2" />
          <p className="text-xs text-[var(--color-neutral-500)]">7 of 12 tasks completed</p>
        </Card>

        <Card className="p-6 border border-[var(--color-neutral-200)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Active Days</p>
              <p className="text-3xl font-semibold text-[var(--color-neutral-900)]">12</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[var(--color-info)]/10 flex items-center justify-center">
              <Clock className="w-6 h-6 text-[var(--color-info)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--color-neutral-500)]">Since January 9, 2026</p>
        </Card>

        <Card className="p-6 border border-[var(--color-neutral-200)]">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm text-[var(--color-neutral-600)] mb-1">Questions Asked</p>
              <p className="text-3xl font-semibold text-[var(--color-neutral-900)]">24</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-[var(--color-success)]" />
            </div>
          </div>
          <p className="text-xs text-[var(--color-neutral-500)]">Across all sources</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-[var(--color-neutral-200)]">
        <div className="p-6 border-b border-[var(--color-neutral-200)]">
          <h2 className="font-semibold text-[var(--color-neutral-900)]">Recent Activity</h2>
        </div>
        <div className="divide-y divide-[var(--color-neutral-200)]">
          <div className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-info)]/10 flex items-center justify-center flex-shrink-0">
              <GitBranch className="w-5 h-5 text-[var(--color-info)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-neutral-900)] mb-1">
                Explored payments-api repository
              </p>
              <p className="text-xs text-[var(--color-neutral-600)]">Reviewed service structure and API patterns</p>
              <p className="text-xs text-[var(--color-neutral-500)] mt-2">2 hours ago</p>
            </div>
          </div>

          <div className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-neutral-900)] mb-1">
                Asked about retry logic in payment processor
              </p>
              <p className="text-xs text-[var(--color-neutral-600)]">Got detailed explanation with code references</p>
              <p className="text-xs text-[var(--color-neutral-500)] mt-2">5 hours ago</p>
            </div>
          </div>

          <div className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-neutral-900)] mb-1">
                Completed "Setup Local Environment"
              </p>
              <p className="text-xs text-[var(--color-neutral-600)]">Development environment ready</p>
              <p className="text-xs text-[var(--color-neutral-500)] mt-2">Yesterday</p>
            </div>
          </div>

          <div className="p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-[var(--color-neutral-900)] mb-1">
                Completed "Meet the Team"
              </p>
              <p className="text-xs text-[var(--color-neutral-600)]">Met with 6 team members</p>
              <p className="text-xs text-[var(--color-neutral-500)] mt-2">2 days ago</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Health Indicators */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="border border-[var(--color-neutral-200)]">
          <div className="p-6 border-b border-[var(--color-neutral-200)]">
            <h2 className="font-semibold text-[var(--color-neutral-900)]">Documentation Freshness</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--color-success)]" />
                <span className="text-sm text-[var(--color-neutral-700)]">Architecture Docs</span>
              </div>
              <span className="text-xs font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-1 rounded">
                Updated 2d ago
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--color-success)]" />
                <span className="text-sm text-[var(--color-neutral-700)]">API Documentation</span>
              </div>
              <span className="text-xs font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-1 rounded">
                Updated 5d ago
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--color-warning)]" />
                <span className="text-sm text-[var(--color-neutral-700)]">Deployment Guide</span>
              </div>
              <span className="text-xs font-medium text-[var(--color-warning)] bg-[var(--color-warning)]/10 px-2 py-1 rounded">
                Updated 45d ago
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-[var(--color-success)]" />
                <span className="text-sm text-[var(--color-neutral-700)]">README</span>
              </div>
              <span className="text-xs font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-1 rounded">
                Updated 1w ago
              </span>
            </div>
          </div>
        </Card>

        <Card className="border border-[var(--color-neutral-200)]">
          <div className="p-6 border-b border-[var(--color-neutral-200)]">
            <h2 className="font-semibold text-[var(--color-neutral-900)]">Access Status</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-3 bg-[var(--color-success)]/5 rounded-lg border border-[var(--color-success)]/20">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-900)]">Repository Access</p>
                <p className="text-xs text-[var(--color-neutral-600)] mt-0.5">All repositories accessible</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[var(--color-success)]/5 rounded-lg border border-[var(--color-success)]/20">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-900)]">Jira Access</p>
                <p className="text-xs text-[var(--color-neutral-600)] mt-0.5">PAYMENTS project configured</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[var(--color-warning)]/5 rounded-lg border border-[var(--color-warning)]/20">
              <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-900)]">IAM Role Pending</p>
                <p className="text-xs text-[var(--color-neutral-600)] mt-0.5">Awaiting approval from IT</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[var(--color-success)]/5 rounded-lg border border-[var(--color-success)]/20">
              <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--color-neutral-900)]">Documentation Access</p>
                <p className="text-xs text-[var(--color-neutral-600)] mt-0.5">Full access granted</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
