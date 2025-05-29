import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { VerseDisplay } from "../components/VerseDisplay";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import {
  Loader2,
  Search,
  Filter,
  X,
  Pencil,
  Trash2,
  Eye,
  MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "../components/ui/dropdown-menu";

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

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalVerses: number;
  versesPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const getRandomColor = (text: string) => {
  const colors = [
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-red-100 text-red-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-indigo-100 text-indigo-800",
    "bg-orange-100 text-orange-800"
  ];
  const index = text
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[index % colors.length];
};

export function AllVerses() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [verses, setVerses] = useState<Verse[]>([]);
  const [filteredVerses, setFilteredVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const [allAvailableMoods, setAllAvailableMoods] = useState<string[]>([]);
  const [allAvailableTags, setAllAvailableTags] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [verseToDelete, setVerseToDelete] = useState<Verse | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    totalPages: 1,
    totalVerses: 0,
    versesPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchAllMoodsAndTags = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verse/all?limit=1000`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch all verses for filters");
      }
      const data = await response.json();

      const moods = Array.from(
        new Set(data.verses?.flatMap((verse: Verse) => verse.mood || []) || [])
      ) as string[];
      const tags = Array.from(
        new Set(data.verses?.flatMap((verse: Verse) => verse.tags || []) || [])
      ) as string[];

      setAllAvailableMoods(moods);
      setAllAvailableTags(tags);
    } catch (error) {
      console.error("Error fetching moods and tags:", error);
      setAllAvailableMoods([]);
      setAllAvailableTags([]);
    }
  };

  const fetchVerses = async (page: number = 1) => {
    try {
      setIsLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      });

      if (searchQuery) queryParams.append("search", searchQuery);
      if (selectedMood) queryParams.append("mood", selectedMood);
      if (selectedTag) queryParams.append("tag", selectedTag);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verse/all?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch verses");
      }
      const data = await response.json();
      setVerses(data.verses || []);
      setFilteredVerses(data.verses || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching verses:", error);
      toast.error("Failed to load verses");
      setVerses([]);
      setFilteredVerses([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMoodsAndTags();
    fetchVerses(1);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchVerses(1);
  }, [searchQuery, selectedMood, selectedTag]);

  useEffect(() => {
    if (currentPage > 1) {
      fetchVerses(currentPage);
    }
  }, [currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedMood(null);
    setSelectedTag(null);
    setCurrentPage(1);
  };

  const handleDelete = async (verse: Verse) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/verse/${verse.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user?.id,
            userName: user?.name
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete verse");
      }

      setVerses((prev) => prev.filter((v) => v.id !== verse.id));
      setFilteredVerses((prev) => prev.filter((v) => v.id !== verse.id));
      toast.success("Verse deleted successfully");

      fetchAllMoodsAndTags();
    } catch (error) {
      console.error("Error deleting verse:", error);
      toast.error("Failed to delete verse");
    } finally {
      setIsDeleteDialogOpen(false);
      setVerseToDelete(null);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "unknown time";
    }
  };

  const isCurrentUser = (userId: string) => {
    return user?.id === userId;
  };

  if (isLoading && allAvailableMoods.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <Card className="mb-8">
          <CardHeader>
            <div className="h-8 bg-muted rounded w-1/4 animate-pulse"></div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Search and Filters Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="h-10 bg-muted rounded animate-pulse"></div>
                </div>
                <div className="h-10 bg-muted rounded w-32 animate-pulse"></div>
              </div>

              {/* Moods and Tags Skeleton */}
              <div className="space-y-4">
                <div>
                  <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-6 bg-muted rounded-full w-20 animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="h-4 bg-muted rounded w-24 mb-2 animate-pulse"></div>
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-6 bg-muted rounded-full w-20 animate-pulse"
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Verses List Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-8 bg-muted rounded w-8"></div>
                  </div>

                  <div className="h-8 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded w-2/3"></div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[1, 2].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-muted rounded-full w-20"
                      ></div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-muted rounded-full w-16"
                      ></div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-end">
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Verses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search verses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="shrink-0"
              >
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>

            {/* Moods and Tags */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Filter by Mood</h3>
                <div className="flex flex-wrap gap-2">
                  {allAvailableMoods.map((mood) => (
                    <Badge
                      key={mood}
                      variant={selectedMood === mood ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedMood(selectedMood === mood ? null : mood)
                      }
                    >
                      {mood}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-2">Filter by Tag</h3>
                <div className="flex flex-wrap gap-2">
                  {allAvailableTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant={selectedTag === tag ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() =>
                        setSelectedTag(selectedTag === tag ? null : tag)
                      }
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : (
                <p>
                  Showing {filteredVerses.length} of {pagination.totalVerses}{" "}
                  verses
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verses List */}
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                    <div className="h-8 bg-muted rounded w-8"></div>
                  </div>

                  <div className="h-8 bg-muted rounded"></div>
                  <div className="space-y-2">
                    <div className="h-6 bg-muted rounded"></div>
                    <div className="h-6 bg-muted rounded w-2/3"></div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[1, 2].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-muted rounded-full w-20"
                      ></div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-6 bg-muted rounded-full w-16"
                      ></div>
                    ))}
                  </div>

                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-4 bg-muted rounded w-1/4"></div>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-end">
                    <div className="h-8 bg-muted rounded w-24"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {filteredVerses.map((verse) => (
            <Card key={verse.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {verse.reference.text} {verse.reference.surah}:
                        {verse.reference.ayah}
                      </h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {verse.mood.map((m) => (
                          <Badge key={m} className={getRandomColor(m)}>
                            {m}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {user && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/verse/edit/${verse.id}`)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => {
                              setVerseToDelete(verse);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <div className="space-y-2">
                    <p className="text-2xl font-arabic text-right">
                      {verse.arabic}
                    </p>
                    <p className="text-muted-foreground">{verse.english}</p>
                    {verse.bangla && (
                      <p className="text-muted-foreground">{verse.bangla}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {verse.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-sm text-muted-foreground space-y-1">
                    {verse.created_by && (
                      <p>
                        Added {formatTimeAgo(verse.created_by.timestamp)} by{" "}
                        {isCurrentUser(verse.created_by.userId)
                          ? "you"
                          : verse.created_by.userName}
                      </p>
                    )}
                    {verse.updated_by && (
                      <p>
                        Last updated {formatTimeAgo(verse.updated_by.timestamp)}{" "}
                        by{" "}
                        {isCurrentUser(verse.updated_by.userId)
                          ? "you"
                          : verse.updated_by.userName}
                      </p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/verse/${verse.id}`)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredVerses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No verses found matching your criteria
              </p>
              <Button variant="link" onClick={clearFilters} className="mt-2">
                Clear all filters
              </Button>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={!pagination.hasPrevPage}
                  size="sm"
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (
                        pagination.currentPage >=
                        pagination.totalPages - 2
                      ) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pagination.currentPage === pageNum
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setCurrentPage(pageNum)}
                          size="sm"
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(prev + 1, pagination.totalPages)
                    )
                  }
                  disabled={!pagination.hasNextPage}
                  size="sm"
                >
                  Next
                </Button>
              </div>
              <div className="text-sm text-muted-foreground">
                Page {pagination.currentPage} of {pagination.totalPages} (
                {pagination.totalVerses} verses)
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              verse and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => verseToDelete && handleDelete(verseToDelete)}
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
