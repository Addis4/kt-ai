import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import { User } from "lucide-react";

export function TopNav() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[var(--color-neutral-200)] z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
              <path d="M2 17L12 22L22 17M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[var(--color-neutral-900)] font-medium">Project Onboarding</span>
        </div>
        
        <Avatar className="w-9 h-9 border-2 border-[var(--color-neutral-200)]">
          <AvatarFallback className="bg-[var(--color-neutral-100)] text-[var(--color-neutral-700)]">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
