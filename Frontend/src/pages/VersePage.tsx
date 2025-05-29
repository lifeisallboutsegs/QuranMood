import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { VerseDisplay } from "../components/VerseDisplay";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "../contexts/UserContext";
import { Card, CardContent } from "../components/ui/card";
import { Separator } from "../components/ui/separator";

interface Verse {
  id: string;
  mood: string[];
  arabic: string;
  english: string;
  bangla: string;
  reference: {
    surah: number;
    ayah: number;
    text?: string;
  };
  source: string;
  tags: string[];
  context: string;
  translation_info: {
    english_translator: string;
    bangla_translator: string;
    language: string;
  };
  created_at?: string;
  updated_at?: string;
}

interface User {
  id: string;
  name: string;
  isAdmin?: boolean;
}

export function VersePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser() as { user: User | null };
  const [verse, setVerse] = useState<Verse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/verse/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch verse");
        }
        const data = await response.json();
        setVerse(data.verse);
      } catch (error) {
        console.error("Error fetching verse:", error);
        toast.error("Failed to load verse");
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerse();
  }, [id, navigate]);

  const handleVerseEdit = (updatedVerse: Verse) => {
    setVerse(updatedVerse);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-3xl">
        <div className="mb-6">
          <div className="h-10 bg-muted rounded w-20 animate-pulse"></div>
        </div>

        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-1/3"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                </div>
                <div className="h-8 bg-muted rounded w-8"></div>
              </div>

              {/* Arabic Text */}
              <div className="h-12 bg-muted rounded"></div>

              {/* English and Bangla */}
              <div className="space-y-4">
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-2/3"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
              </div>

              {/* Moods */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 bg-muted rounded-full w-20"></div>
                ))}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-6 bg-muted rounded-full w-16"></div>
                ))}
              </div>

              {/* Context */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-6 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-2/3"></div>
              </div>

              {/* Translation Info */}
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
              </div>

              {/* Metadata */}
              <div className="space-y-1">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/4"></div>
              </div>

              <Separator className="my-4" />

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <div className="h-8 bg-muted rounded w-24"></div>
                <div className="h-8 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-primary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </Button>
      </div>

      <VerseDisplay
        verse={verse}
        isLoading={isLoading}
        onEdit={handleVerseEdit}
        isAdmin={user?.isAdmin}
      />

      {verse && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-destructive">
              Something is wrong with this verse data? click here to edit and
              fix.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/20 hover:bg-destructive/10"
            onClick={() => navigate(`/verse/edit/${verse.id}`)}
          >
            Edit Verse
          </Button>
        </div>
      )}
    </div>
  );
}
