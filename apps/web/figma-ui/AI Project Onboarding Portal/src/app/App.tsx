import { useState } from "react";
import { TopNav } from "@/app/components/TopNav";
import { LeftSidebar } from "@/app/components/LeftSidebar";
import { HomePage } from "@/app/components/HomePage";
import { LearningPathPage } from "@/app/components/LearningPathPage";
import { ExplorationPage } from "@/app/components/ExplorationPage";
import { DashboardPage } from "@/app/components/DashboardPage";
import { TrackerPage } from "@/app/components/TrackerPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "learning-path":
        return <LearningPathPage />;
      case "exploration":
        return <ExplorationPage />;
      case "dashboard":
        return <DashboardPage />;
      case "tracker":
        return <TrackerPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <TopNav />
      <LeftSidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main className="ml-60 mt-16 bg-[var(--color-neutral-50)] min-h-[calc(100vh-64px)]">
        {renderPage()}
      </main>
    </div>
  );
}
