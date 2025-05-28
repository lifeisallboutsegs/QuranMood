import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { BookOpen, Heart, Lightbulb } from "lucide-react";

export function About() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Quran Mood</h1>
        <p className="text-xl text-muted-foreground">
          Connecting your emotions with the wisdom of the Quran
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-12">
        <Card>
          <CardHeader>
            <BookOpen className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Our Mission</CardTitle>
            <CardDescription>
              Making the Quran more accessible and relatable through emotional connection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We believe that the Quran's wisdom can provide guidance and comfort in every emotional state.
              Our platform helps you find verses that resonate with your current mood.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Heart className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>How It Works</CardTitle>
            <CardDescription>
              Simple, intuitive, and meaningful
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Select your current mood, and we'll present you with relevant verses from the Quran.
              Each verse is carefully selected to provide comfort, guidance, or reflection based on your emotional state.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Lightbulb className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Our Vision</CardTitle>
            <CardDescription>
              Building bridges between emotions and divine wisdom
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We aim to create a space where people can find solace and guidance in the Quran,
              making it easier to connect with its teachings through emotional understanding.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-muted rounded-lg p-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="text-muted-foreground mb-4">
          Have questions, suggestions, or feedback? We'd love to hear from you.
        </p>
        <p className="text-muted-foreground">
          Email us at: <a href="mailto:contact@quranmood.com" className="text-primary hover:underline">contact@quranmood.com</a>
        </p>
      </div>
    </div>
  );
} 