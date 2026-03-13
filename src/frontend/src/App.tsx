import { BarChart3, Sigma, Users } from "lucide-react";
import { useState } from "react";
import AboutPage from "./pages/AboutPage";
import ToolsPage from "./pages/ToolsPage";

type Page = "tools" | "about";

export default function App() {
  const [page, setPage] = useState<Page>("tools");

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="frost-glass sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              type="button"
              onClick={() => setPage("tools")}
              className="flex items-center gap-2.5 group"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.55 0.18 350), oklch(0.45 0.20 335))",
                }}
              >
                <Sigma size={16} className="text-white" />
              </div>
              <div>
                <span className="font-display text-base font-bold text-foreground block leading-tight">
                  StatDist
                </span>
                <span className="font-sans text-[10px] text-muted-foreground leading-none">
                  Distribution Analysis Tool
                </span>
              </div>
            </button>

            {/* Nav links */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                data-ocid="nav.tools_link"
                onClick={() => setPage("tools")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                  page === "tools"
                    ? "bg-primary text-primary-foreground shadow-pink"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <BarChart3 size={14} />
                Tools
              </button>
              <button
                type="button"
                data-ocid="nav.about_link"
                onClick={() => setPage("about")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-sans text-sm font-medium transition-all ${
                  page === "about"
                    ? "bg-primary text-primary-foreground shadow-pink"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                <Users size={14} />
                About
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Page content */}
      <div className="flex-1">
        {page === "tools" ? <ToolsPage /> : <AboutPage />}
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/80 py-4">
        <div className="container mx-auto px-4 max-w-7xl">
          <p className="font-sans text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
