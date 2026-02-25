import { useState } from "react";
import { Card } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { Badge } from "@/app/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  ChevronDown,
  ExternalLink,
  FileText,
  GitBranch,
  Sparkles,
  Clock,
  Target,
  Video,
  MessageSquare,
  X
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface PlaybookSection {
  id: string;
  title: string;
  items: PlaybookItem[];
  expanded: boolean;
}

interface PlaybookItem {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
}

interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

interface ChecklistItem {
  id: string;
  title: string;
  status: "completed" | "in-progress" | "pending";
}

export function LearningPathPage() {
  const [expandedPlaybook, setExpandedPlaybook] = useState<string>("core");
  const [selectedItem, setSelectedItem] = useState<string | null>("repo-structure");
  const [chatOpen, setChatOpen] = useState(false);

  const playbookSections: PlaybookSection[] = [
    {
      id: "core",
      title: "CORE",
      expanded: true,
      items: [
        { id: "project-purpose", title: "Project Purpose", status: "completed" },
        { id: "system-architecture", title: "System Architecture", status: "completed" },
        { id: "service-responsibilities", title: "Service Responsibilities", status: "in-progress" },
        { id: "data-flow", title: "Data Flow & Patterns", status: "pending" },
      ],
    },
    {
      id: "advanced",
      title: "ADVANCED",
      expanded: false,
      items: [
        { id: "performance", title: "Performance Optimization", status: "pending" },
        { id: "monitoring", title: "Monitoring & Alerts", status: "pending" },
      ],
    },
    {
      id: "optional",
      title: "OPTIONAL",
      expanded: false,
      items: [
        { id: "testing", title: "Testing Strategies", status: "pending" },
        { id: "deployment", title: "Deployment Process", status: "pending" },
      ],
    },
  ];

  const checklistSections: ChecklistSection[] = [
    {
      id: "foundation",
      title: "FOUNDATION",
      items: [
        { id: "meet-team", title: "Meet the Team", status: "completed" },
        { id: "setup-env", title: "Setup Local Environment", status: "completed" },
      ],
    },
    {
      id: "code",
      title: "CODE",
      items: [
        { id: "repo-structure", title: "Understand Repo Structure", status: "in-progress" },
        { id: "api-patterns", title: "Learn API Patterns", status: "pending" },
        { id: "first-pr", title: "Submit First PR", status: "pending" },
      ],
    },
    {
      id: "business",
      title: "BUSINESS",
      items: [
        { id: "product-flow", title: "Product User Flow", status: "pending" },
        { id: "customer-impact", title: "Customer Impact", status: "pending" },
      ],
    },
    {
      id: "operations",
      title: "OPERATIONS",
      items: [
        { id: "on-call", title: "On-Call Procedures", status: "pending" },
        { id: "incident-response", title: "Incident Response", status: "pending" },
      ],
    },
  ];

  const totalItems = checklistSections.reduce((sum, section) => sum + section.items.length, 0);
  const completedItems = checklistSections.reduce(
    (sum, section) => sum + section.items.filter(item => item.status === "completed").length,
    0
  );
  const progressPercentage = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      {/* LEFT COLUMN - Role Playbook */}
      <div className="w-80 border-r border-[var(--color-neutral-200)] overflow-y-auto">
        <div className="p-6 border-b border-[var(--color-neutral-200)]">
          <h2 className="font-semibold text-[var(--color-neutral-900)]">Backend Developer Playbook</h2>
        </div>
        <div className="p-4">
          {playbookSections.map((section) => (
            <div key={section.id} className="mb-2">
              <button
                onClick={() => setExpandedPlaybook(expandedPlaybook === section.id ? "" : section.id)}
                className="w-full flex items-center justify-between p-2 hover:bg-[var(--color-neutral-50)] rounded-lg"
              >
                <span className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide">
                  {section.title}
                </span>
                {expandedPlaybook === section.id ? (
                  <ChevronDown className="w-4 h-4 text-[var(--color-neutral-500)]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-[var(--color-neutral-500)]" />
                )}
              </button>
              {expandedPlaybook === section.id && (
                <div className="mt-1 space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-2 p-2 pl-4 hover:bg-[var(--color-neutral-50)] rounded-lg"
                    >
                      {item.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] flex-shrink-0" />
                      ) : item.status === "in-progress" ? (
                        <Circle className="w-4 h-4 text-[var(--color-warning)] fill-[var(--color-warning)] flex-shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-[var(--color-neutral-300)] flex-shrink-0" />
                      )}
                      <span className="text-sm text-[var(--color-neutral-700)] text-left">{item.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CENTER COLUMN - Integration Checklist */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-[var(--color-neutral-200)] bg-white sticky top-0 z-10">
          <h2 className="font-semibold text-[var(--color-neutral-900)] mb-3">Project Integration Checklist</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[var(--color-neutral-600)]">Progress</span>
              <span className="font-semibold text-[var(--color-neutral-900)]">{progressPercentage}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {checklistSections.map((section) => (
            <div key={section.id}>
              <h3 className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide mb-3">
                {section.title}
              </h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.id}>
                    <button
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg border transition-all",
                        selectedItem === item.id
                          ? "bg-[var(--primary)]/5 border-[var(--primary)]"
                          : "bg-white border-[var(--color-neutral-200)] hover:border-[var(--color-neutral-300)]"
                      )}
                    >
                      {item.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] flex-shrink-0" />
                      ) : item.status === "in-progress" ? (
                        <Circle className="w-5 h-5 text-[var(--color-warning)] fill-[var(--color-warning)] flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-[var(--color-neutral-300)] flex-shrink-0" />
                      )}
                      <span className="text-sm font-medium text-[var(--color-neutral-900)] flex-1 text-left">
                        {item.title}
                      </span>
                      {selectedItem === item.id ? (
                        <ChevronDown className="w-4 h-4 text-[var(--color-neutral-500)]" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-[var(--color-neutral-500)]" />
                      )}
                    </button>

                    {/* Expanded Item Details */}
                    {selectedItem === item.id && item.id === "repo-structure" && (
                      <Card className="mt-2 p-4 bg-[var(--color-neutral-50)] border border-[var(--color-neutral-200)]">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Target className="w-4 h-4 text-[var(--primary)]" />
                              <h4 className="text-sm font-semibold text-[var(--color-neutral-900)]">Goal</h4>
                            </div>
                            <p className="text-sm text-[var(--color-neutral-700)] pl-6">
                              Understand the mono-repo structure, service boundaries, and how the payments-api 
                              integrates with other services.
                            </p>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
                              <h4 className="text-sm font-semibold text-[var(--color-neutral-900)]">Why This Matters</h4>
                            </div>
                            <p className="text-sm text-[var(--color-neutral-700)] pl-6">
                              As a backend developer, knowing where code lives and how services communicate 
                              helps you make changes confidently without breaking dependencies.
                            </p>
                          </div>

                          <div>
                            <h4 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-2">Resources</h4>
                            <div className="space-y-2">
                              <a
                                href="#"
                                className="flex items-center gap-2 p-2 bg-white rounded border border-[var(--color-neutral-200)] hover:border-[var(--color-info)] transition-colors"
                              >
                                <GitBranch className="w-4 h-4 text-[var(--color-info)]" />
                                <span className="text-sm text-[var(--color-info)] flex-1">payments-api repo</span>
                                <ExternalLink className="w-3 h-3 text-[var(--color-neutral-400)]" />
                              </a>
                              <a
                                href="#"
                                className="flex items-center gap-2 p-2 bg-white rounded border border-[var(--color-neutral-200)] hover:border-[var(--color-info)] transition-colors"
                              >
                                <FileText className="w-4 h-4 text-[var(--color-info)]" />
                                <span className="text-sm text-[var(--color-info)] flex-1">Architecture Documentation</span>
                                <ExternalLink className="w-3 h-3 text-[var(--color-neutral-400)]" />
                              </a>
                              <a
                                href="#"
                                className="flex items-center gap-2 p-2 bg-white rounded border border-[var(--color-neutral-200)] hover:border-[var(--color-info)] transition-colors"
                              >
                                <FileText className="w-4 h-4 text-[var(--color-info)]" />
                                <span className="text-sm text-[var(--color-info)] flex-1">Service Diagram</span>
                                <ExternalLink className="w-3 h-3 text-[var(--color-neutral-400)]" />
                              </a>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setChatOpen(true)}
                              className="flex-1 border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5"
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Ask Agent
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <GitBranch className="w-4 h-4 mr-2" />
                              Open Repo
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              <Video className="w-4 h-4 mr-2" />
                              Watch Video
                            </Button>
                          </div>

                          <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white">
                            Mark as Understood
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN - Context Panel */}
      <div className="w-80 border-l border-[var(--color-neutral-200)] overflow-y-auto bg-[var(--color-neutral-50)]">
        <div className="p-6">
          <h2 className="font-semibold text-[var(--color-neutral-900)] mb-4">Context</h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide">ROLE</label>
              <p className="text-sm text-[var(--color-neutral-900)] mt-1">Backend Developer</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide">PROJECT</label>
              <p className="text-sm text-[var(--color-neutral-900)] mt-1">Payments Platform</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-[var(--color-neutral-500)] tracking-wide">TEAM</label>
              <p className="text-sm text-[var(--color-neutral-900)] mt-1">Platform Services</p>
            </div>

            <div className="pt-4 border-t border-[var(--color-neutral-200)]">
              <h3 className="text-sm font-semibold text-[var(--color-neutral-900)] mb-3">Using Sources</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-[var(--color-neutral-200)]">
                  <GitBranch className="w-4 h-4 text-[var(--color-info)]" />
                  <span className="text-xs text-[var(--color-neutral-700)]">payments-api repo</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-[var(--color-neutral-200)]">
                  <FileText className="w-4 h-4 text-[var(--color-info)]" />
                  <span className="text-xs text-[var(--color-neutral-700)]">PAYMENTS Jira</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-white rounded border border-[var(--color-neutral-200)]">
                  <FileText className="w-4 h-4 text-[var(--color-info)]" />
                  <span className="text-xs text-[var(--color-neutral-700)]">Architecture docs</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Badge className="bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20">
                High Confidence
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Panel Overlay */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-8">
          <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-neutral-200)]">
              <h3 className="font-semibold text-[var(--color-neutral-900)]">Ask About: Understand Repo Structure</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChatOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="bg-[var(--color-neutral-50)] p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm text-[var(--color-neutral-900)]">
                      The payments-api follows a domain-driven design pattern. Here's the structure:
                    </p>
                    <ul className="text-sm text-[var(--color-neutral-700)] space-y-1 list-disc list-inside">
                      <li><code className="bg-white px-1 py-0.5 rounded text-xs">/src/api</code> - REST endpoints and controllers</li>
                      <li><code className="bg-white px-1 py-0.5 rounded text-xs">/src/services</code> - Business logic layer</li>
                      <li><code className="bg-white px-1 py-0.5 rounded text-xs">/src/models</code> - Database schemas</li>
                      <li><code className="bg-white px-1 py-0.5 rounded text-xs">/src/integrations</code> - External service connections</li>
                    </ul>
                    <div className="pt-3 border-t border-[var(--color-neutral-200)] mt-3">
                      <p className="text-xs font-semibold text-[var(--color-neutral-500)] mb-2">SOURCES</p>
                      <div className="flex flex-wrap gap-2">
                        <a href="#" className="text-xs text-[var(--color-info)] hover:underline">payments-api/README.md</a>
                        <span className="text-[var(--color-neutral-300)]">·</span>
                        <a href="#" className="text-xs text-[var(--color-info)] hover:underline">Architecture Docs</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--color-neutral-200)]">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask a follow-up question..."
                  className="flex-1 px-3 py-2 border border-[var(--color-neutral-300)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <Button className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white">
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
