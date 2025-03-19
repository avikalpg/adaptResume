import type { LinkedInProfile } from "@shared/schema";

interface ResumePreviewProps {
  profile: LinkedInProfile;
  jobDescription: string;
}

export function ResumePreview({ profile, jobDescription }: ResumePreviewProps) {
  return (
    <div className="prose max-w-none">
      <h1>{profile.name}</h1>
      <p className="lead">{profile.headline}</p>
      
      <h2>Professional Summary</h2>
      <p>{profile.summary}</p>
      
      <h2>Experience</h2>
      {profile.positions.map((position, index) => (
        <div key={index} className="mb-4">
          <h3>{position.title}</h3>
          <p className="text-muted-foreground">
            {position.company} | {position.startDate} - {position.endDate || 'Present'}
          </p>
          <p>{position.description}</p>
        </div>
      ))}
      
      <h2>Education</h2>
      {profile.education.map((edu, index) => (
        <div key={index} className="mb-4">
          <h3>{edu.school}</h3>
          <p>{edu.degree} in {edu.field}</p>
          <p className="text-muted-foreground">
            {edu.startDate} - {edu.endDate || 'Present'}
          </p>
        </div>
      ))}
      
      <h2>Skills</h2>
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill, index) => (
          <span key={index} className="bg-muted px-2 py-1 rounded">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
