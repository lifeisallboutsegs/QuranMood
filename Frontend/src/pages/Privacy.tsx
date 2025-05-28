import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function Privacy() {
  return (
    <div className="container mx-auto px-4 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We collect minimal information necessary to provide our services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Your preferences for verse display and mood selection</li>
              <li>Basic usage statistics to improve our service</li>
              <li>Device information for optimal display</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your information is used to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Provide personalized verse recommendations</li>
              <li>Improve our service and user experience</li>
              <li>Maintain and enhance our platform</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We implement appropriate security measures to protect your information. 
              Your data is encrypted and stored securely.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              If you have any questions about our privacy policy, please contact us at{" "}
              <a href="mailto:privacy@quranmood.com" className="text-primary hover:underline">
                privacy@quranmood.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 