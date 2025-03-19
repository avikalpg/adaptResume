import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaLinkedin } from "react-icons/fa";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Resume Generator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center mb-6">
            Generate professionally tailored resumes using your LinkedIn profile
          </p>
          
          <Button
            className="w-full flex items-center justify-center gap-2"
            size="lg"
            onClick={() => window.location.href = "/api/auth/linkedin"}
          >
            <FaLinkedin className="w-5 h-5" />
            Sign in with LinkedIn
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
