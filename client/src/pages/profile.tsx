import { useQuery } from "@tanstack/react-query";
import { fetchLinkedInProfile } from "@/lib/linkedin";
import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Profile() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

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
    <div className="container max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            profile={user.profileData}
            onComplete={() => navigate("/resume")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
