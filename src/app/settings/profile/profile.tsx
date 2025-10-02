'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Camera } from 'lucide-react';

export default function ProfileComponent() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openFileManager = () => {
    document.getElementById('file-upload')?.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5c0f49] to-purple-600 rounded-full p-1 animate-pulse">
              <div className="bg-white rounded-full p-1">
                <Avatar className="h-36 w-36 ring-2 ring-[#ffcc00]/50 ring-offset-2 transition-all duration-500 group-hover:ring-[#ffcc00] group-hover:ring-offset-4">
                  <AvatarImage
                    src={selectedImage || '/api/placeholder/144/144'}
                    alt="Profile"
                    className="object-cover"
                  />
                  <AvatarFallback className="text-3xl bg-gradient-to-br from-[#5c0f49] to-purple-600 text-white font-bold">
                    AS
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
              <Camera className="h-8 w-8 text-white drop-shadow-lg" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-[#ffcc00] to-yellow-400 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Hidden file input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <Button
            onClick={openFileManager}
            className="bg-gradient-to-r from-[#5c0f49] to-purple-600 hover:from-purple-600 hover:to-[#5c0f49] text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
          >
            <Upload className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Upload Photo
          </Button>
        </div>

        {/* Profile Form */}
        <div className="flex-1 space-y-8">
          <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
            <Label
              htmlFor="fullname"
              className="text-sm font-bold text-[#5c0f49] mb-4 flex items-center"
            >
              <div className="w-2 h-2 bg-[#ffcc00] rounded-full mr-2"></div>
              Full name
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <Input
                  id="firstname"
                  placeholder="Anaya"
                  defaultValue="Anaya"
                  className="rounded-xl border-purple-200/50 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 pl-4 py-3 font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5c0f49]/5 to-purple-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
              <div className="relative group">
                <Input
                  id="lastname"
                  placeholder="Suliemon"
                  defaultValue="Suliemon"
                  className="rounded-xl border-purple-200/50 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 pl-4 py-3 font-medium"
                />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5c0f49]/5 to-purple-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Label
              htmlFor="email"
              className="text-sm font-bold text-[#5c0f49] mb-4 flex items-center"
            >
              <div className="w-2 h-2 bg-[#ffcc00] rounded-full mr-2"></div>
              Email
            </Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="Anayaadamz@hotmail.com"
                defaultValue="Anayaadamz@hotmail.com"
                className="rounded-xl border-purple-200/50 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 pl-4 py-3 font-medium"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5c0f49]/5 to-purple-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Label
              htmlFor="phone"
              className="text-sm font-bold text-[#5c0f49] mb-4 flex items-center"
            >
              <div className="w-2 h-2 bg-[#ffcc00] rounded-full mr-2"></div>
              Phone
            </Label>
            <div className="flex relative">
              <select className="rounded-l-xl border border-r-0 border-purple-200/50 bg-gradient-to-r from-white/90 to-purple-50/90 backdrop-blur-sm px-4 py-3 text-sm font-bold text-[#5c0f49] focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 transition-all duration-300 group-hover:bg-white/95">
                <option>+234</option>
                <option>+1</option>
                <option>+44</option>
              </select>
              <Input
                id="phone"
                placeholder="8045671129"
                defaultValue="8045671129"
                className="rounded-l-none rounded-r-xl border-purple-200/50 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 py-3 font-medium flex-1"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5c0f49]/5 to-purple-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-white/80 to-purple-50/80 backdrop-blur-sm p-6 rounded-2xl border border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <Label
              htmlFor="title"
              className="text-sm font-bold text-[#5c0f49] mb-4 flex items-center"
            >
              <div className="w-2 h-2 bg-[#ffcc00] rounded-full mr-2"></div>
              Title
            </Label>
            <div className="relative">
              <Input
                id="title"
                placeholder="Fashion Enthusiast"
                defaultValue="Fashion Enthusiast"
                className="rounded-xl border-purple-200/50 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/80 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/90 pl-4 py-3 font-medium"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#5c0f49]/5 to-purple-100/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button className="bg-gradient-to-r from-[#ffcc00] to-yellow-400 hover:from-yellow-400 hover:to-[#ffcc00] text-[#5c0f49] font-bold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative z-10">Save Changes</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
