import { Home, BookOpen, Compass, LayoutDashboard, ListChecks } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface LeftSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "learning-path", label: "Learning Path", icon: BookOpen },
  { id: "exploration", label: "Exploration", icon: Compass },
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tracker", label: "Tracker", icon: ListChecks },
];

export function LeftSidebar({ currentPage, onNavigate }: LeftSidebarProps) {
  return (
    <aside className="fixed left-0 top-16 bottom-0 w-60 bg-[var(--color-neutral-50)] border-r border-[var(--color-neutral-200)] z-40">
      <nav className="p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                    isActive
                      ? "bg-[var(--primary)] text-white"
                      : "text-[var(--color-neutral-700)] hover:bg-[var(--color-neutral-100)]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
