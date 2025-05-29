import * as React from "react";
import { useUser } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";

interface VerseFormProps {
  verse?: any;
  mode: "create" | "edit";
  isAI?: boolean;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

const PREDEFINED_MOODS = [
  "Gratitude",
  "Patience",
  "Hope",
  "Guidance",
  "Forgiveness",
  "Mercy",
  "Wisdom",
  "Strength",
  "Peace",
  "Faith"
];

const PREDEFINED_TAGS = [
  "quran",
  "islam",
  "guidance",
  "wisdom",
  "faith",
  "allah",
  "prophet",
  "sunnah",
  "deen",
  "iman"
];

export function VerseForm({ verse, mode, isAI, onSubmit, onCancel }: VerseFormProps) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isManualEntry, setIsManualEntry] = React.useState(false);
  const [formData, setFormData] = React.useState({
    reference: {
      surah: verse?.reference?.surah || "",
      ayah: verse?.reference?.ayah || "",
      text: verse?.reference?.text || ""
    },
    arabic: verse?.arabic || "",
    english: verse?.english || "",
    bangla: verse?.bangla || "",
    context: verse?.context || "",
    mood: verse?.mood || [],
    tags: verse?.tags || ["quran"],
    source: verse?.source || "",
    translation_info: verse?.translation_info || {
      english_translator: "",
      bangla_translator: "",
      language: "multi"
    }
  });

  const [newMood, setNewMood] = React.useState("");
  const [newTag, setNewTag] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to submit");
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...formData,
        userId: user.id,
        userName: user.name
      });
      
      if (mode === "edit" && verse?.id) {
        navigate(`/verse/${verse.id}`, { replace: true });
      } else if (mode === "create") {
        navigate("/all-verses", { replace: true });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddMood = () => {
    if (newMood && !formData.mood.includes(newMood)) {
      setFormData(prev => ({
        ...prev,
        mood: [...prev.mood, newMood]
      }));
      setNewMood("");
    }
  };

  const handleRemoveMood = (mood: string) => {
    setFormData(prev => ({
      ...prev,
      mood: prev.mood.filter((m: string) => m !== mood)
    }));
  };

  const handleAddTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tag)
    }));
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">
          {mode === "create" ? (isAI ? "Create Verse with AI" : "Manual Verse Entry") : "Edit Verse"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Surah Number</label>
              <Input
                type="number"
                value={formData.reference.surah}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reference: { ...prev.reference, surah: parseInt(e.target.value) }
                }))}
                required
                min="1"
                max="114"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Verse Number</label>
              <Input
                type="number"
                value={formData.reference.ayah}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  reference: { ...prev.reference, ayah: parseInt(e.target.value) }
                }))}
                required
                min="1"
              />
            </div>
          </div>

          {!isAI && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Surah Name (Optional)</label>
                <Input
                  value={formData.reference.text}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    reference: { ...prev.reference, text: e.target.value }
                  }))}
                  placeholder="e.g., Al-Fatiha, Al-Baqarah"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Arabic Text</label>
                <Textarea
                  value={formData.arabic}
                  onChange={(e) => setFormData(prev => ({ ...prev, arabic: e.target.value }))}
                  required
                  className="font-arabic text-right text-lg"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">English Translation</label>
                <Textarea
                  value={formData.english}
                  onChange={(e) => setFormData(prev => ({ ...prev, english: e.target.value }))}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Bangla Translation (Optional)</label>
                <Textarea
                  value={formData.bangla}
                  onChange={(e) => setFormData(prev => ({ ...prev, bangla: e.target.value }))}
                  rows={3}
                  placeholder="Enter Bangla translation if available"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Context</label>
                <Textarea
                  value={formData.context}
                  onChange={(e) => setFormData(prev => ({ ...prev, context: e.target.value }))}
                  rows={3}
                  placeholder="Provide context or explanation for this verse"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Source URL (Optional)</label>
                <Input
                  type="url"
                  value={formData.source}
                  onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                  placeholder="e.g., https://quran.com/42/19"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">English Translator</label>
                  <Input
                    value={formData.translation_info.english_translator}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      translation_info: { ...prev.translation_info, english_translator: e.target.value }
                    }))}
                    placeholder="e.g., Dr. Mustafa Khattab"
                    disabled={isManualEntry}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Bangla Translator</label>
                  <Input
                    value={formData.translation_info.bangla_translator}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      translation_info: { ...prev.translation_info, bangla_translator: e.target.value }
                    }))}
                    placeholder="e.g., Dr. Muhammad Muhsin Khan"
                    disabled={isManualEntry}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="manual-entry"
                  checked={isManualEntry}
                  onCheckedChange={(checked) => {
                    setIsManualEntry(checked as boolean);
                    if (checked) {
                      setFormData(prev => ({
                        ...prev,
                        translation_info: {
                          ...prev.translation_info,
                          english_translator: user?.name || "Unknown",
                          bangla_translator: user?.name || "Unknown"
                        }
                      }));
                    } else {
                      setFormData(prev => ({
                        ...prev,
                        translation_info: {
                          ...prev.translation_info,
                          english_translator: "",
                          bangla_translator: ""
                        }
                      }));
                    }
                  }}
                />
                <label
                  htmlFor="manual-entry"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Set as manual entry (will use your name as translator)
                </label>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Moods</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.mood.map((mood: string) => (
                      <Badge key={mood} variant="secondary" className="flex items-center gap-1">
                        {mood}
                        <button
                          type="button"
                          onClick={() => handleRemoveMood(mood)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newMood}
                      onChange={(e) => setNewMood(e.target.value)}
                      placeholder="Add a mood"
                      list="moods"
                    />
                    <datalist id="moods">
                      {PREDEFINED_MOODS.map((mood) => (
                        <option key={mood} value={mood} />
                      ))}
                    </datalist>
                    <Button type="button" onClick={handleAddMood} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      list="tags"
                    />
                    <datalist id="tags">
                      {PREDEFINED_TAGS.map((tag) => (
                        <option key={tag} value={tag} />
                      ))}
                    </datalist>
                    <Button type="button" onClick={handleAddTag} size="icon">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : mode === "create" ? "Create Verse" : "Update Verse"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 