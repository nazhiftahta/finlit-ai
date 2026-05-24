import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import BottomNavigation from "./components/BottomNavigation";
import Home from "./pages/Home";
import RiskChecker from "./pages/RiskChecker";
import MoneyGuide from "./pages/MoneyGuide";
import Chatbot from "./pages/Chatbot";
import EducationalInsights from "./pages/EducationalInsights";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/risk-checker"} component={RiskChecker} />
        <Route path={"/money-guide"} component={MoneyGuide} />
        <Route path={"/chatbot"} component={Chatbot} />
        <Route path={"/educational-insights"} component={EducationalInsights} />

        <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
      <BottomNavigation />
    </>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
