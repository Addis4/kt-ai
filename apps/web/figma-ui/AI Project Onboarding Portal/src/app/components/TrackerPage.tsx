import { Card } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { 
  CheckCircle2, 
  Clock,
  AlertTriangle,
  ExternalLink
} from "lucide-react";

export function TrackerPage() {
  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Tracker</h1>
        <p className="text-sm text-[var(--color-neutral-600)]">
          Monitor access requests and setup issues
        </p>
      </div>

      {/* Access Requests */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Access Requests</h2>
        <Card className="border border-[var(--color-neutral-200)]">
          <div className="divide-y divide-[var(--color-neutral-200)]">
            {/* Jira Access - Completed */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--color-neutral-900)]">Jira Access</h3>
                      <Badge className="bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-neutral-600)] mb-3">
                      Access to PAYMENTS Jira project
                    </p>
                    <div className="space-y-2 text-xs text-[var(--color-neutral-600)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Requested:</span>
                        <span>January 8, 2026</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Approved by:</span>
                        <span>Sarah Chen (Team Lead)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Completed:</span>
                        <span>January 9, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
                <a 
                  href="#" 
                  className="text-[var(--color-info)] hover:text-[var(--color-info)]/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Repo Access - Completed */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--color-neutral-900)]">Repository Access</h3>
                      <Badge className="bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20">
                        Completed
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-neutral-600)] mb-3">
                      Read/write access to payments-api, payments-sdk, shared-utils
                    </p>
                    <div className="space-y-2 text-xs text-[var(--color-neutral-600)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Requested:</span>
                        <span>January 8, 2026</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Approved by:</span>
                        <span>DevOps Team</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Completed:</span>
                        <span>January 8, 2026</span>
                      </div>
                    </div>
                  </div>
                </div>
                <a 
                  href="#" 
                  className="text-[var(--color-info)] hover:text-[var(--color-info)]/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* IAM Role - Pending */}
            <div className="p-6 bg-[var(--color-warning)]/5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[var(--color-warning)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-[var(--color-neutral-900)]">IAM Role Access</h3>
                      <Badge className="bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20">
                        Pending Approval
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--color-neutral-600)] mb-3">
                      AWS IAM role for payments-production-developer
                    </p>
                    <div className="space-y-2 text-xs text-[var(--color-neutral-600)]">
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Requested:</span>
                        <span>January 10, 2026</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Pending with:</span>
                        <span className="font-medium">IT Security Team</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[var(--color-neutral-500)]">Expected:</span>
                        <span>January 22-23, 2026</span>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-[var(--color-neutral-50)] rounded border border-[var(--color-neutral-200)]">
                      <p className="text-xs text-[var(--color-neutral-700)]">
                        <span className="font-medium">Note:</span> Security review required for production access. 
                        Average approval time: 5-7 business days.
                      </p>
                    </div>
                  </div>
                </div>
                <a 
                  href="#" 
                  className="text-[var(--color-info)] hover:text-[var(--color-info)]/80"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Detected Issues */}
      <div>
        <h2 className="text-lg font-semibold text-[var(--color-neutral-900)] mb-4">Detected Issues</h2>
        <Card className="border border-[var(--color-neutral-200)]">
          <div className="divide-y divide-[var(--color-neutral-200)]">
            {/* Missing Staging Environment Access */}
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)]/10 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-[var(--color-neutral-900)]">Missing Staging Environment Access</h3>
                    <Badge className="bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20">
                      Needs Attention
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--color-neutral-600)] mb-3">
                    VPN access to staging environment not configured
                  </p>
                  <div className="space-y-2 text-xs text-[var(--color-neutral-600)]">
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-neutral-500)]">Detected:</span>
                      <span>January 15, 2026</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-neutral-500)]">Severity:</span>
                      <span>Medium - Limits testing capabilities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--color-neutral-500)]">Action required:</span>
                      <span>Contact IT Helpdesk to request VPN credentials</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-[var(--color-info)]/5 rounded border border-[var(--color-info)]/20">
                    <p className="text-xs text-[var(--color-neutral-700)] mb-2">
                      <span className="font-medium text-[var(--color-info)]">Recommendation:</span>
                    </p>
                    <ul className="text-xs text-[var(--color-neutral-700)] space-y-1 list-disc list-inside">
                      <li>Submit VPN access request through IT portal</li>
                      <li>Reference ticket: PAYMENTS-1234</li>
                      <li>Include "Staging Environment" in request title</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* All Clear Message */}
            <div className="p-6 bg-[var(--color-neutral-50)]">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-success)]/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-neutral-900)] mb-1">System Checks Passed</h3>
                  <p className="text-sm text-[var(--color-neutral-600)]">
                    All other access checks and configurations are properly set up
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Info Box */}
      <Card className="p-4 bg-[var(--color-info)]/5 border border-[var(--color-info)]/20">
        <div className="flex gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-[var(--color-info)]/10 flex items-center justify-center">
              <span className="text-[var(--color-info)] font-semibold text-sm">i</span>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-[var(--color-neutral-700)]">
              Access requests are automatically detected from your role and project assignment. 
              Issues are identified by analyzing your activity patterns and comparing them with expected access levels.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
