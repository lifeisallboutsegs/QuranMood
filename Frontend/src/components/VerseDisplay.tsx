import * as React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import {
  BookOpen,
  Globe,
  Languages,
  Heart,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Star,
  Shield,
  BookOpenCheck,
  Tag,
  ExternalLink,
  Copy,
  Share2,
  Bookmark,
  BookmarkCheck,
  MessageSquare,
  ThumbsUp,
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
  CloudMoonRain,
  Pencil,
  Trash2,
  Check,
  X,
  Loader2
} from "lucide-react";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "./ui/tooltip";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useUser } from "../contexts/UserContext";
import { LoginDialog } from "./LoginDialog";
import { formatDistanceToNow } from 'date-fns';


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


const getMoodStyle = (mood: string) => {
 
  const hash = mood
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = hash % colorSets.length;
  const iconIndex = hash % iconSet.length;

  return {
    color: colorSets[colorIndex],
    icon: iconSet[iconIndex],
    description: getMoodDescription(mood)
  };
};


const getMoodDescription = (mood: string) => {
  
  const formattedMood = mood
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

 
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
    reassurance: "Reassurance and confidence"
   
  };

  return descriptions[mood] || `${formattedMood} - A spiritual state of being`;
};

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

interface VerseDisplayProps {
  verse: Verse | null;
  isLoading?: boolean;
  onEdit?: (verse: Verse) => void;
  isAdmin?: boolean;
}

interface Comment {
  id: string;
  verseId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

interface CommentItemProps {
  comment: Comment;
  onDelete: (commentId: string) => Promise<void>;
  onEdit: (commentId: string, content: string) => Promise<void>;
}

const CommentItem = ({ comment, onDelete, onEdit }: CommentItemProps) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = async () => {
    if (!editedContent.trim()) return;
    setIsSubmitting(true);
    try {
      await onEdit(comment.id, editedContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Error editing comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(comment.id);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isOwnComment = user?.id === comment.userId;

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getInitials(comment.userName || "Anonymous")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{comment.userName}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              {isOwnComment && !isEditing && (
                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          className="h-8 px-2"
                          disabled={isDeleting}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit comment</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleDelete}
                          className="h-8 px-2 text-destructive hover:text-destructive"
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete comment</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[100px]"
                  placeholder="Edit your comment..."
                  disabled={isSubmitting}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedContent(comment.content);
                    }}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleEdit}
                    disabled={isSubmitting || !editedContent.trim()}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                {comment.content}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};


const MemoizedCommentItem = React.memo(CommentItem);


const CommentInput = React.memo(({ 
  onSubmit, 
  isLoading 
}: { 
  onSubmit: (content: string) => void;
  isLoading: boolean;
}) => {
  const [content, setContent] = React.useState("");

  const handleSubmit = () => {
    if (!content.trim()) return;
    onSubmit(content);
    setContent("");
  };

  return (
    <div className="flex-none border-t pt-4 mt-4">
      <div className="space-y-2">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[100px]"
        />
        <Button
          onClick={handleSubmit}
          disabled={!content.trim() || isLoading}
          className="w-full"
        >
          Add Comment
        </Button>
      </div>
    </div>
  );
});


const CommentsList = React.memo(({ 
  comments, 
  onDelete, 
  onEdit 
}: { 
  comments: Comment[];
  onDelete: (id: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
}) => {
  return (
    <div className="flex-1 overflow-hidden">
      <ScrollArea className="h-full">
        <div className="space-y-4 pr-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No comments yet. Be the first to comment!
            </p>
          ) : (
            comments.map((comment) => (
              <MemoizedCommentItem
                key={comment.id}
                comment={comment}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

export function VerseDisplay({ verse, isLoading, onEdit, isAdmin }: VerseDisplayProps) {
  const { user } = useUser();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isCommentDialogOpen, setIsCommentDialogOpen] = useState(false);
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedVerse, setEditedVerse] = useState<Verse | null>(null);
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [isShareLoading, setIsShareLoading] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    if (verse?.id) {
      fetchLikes();
      fetchComments();
    }
  }, [verse?.id]);

  useEffect(() => {
    if (verse) {
      setEditedVerse(verse);
    }
  }, [verse]);

  const fetchLikes = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/likes/${verse?.id}`);
      const data = await response.json();
      setLikeCount(data.count);
      setIsLiked(data.likes.some((like: any) => like.userId === user?.id));
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/comments/${verse?.id}`);
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
  };

  const handleCopy = async () => {
    const textToCopy = `${verse?.arabic}\n\n${verse?.english}\n\n${verse?.bangla}`;
    await navigator.clipboard.writeText(textToCopy);
    toast.success("Verse copied to clipboard");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Quran Verse ${verse?.reference.surah}:${verse?.reference.ayah}`,
          text: `${verse?.english}\n\n${verse?.bangla}`,
          url: window.location.href
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      toast.error("Sharing is not supported on this browser");
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  const handleInteraction = (action: () => void) => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }
    action();
  };

  const handleLike = async () => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }

    try {
      setIsLikeLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/likes/${verse?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          userId: user.id,
          userName: user.name 
        }),
      });
      const data = await response.json();
      setLikeCount(data.likes);
      setIsLiked(!isLiked);
      toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
    } catch (error) {
      console.error("Error toggling like:", error);
      toast.error("Failed to update like status");
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleAddComment = React.useCallback(async (content: string) => {
    if (!user || !verse?.id) return;

    const toastId = toast.loading("Adding comment...");
    try {
      setIsCommentLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/comments/${verse.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.name,
          content: content.trim(),
        }),
      });
      const data = await response.json();
      setComments(prev => [data.comment, ...prev]);
      toast.success("Comment added successfully", { id: toastId });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error("Failed to add comment", { id: toastId });
    } finally {
      setIsCommentLoading(false);
    }
  }, [user, verse?.id]);

  const handleEditComment = React.useCallback(async (commentId: string, content: string) => {
    const toastId = toast.loading("Updating comment...");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/interactions/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
          content: content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      const data = await response.json();
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? data.comment : comment
      ));
      toast.success('Comment updated successfully', { id: toastId });
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment', { id: toastId });
      throw error;
    }
  }, [user?.id]);

  const handleDeleteComment = React.useCallback(async (commentId: string) => {
    if (!user) {
      setIsLoginDialogOpen(true);
      return;
    }

    const toastId = toast.loading("Deleting comment...");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/interactions/comments/${commentId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      setComments(prev => prev.filter(comment => comment.id !== commentId));
      toast.success("Comment deleted successfully", { id: toastId });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment", { id: toastId });
    }
  }, [user]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!editedVerse) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/verse/${editedVerse.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedVerse),
      });

      if (!response.ok) {
        throw new Error("Failed to update verse");
      }

      const data = await response.json();
      toast.success("Verse updated successfully");
      setIsEditing(false);
      if (onEdit) {
        onEdit(data.verse);
      }
    } catch (error) {
      console.error("Error updating verse:", error);
      toast.error("Failed to update verse");
    }
  };

  const handleCancelEdit = () => {
    setEditedVerse(verse);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-3xl mx-auto animate-pulse min-h-[80vh] flex flex-col">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/3"></div>
        </CardHeader>
        <CardContent className="flex-1">
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!verse || !editedVerse) return null;

  return (
    <>
      <Card className="w-full max-w-3xl mx-auto min-h-[80vh] flex flex-col">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-6 h-6 sm:w-5 sm:h-5" />
              {editedVerse.reference?.text ? (
                <span>
                  {editedVerse.reference.text} {editedVerse.reference.surah}:
                  {editedVerse.reference.ayah}
                </span>
              ) : (
                <span>
                  Surah {editedVerse.reference?.surah || 'N/A'}, Verse {editedVerse.reference?.ayah || 'N/A'}
                </span>
              )}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              {isAdmin && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={isEditing ? handleSaveEdit : handleEdit}
                      >
                        {isEditing ? (
                          <Check className="h-5 w-5 sm:h-4 sm:w-4" />
                        ) : (
                          <Pencil className="h-5 w-5 sm:h-4 sm:w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {isEditing ? "Save changes" : "Edit verse"}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              {isEditing && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-5 w-5 sm:h-4 sm:w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Cancel editing</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                      <Copy className="h-5 w-5 sm:h-4 sm:w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Copy verse</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      <Share2 className="h-5 w-5 sm:h-4 sm:w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share verse</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={handleBookmark}>
                      {isBookmarked ? (
                        <BookmarkCheck className="h-5 w-5 sm:h-4 sm:w-4" />
                      ) : (
                        <Bookmark className="h-5 w-5 sm:h-4 sm:w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isBookmarked ? "Remove bookmark" : "Bookmark verse"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {verse.source && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" asChild>
                        <a
                          href={verse.source}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-5 w-5 sm:h-4 sm:w-4" />
                        </a>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>View source</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 space-y-6">
          {/* Arabic Text */}
          {editedVerse.arabic && (
            <div className="text-right text-2xl font-arabic leading-loose bg-muted/50 p-4 rounded-lg">
              {isEditing ? (
                <Textarea
                  value={editedVerse.arabic}
                  onChange={(e) => setEditedVerse({ ...editedVerse, arabic: e.target.value })}
                  className="min-h-[100px] text-right"
                />
              ) : (
                editedVerse.arabic
              )}
            </div>
          )}

          {/* English Translation */}
          {editedVerse.english && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4" />
                <span>English Translation</span>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedVerse.english}
                  onChange={(e) => setEditedVerse({ ...editedVerse, english: e.target.value })}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-lg">{editedVerse.english}</p>
              )}
              {editedVerse.translation_info?.english_translator && (
                <p className="text-sm text-muted-foreground">
                  - {editedVerse.translation_info.english_translator}
                </p>
              )}
            </div>
          )}

          {/* Bangla Translation */}
          {editedVerse.bangla && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Languages className="w-4 h-4" />
                <span>Bangla Translation</span>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedVerse.bangla}
                  onChange={(e) => setEditedVerse({ ...editedVerse, bangla: e.target.value })}
                  className="min-h-[100px]"
                />
              ) : (
                <p className="text-lg">{editedVerse.bangla}</p>
              )}
              {editedVerse.translation_info?.bangla_translator && (
                <p className="text-sm text-muted-foreground">
                  - {editedVerse.translation_info.bangla_translator}
                </p>
              )}
            </div>
          )}

          {/* Moods */}
          {verse.mood && verse.mood.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="w-4 h-4" />
                <span>Moods</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {verse.mood.map((mood) => {
                  const { color, description } = getMoodStyle(mood);
                  return (
                    <TooltipProvider key={mood}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Badge
                            variant="secondary"
                            className={`${color} cursor-default`}
                          >
                            {mood}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>{description}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          {verse.tags && verse.tags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {verse.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-default"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Context */}
          {verse.context && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpenText className="w-4 h-4" />
                <span>Context</span>
              </div>
              <p className="text-sm text-muted-foreground">{verse.context}</p>
            </div>
          )}

          {/* Interaction Section */}
          <Separator className="my-6" />
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={() => handleInteraction(handleLike)}
                className="flex items-center gap-2"
                disabled={isLikeLoading}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
              </Button>

              <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{comments.length} {comments.length === 1 ? "Comment" : "Comments"}</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px] h-[80vh] flex flex-col">
                  <DialogHeader className="flex-none">
                    <DialogTitle>Comments</DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                    {user ? (
                      <>
                        <CommentsList
                          comments={comments}
                          onDelete={handleDeleteComment}
                          onEdit={handleEditComment}
                        />
                        <CommentInput
                          onSubmit={handleAddComment}
                          isLoading={isCommentLoading}
                        />
                      </>
                    ) : (
                      <div className="text-center py-8 space-y-4">
                        <p className="text-muted-foreground">
                          Please sign in to view and add comments
                        </p>
                        <Button onClick={() => setIsLoginDialogOpen(true)}>
                          Sign In
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <LoginDialog
        isOpen={isLoginDialogOpen}
        onClose={() => setIsLoginDialogOpen(false)}
      />
    </>
  );
}
 