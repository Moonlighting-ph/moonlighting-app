
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BasicProfileInfoProps {
  firstName: string;
  lastName: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function BasicProfileInfo({
  firstName,
  lastName,
  title,
  bio,
  avatarUrl,
  handleChange
}: BasicProfileInfoProps) {
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`;

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center md:flex-row md:items-start gap-4 md:gap-6 mb-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={avatarUrl} alt={`${firstName} ${lastName}`} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-lg font-medium">{firstName} {lastName}</h3>
          <p className="text-sm text-muted-foreground">{title || 'Facility Administrator'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Admin First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={firstName}
            onChange={handleChange}
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Admin Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={lastName}
            onChange={handleChange}
            placeholder="Doe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Admin Position</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={handleChange}
          placeholder="e.g. HR Manager, Medical Director"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Facility Description</Label>
        <Textarea
          id="bio"
          name="bio"
          value={bio}
          onChange={handleChange}
          placeholder="Tell us about your healthcare facility..."
          rows={4}
        />
      </div>
    </div>
  );
}
