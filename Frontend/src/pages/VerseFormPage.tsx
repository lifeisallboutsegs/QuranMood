import * as React from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { VerseForm } from "../components/VerseForm";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { AlertTriangle, Sparkles, PenTool } from "lucide-react";
import { Button } from "../components/ui/button";

export function VerseFormPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const [verse, setVerse] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(id ? true : false);
  const mode = id ? "edit" : "create";
  const isAI = searchParams.get("type") === "ai";
  const isManual = searchParams.get("type") === "manual";

  React.useEffect(() => {
    if (!user) {
      toast.error("Please log in to manage verses");
      navigate("/");
      return;
    }

    if (id) {
      fetchVerse();
    }
  }, [id, user, navigate]);

  const fetchVerse = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verse/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch verse");
      const data = await response.json();
      setVerse(data.verse);
    } catch (error) {
      console.error("Error fetching verse:", error);
      toast.error("Failed to fetch verse");
      navigate("/all-verses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      let url;
      if (id) {
        url = `${import.meta.env.VITE_API_URL}/api/verse/${id}`;
      } else if (isAI) {
        url = `${import.meta.env.VITE_API_URL}/api/verse/add/${
          data.reference.surah
        }/${data.reference.ayah}`;
      } else {
        url = `${import.meta.env.VITE_API_URL}/api/verse/manual`;
      }

      const response = await fetch(url, {
        method: id ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error(`Failed to ${mode} verse`);

      const result = await response.json();
      toast.success(
        `Verse ${mode === "create" ? "created" : "updated"} successfully`
      );
      navigate(`/verse/${result.verse.id}`);
    } catch (error) {
      console.error(`Error ${mode}ing verse:`, error);
      throw error;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 mx-auto text-yellow-500" />
              <h2 className="text-2xl font-bold">Authentication Required</h2>
              <p className="text-muted-foreground">
                Please log in to manage verses.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6 animate-pulse">
              {/* Header */}
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Reference */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>

                {/* Arabic */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>

                {/* English */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>

                {/* Bangla */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>

                {/* Moods */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-10 bg-muted rounded-full w-24"></div>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>

                {/* Context */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-32 bg-muted rounded"></div>
                </div>

                {/* Translation Info */}
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-24"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <div className="h-10 bg-muted rounded w-24"></div>
                <div className="h-10 bg-muted rounded w-24"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!id && !isAI && !isManual) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl overflow-x-hidden">
        <Card className="max-w-3xl mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl md:text-3xl text-center break-words">
              Choose Creation Method
            </CardTitle>
            <p className="text-muted-foreground text-center text-sm md:text-base break-words">
              Select how you want to add a new verse to the collection
            </p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              <Button
                size="lg"
                onClick={() => navigate("/verse/create?type=ai")}
                className="h-auto p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 hover:scale-[1.02] transition-transform min-h-[200px] w-full overflow-hidden break-words"
              >
                <div className="bg-primary/10 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="flex flex-col items-center justify-center flex-1 w-full max-w-full text-wrap overflow-hidden">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-center break-words">
                    Create with AI
                  </h3>
                  <p className="text-xs sm:text-sm text-center break-words">
                    Automatically fetch verse from Quran API using surah and
                    verse numbers
                  </p>
                </div>
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/verse/create?type=manual")}
                className="h-auto p-4 sm:p-6 flex flex-col items-center justify-center gap-3 sm:gap-4 hover:scale-[1.02] transition-transform min-h-[200px] w-full overflow-hidden break-words"
              >
                <div className="bg-primary/10 p-2 sm:p-3 rounded-full flex-shrink-0">
                  <PenTool className="h-6 w-6 sm:h-8 sm:w-8" />
                </div>
                <div className="flex flex-col items-center justify-center flex-1 w-full max-w-full text-wrap overflow-hidden">
                  <h3 className="font-semibold text-base sm:text-lg mb-2 text-center break-words">
                    Manual Entry
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground text-center break-words">
                    Enter verse details manually including translations and
                    metadata
                  </p>
                </div>
              </Button>
            </div>

            <div className="mt-6 sm:mt-8 text-center space-y-1">
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                Choose AI creation for quick verse addition with automatic
                fetching
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground break-words">
                Choose manual entry for complete control over verse details
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <VerseForm
        verse={verse}
        mode={mode}
        isAI={isAI}
        onSubmit={handleSubmit}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
