import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { 
  GitBranch, 
  FileText, 
  ChevronDown,
  Sparkles,
  Send,
  ExternalLink
} from "lucide-react";

export function ExplorationPage() {
  const [selectedRepo, setSelectedRepo] = useState("payments-api");
  const [selectedJira, setSelectedJira] = useState("PAYMENTS");
  const [selectedDocs, setSelectedDocs] = useState("architecture");
  const [message, setMessage] = useState("");

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-6">
      {/* Context Selectors */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-[var(--color-neutral-900)]">Exploration</h1>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide mb-2 block">
              REPOSITORY
            </label>
            <button className="w-full flex items-center justify-between p-3 bg-white border border-[var(--color-neutral-300)] rounded-lg hover:border-[var(--primary)] transition-colors">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[var(--color-info)]" />
                <span className="text-sm text-[var(--color-neutral-900)]">{selectedRepo}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-neutral-500)]" />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide mb-2 block">
              JIRA PROJECT
            </label>
            <button className="w-full flex items-center justify-between p-3 bg-white border border-[var(--color-neutral-300)] rounded-lg hover:border-[var(--primary)] transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-info)]" />
                <span className="text-sm text-[var(--color-neutral-900)]">{selectedJira}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-neutral-500)]" />
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide mb-2 block">
              DOCUMENTATION
            </label>
            <button className="w-full flex items-center justify-between p-3 bg-white border border-[var(--color-neutral-300)] rounded-lg hover:border-[var(--primary)] transition-colors">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[var(--color-info)]" />
                <span className="text-sm text-[var(--color-neutral-900)]">{selectedDocs}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-[var(--color-neutral-500)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="border border-[var(--color-neutral-200)] min-h-[500px] flex flex-col">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          {/* Welcome Message */}
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <h3 className="font-semibold text-[var(--color-neutral-900)] mb-2">
              Ask anything about the selected context
            </h3>
            <p className="text-sm text-[var(--color-neutral-600)] max-w-md mx-auto">
              I can help you understand code patterns, explain architecture decisions, or find specific implementations.
            </p>
          </div>

          {/* Example Question */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="flex justify-end">
              <div className="bg-[var(--primary)] text-white px-4 py-2.5 rounded-lg max-w-md">
                <p className="text-sm">How does the retry logic work in the payment processor?</p>
              </div>
            </div>

            <div className="flex justify-start">
              <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg max-w-2xl border border-[var(--color-neutral-200)]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <p className="text-sm text-[var(--color-neutral-900)]">
                      The payment processor implements an exponential backoff retry strategy with the following behavior:
                    </p>
                    
                    <div className="bg-white p-3 rounded border border-[var(--color-neutral-200)]">
                      <code className="text-xs text-[var(--color-neutral-800)] font-mono">
                        <div>max_retries: 3</div>
                        <div>base_delay: 1000ms</div>
                        <div>multiplier: 2</div>
                        <div>max_delay: 10000ms</div>
                      </code>
                    </div>

                    <ul className="text-sm text-[var(--color-neutral-700)] space-y-1.5 list-disc list-inside">
                      <li>First retry after 1 second</li>
                      <li>Second retry after 2 seconds</li>
                      <li>Third retry after 4 seconds</li>
                      <li>Failed transactions are logged and sent to the dead letter queue</li>
                    </ul>

                    <p className="text-sm text-[var(--color-neutral-700)]">
                      The retry logic is configurable per payment provider and handles both network failures 
                      and provider-specific error codes.
                    </p>

                    <div className="pt-3 border-t border-[var(--color-neutral-200)]">
                      <p className="text-xs font-semibold text-[var(--color-neutral-500)] mb-2">SOURCES</p>
                      <div className="space-y-2">
                        <a 
                          href="#" 
                          className="flex items-center gap-2 text-xs text-[var(--color-info)] hover:underline"
                        >
                          <GitBranch className="w-3 h-3" />
                          payments-api/src/services/payment-processor.ts:124-156
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <a 
                          href="#" 
                          className="flex items-center gap-2 text-xs text-[var(--color-info)] hover:underline"
                        >
                          <FileText className="w-3 h-3" />
                          Architecture Docs: Error Handling & Retries
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-[var(--color-neutral-200)]">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything about payments-api, PAYMENTS Jira, or architecture docs..."
              className="flex-1 px-4 py-3 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
            />
            <Button className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white px-6">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
