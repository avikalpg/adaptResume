import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { LinkedInProfile } from "@shared/schema";

const profileSchema = z.object({
  headline: z.string().min(1, "Required"),
  summary: z.string().min(1, "Required"),
  positions: z.array(z.object({
    title: z.string().min(1, "Required"),
    company: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().optional()
  })),
  education: z.array(z.object({
    school: z.string().min(1, "Required"),
    degree: z.string().min(1, "Required"),
    field: z.string().min(1, "Required"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().optional()
  })),
  skills: z.array(z.string())
});

interface ProfileFormProps {
  profile: LinkedInProfile;
  onComplete: () => void;
}

export function ProfileForm({ profile, onComplete }: ProfileFormProps) {
  const form = useForm<LinkedInProfile>({
    resolver: zodResolver(profileSchema),
    defaultValues: profile
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onComplete)} className="space-y-8">
        <FormField
          control={form.control}
          name="headline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Professional Headline</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Continue to Resume</Button>
      </form>
    </Form>
  );
}
