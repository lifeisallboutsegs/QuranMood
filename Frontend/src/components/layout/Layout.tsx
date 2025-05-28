import { Routes, Route } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AllVerses } from "../../pages/AllVerses";
import { Home } from "../../pages/Home";
import { About } from "../../pages/About";
import { Privacy } from "../../pages/Privacy";
import { Terms } from "../../pages/Terms";
import { Contact } from "../../pages/Contact";
import { VersePage } from "../../pages/VersePage";
import { VerseFormPage } from "../../pages/VerseFormPage";

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/verse/:id" element={<VersePage />} />
          <Route path="/verse/create" element={<VerseFormPage />} />
          <Route path="/verse/edit/:id" element={<VerseFormPage />} />
          <Route path="/all-verses" element={<AllVerses />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
} 