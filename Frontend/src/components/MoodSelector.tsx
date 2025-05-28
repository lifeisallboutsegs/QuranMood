import { Badge } from "./ui/badge";
import {
  Heart,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Star,
  Shield,
  BookOpen,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../config";

const fallbackMoods = [
  { id: "peace", label: "Peace", icon: Heart },
  { id: "guidance", label: "Guidance", icon: Sparkles },
  { id: "hope", label: "Hope", icon: Sun },
  { id: "reflection", label: "Reflection", icon: Moon },
  { id: "comfort", label: "Comfort", icon: Cloud },
  { id: "wisdom", label: "Wisdom", icon: Star },
  { id: "protection", label: "Protection", icon: Shield },
  { id: "knowledge", label: "Knowledge", icon: BookOpen }
];

const moodIcons: Record<string, any> = {
  peace: Heart,
  guidance: Sparkles,
  hope: Sun,
  reflection: Moon,
  comfort: Cloud,
  wisdom: Star,
  protection: Shield,
  knowledge: BookOpen
};

interface MoodSelectorProps {
  selectedMood: string | null;
  onMoodSelect: (mood: string) => void;
}

export function MoodSelector({
  selectedMood,
  onMoodSelect
}: MoodSelectorProps) {
  const [moods, setMoods] = useState<
    Array<{ id: string; label: string; icon: any }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.verse.moods);
        if (!response.ok) throw new Error("Failed to fetch moods");

        const data = await response.json();
        const formattedMoods = data.moods.map((mood: string) => ({
          id: mood,
          label: mood.charAt(0).toUpperCase() + mood.slice(1),
          icon: moodIcons[mood] || Heart
        }));

        setMoods(formattedMoods);
      } catch (err) {
        console.error("Error fetching moods:", err);
        setError("Failed to load moods");
        setMoods(fallbackMoods);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoods();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive p-4">{error}</div>;
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center p-4">
      {moods.map((mood) => {
        const Icon = mood.icon;
        return (
          <Badge
            key={mood.id}
            variant={selectedMood === mood.id ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/80 transition-colors px-4 py-2 text-sm"
            onClick={() => onMoodSelect(mood.id)}
          >
            <Icon className="w-4 h-4 mr-2" />
            {mood.label}
          </Badge>
        );
      })}
    </div>
  );
}
