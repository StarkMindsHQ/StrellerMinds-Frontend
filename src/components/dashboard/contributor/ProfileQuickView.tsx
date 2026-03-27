'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MapPin, Star, ShieldCheck, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProfileQuickViewProps {
  profile: {
    name: string;
    role: string;
    company: string;
    location: string;
    skills: string[];
    avatar: string;
    coverage: number;
    reputation: number;
  };
}

export const ProfileQuickView: React.FC<ProfileQuickViewProps> = ({
  profile,
}) => {
  return (
    <Card className="border-none shadow-sm overflow-hidden bg-card">
      <div className="h-24 bg-gradient-to-r from-primary/20 via-primary/5 to-primary/20 relative">
        <div className="absolute -bottom-10 left-6">
          <div className="w-20 h-20 rounded-2xl border-4 border-background overflow-hidden bg-muted shadow-lg">
            <Image
              src={profile.avatar || '/placeholder.svg?height=80&width=80'}
              alt={profile.name}
              width={80}
              height={80}
            />
          </div>
        </div>
      </div>
      <CardContent className="pt-14 pb-6 px-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-black tracking-tight">
              {profile.name}
            </h3>
            <p className="text-sm font-bold text-primary">{profile.role}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary"
          >
            <ExternalLink size={18} />
          </Button>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <MapPin size={14} />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Mail size={14} />
            <span>alex.rivera@starkminds.io</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between p-3 bg-muted/40 rounded-2xl">
          <div className="text-center px-2">
            <p className="text-[10px] uppercase font-black text-muted-foreground/60 mb-1">
              Reputation
            </p>
            <div className="flex items-center justify-center gap-1 text-primary font-black">
              <Star size={14} fill="currentColor" />
              <span>{profile.reputation}</span>
            </div>
          </div>
          <div className="w-[1px] h-8 bg-muted" />
          <div className="text-center px-2">
            <p className="text-[10px] uppercase font-black text-muted-foreground/60 mb-1">
              Impact
            </p>
            <div className="flex items-center justify-center gap-1 text-green-600 font-black">
              <ShieldCheck size={14} />
              <span>{profile.coverage}%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-black uppercase text-muted-foreground/60 tracking-widest">
            Top Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 bg-primary/5 text-primary border-none font-bold text-[10px]"
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
