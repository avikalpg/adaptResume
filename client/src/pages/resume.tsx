import { useQuery } from "@tanstack/react-query";
import { fetchLinkedInProfile } from "@/lib/linkedin";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export default function Resume() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [jobDescription, setJobDescription] = useState("");

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user"],
    onError: () => {
      toast({
        title: "Authentication Error",
        description: "Please sign in again",
        variant: "destructive"
      });
      navigate("/");
    }
  });

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste the job description here..."
              className="min-h-[200px]"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResumePreview
              profile={user.profileData}
              jobDescription={jobDescription}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
