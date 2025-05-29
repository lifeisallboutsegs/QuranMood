import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { ModeToggle } from "../mode-toggle";
import { Menu, X, Home, BookOpen, Info, ChevronRight, Plus, LogIn } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "../ui/sheet";
import { cn } from "../../lib/utils";
import { useUser } from "../../contexts/UserContext";
import { LoginDialog } from "../LoginDialog";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "All Verses", path: "/all-verses", icon: BookOpen },
  ];

  if (user) {
    navItems.push({ name: "Add Verse", path: "/verse/create", icon: Plus });
  }

  navItems.push({ name: "About", path: "/about", icon: Info });

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/quran.svg" alt="QuranMood Logo" className="h-8 w-8" />
            <span className="text-xl font-bold">QuranMood</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "text-sm font-medium transition-colors flex items-center space-x-1 px-3 py-2 rounded-md",
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : "hover:text-primary hover:bg-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            {!user && (
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                onClick={() => setIsLoginOpen(true)}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
            )}
            <ModeToggle />
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-4">
            <ModeToggle />
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] p-0">
                <SheetHeader className="px-6 py-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center justify-between px-6 py-3 transition-colors",
                        location.pathname === item.path
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </Link>
                  ))}
                  {!user && (
                    <button
                      onClick={() => {
                        setIsOpen(false);
                        setIsLoginOpen(true);
                      }}
                      className="flex items-center justify-between px-6 py-3 transition-colors hover:bg-accent/50 w-full"
                    >
                      <div className="flex items-center space-x-3">
                        <LogIn className="h-5 w-5" />
                        <span className="font-medium">Login</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <LoginDialog isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </nav>
  );
} 