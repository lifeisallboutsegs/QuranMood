import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import {
  Heart,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Star,
  Shield,
  BookOpenCheck,
  Lightbulb,
  Leaf,
  Droplets,
  Mountain,
  Waves,
  Wind,
  Flame,
  Snowflake,
  Flower,
  Music,
  Palette,
  BookOpenText,
  Compass,
  Target,
  Zap,
  Smile,
  Sunrise,
  Sunset,
  MoonStar,
  Rainbow,
  TreePine,
  Trees,
  MountainSnow,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  CloudHail,
  CloudSunRain,
  CloudMoonRain
} from "lucide-react";


const colorSets = [
  "bg-green-500/10 text-green-500 hover:bg-green-500/20",
  "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20",
  "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
  "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
  "bg-sky-500/10 text-sky-500 hover:bg-sky-500/20",
  "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20",
  "bg-red-500/10 text-red-500 hover:bg-red-500/20",
  "bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500/20",
  "bg-pink-500/10 text-pink-500 hover:bg-pink-500/20",
  "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20",
  "bg-teal-500/10 text-teal-500 hover:bg-teal-500/20",
  "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20",
  "bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20",
  "bg-violet-500/10 text-violet-500 hover:bg-violet-500/20",
  "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20",
  "bg-fuchsia-500/10 text-fuchsia-500 hover:bg-fuchsia-500/20",
  "bg-lime-500/10 text-lime-500 hover:bg-lime-500/20",
  "bg-slate-500/10 text-slate-500 hover:bg-slate-500/20",
  "bg-zinc-500/10 text-zinc-500 hover:bg-zinc-500/20",
  "bg-stone-500/10 text-stone-500 hover:bg-stone-500/20"
];

const iconSet = [
  Heart,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Star,
  Shield,
  BookOpenCheck,
  Lightbulb,
  Leaf,
  Droplets,
  Mountain,
  Waves,
  Wind,
  Flame,
  Snowflake,
  Flower,
  Music,
  Palette,
  BookOpenText,
  Compass,
  Target,
  Zap,
  Smile,
  Sunrise,
  Sunset,
  MoonStar,
  Rainbow,
  TreePine,
  Trees,
  MountainSnow,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  CloudHail,
  CloudSunRain,
  CloudMoonRain
];

interface Mood {
  name: string;
  color: string;
  icon: any;
  description: string;
}

export function Home() {
  const navigate = useNavigate();
  const [moods, setMoods] = useState<Mood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/moods`);
        if (!response.ok) {
          throw new Error('Failed to fetch moods');
        }
        const data = await response.json();
        
       
        const transformedMoods = data.moods.map((mood: string) => {
          const hash = mood.split("").reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
          const colorIndex = hash % colorSets.length;
          const iconIndex = hash % iconSet.length;
          
          return {
            name: mood,
            color: colorSets[colorIndex],
            icon: iconSet[iconIndex],
            description: getMoodDescription(mood)
          };
        });

        setMoods(transformedMoods);
      } catch (error) {
        console.error("Error fetching moods:", error);
        toast.error("Failed to load moods");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoods();
  }, []);

  const handleMoodSelect = async (mood: string) => {
    setSelectedMood(mood);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/random/${mood}`);
      if (!response.ok) {
        throw new Error('Failed to fetch verse');
      }
      const data = await response.json();
      if (data.verse) {
        navigate(`/verse/${data.verse.id}`);
      } else {
        toast.error("No verse found for this mood");
      }
    } catch (error) {
      console.error("Error fetching verse:", error);
      toast.error("Failed to load verse");
    }
  };

  const getMoodDescription = (mood: string): string => {
    const descriptions: Record<string, string> = {
      peace: "Inner peace and tranquility",
      guidance: "Divine guidance and direction",
      hope: "Hope and optimism",
      reflection: "Deep reflection and contemplation",
      comfort: "Comfort and solace",
      wisdom: "Wisdom and understanding",
      protection: "Divine protection",
      knowledge: "Knowledge and learning",
      gratitude: "Gratitude and thankfulness",
      trust: "Trust in Allah",
      reassurance: "Reassurance and confidence",
      patience: "Patience and perseverance",
      forgiveness: "Forgiveness and mercy",
      humility: "Humility and modesty",
      courage: "Courage and strength",
      faith: "Faith and belief",
      love: "Love and compassion",
      justice: "Justice and fairness",
      mercy: "Mercy and kindness",
      repentance: "Repentance and forgiveness"
    };

    return descriptions[mood] || `${mood.charAt(0).toUpperCase() + mood.slice(1)} - A spiritual state of being`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="w-full max-w-4xl mx-auto animate-pulse">
          <CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-8">How are you feeling today?</h1>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <Button
                  key={mood.name}
                  variant="ghost"
                  className={`h-24 flex flex-col items-center justify-center gap-2 ${mood.color} ${
                    selectedMood === mood.name ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => handleMoodSelect(mood.name)}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{mood.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 