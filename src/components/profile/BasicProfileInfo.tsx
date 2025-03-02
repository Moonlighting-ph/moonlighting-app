
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type BasicProfileInfoProps = {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  avatarUrl: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

export function BasicProfileInfo({
  firstName,
  lastName,
  title,
  bio,
  avatarUrl,
  handleChange,
}: BasicProfileInfoProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex flex-col items-center space-y-2">
        <Avatar className="w-24 h-24">
          <AvatarImage src={avatarUrl || undefined} />
          <AvatarFallback>{firstName?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <Button variant="outline" type="button" className="text-xs">
          Upload Photo
        </Button>
        <p className="text-xs text-muted-foreground">
          (Coming soon)
        </p>
      </div>
      <div className="flex-1 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              name="first_name"
              value={firstName}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              name="last_name"
              value={lastName}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Registered Nurse"
            value={title}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            placeholder="Tell us about yourself..."
            className="min-h-[100px]"
            value={bio}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
}
