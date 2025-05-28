import * as React from "react";
import { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { VerseForm } from "../components/VerseForm";
import { Plus, Pencil, Trash2, AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

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
  tags: string[];
  context: string;
  created_by?: {
    userId: string;
    userName: string;
    timestamp: string;
  };
  updated_by?: {
    userId: string;
    userName: string;
    timestamp: string;
  };
}

export function ManageVerses() {
  const { user } = useUser();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);

  useEffect(() => {
    fetchVerses();
  }, []);

  const fetchVerses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/all`);
      const data = await response.json();
      setVerses(data.verses);
    } catch (error) {
      console.error("Error fetching verses:", error);
      toast.error("Failed to fetch verses");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: any) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/manual`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create verse");
      }

      const newVerse = await response.json();
      setVerses(prev => [newVerse.verse, ...prev]);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Error creating verse:", error);
      throw error;
    }
  };

  const handleEdit = async (data: any) => {
    if (!selectedVerse) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/${selectedVerse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update verse");
      }

      const updatedVerse = await response.json();
      setVerses(prev => prev.map(verse => 
        verse.id === selectedVerse.id ? updatedVerse.verse : verse
      ));
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating verse:", error);
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!selectedVerse) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/${selectedVerse.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete verse");
      }

      setVerses(prev => prev.filter(verse => verse.id !== selectedVerse.id));
      setIsDeleteDialogOpen(false);
      toast.success("Verse deleted successfully");
    } catch (error) {
      console.error("Error deleting verse:", error);
      toast.error("Failed to delete verse");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-8">
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Verses</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Verse
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {verses.map((verse) => (
            <Card key={verse.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>
                    {verse.reference.text ? (
                      <span>
                        {verse.reference.text} {verse.reference.surah}:
                        {verse.reference.ayah}
                      </span>
                    ) : (
                      <span>
                        Surah {verse.reference.surah}, Verse {verse.reference.ayah}
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedVerse(verse);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        setSelectedVerse(verse);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-right text-lg font-arabic">
                    {verse.arabic}
                  </div>
                  <p className="text-muted-foreground">{verse.english}</p>
                  {verse.created_by && (
                    <p className="text-sm text-muted-foreground">
                      Created by {verse.created_by.userName} on{" "}
                      {new Date(verse.created_by.timestamp).toLocaleDateString()}
                    </p>
                  )}
                  {verse.updated_by && (
                    <p className="text-sm text-muted-foreground">
                      Last updated by {verse.updated_by.userName} on{" "}
                      {new Date(verse.updated_by.timestamp).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Verse</DialogTitle>
          </DialogHeader>
          <VerseForm
            mode="create"
            onSubmit={handleCreate}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Verse</DialogTitle>
          </DialogHeader>
          {selectedVerse && (
            <VerseForm
              verse={selectedVerse}
              mode="edit"
              onSubmit={handleEdit}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the verse
              and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 