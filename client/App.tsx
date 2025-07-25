import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot, type Root } from "react-dom/client";

// Extend HTMLElement to include our custom property
declare global {
  interface HTMLElement {
    _reactRootContainer?: Root;
  }
}
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TestPage from "./pages/TestPage";
import ResultsPage from "./pages/ResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/test/:testId" element={<TestPage />} />
          <Route path="/results/:testId" element={<ResultsPage />} />
          <Route path="/results" element={<ResultsPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;

// Check if root already exists to prevent multiple createRoot calls
if (!container._reactRootContainer) {
  const root = createRoot(container);
  container._reactRootContainer = root;
  root.render(<App />);
} else {
  // Re-render on existing root
  container._reactRootContainer.render(<App />);
}
