import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";
import { VerseDisplay } from "./VerseDisplay";
import { API_ENDPOINTS } from "../config";

interface VerseSearchProps {
  onClose: () => void;
}

export function VerseSearch({ onClose }: VerseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [verses, setVerses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ENDPOINTS.verse.searchByTag(searchTerm));
      if (!response.ok) throw new Error('Failed to search verses');
      
      const data = await response.json();
      setVerses(data.verses);
    } catch (err) {
      console.error('Error searching verses:', err);
      setError('Failed to search verses. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-background rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Search Verses by Tag</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Enter a tag (e.g., guidance, peace, hope)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {error && (
            <div className="text-center text-destructive my-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {verses.map((verse) => (
              <VerseDisplay key={verse.id} verse={verse} />
            ))}
            {verses.length === 0 && !isLoading && searchTerm && (
              <p className="text-center text-muted-foreground">
                No verses found with tag "{searchTerm}"
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 