import "./globals.css";

export const metadata = {
  title: "KT.ai",
  description: "KT.ai - AI-powered Project Onboarding & Knowledge Transfer"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav>
          <strong>KT.ai</strong>
          <div className="nav-links">
            <a href="/">Home</a>
            <a href="/learning-path">Learning Path</a>
            <a href="/exploration">Exploration</a>
            <a href="/dashboard">Dashboard</a>
            <a href="/tracker">Tracker</a>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
