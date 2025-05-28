import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { UserProvider } from "./contexts/UserContext";
import { Layout } from "./components/layout/Layout";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="quran-mood-theme">
        <UserProvider>
          <Layout />
          <Toaster />
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
