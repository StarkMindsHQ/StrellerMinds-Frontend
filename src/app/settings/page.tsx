'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { FormError } from '@/components/ui/form-error';
import {
  Upload,
  Eye,
  EyeOff,
  Bell,
  Shield,
  User,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import ChangePassword from '@/components/ChangePassword';
import NotificationPreferences from '@/components/NotificationPreferences';
import {
  profileUpdateSchema,
  type ProfileUpdateFormData,
} from '@/lib/validations';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    mode: 'all',
    defaultValues: {
      firstName: 'Anaya',
      lastName: 'Suliemon',
      email: 'Anayaadamz@hotmail.com',
      phone: '8045671129',
      title: 'Fashion Enthusiast',
    },
  });

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      // TODO: Implement profile update API call
      console.log('Profile update data:', data);
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-14 w-14 ring-2 ring-[#ffcc00] ring-offset-2">
                  <AvatarImage
                    src="/api/placeholder/56/56"
                    alt="Anaya Suliemon"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-[#5c0f49] to-purple-600 text-white font-semibold">
                    AS
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#5c0f49] to-purple-600 bg-clip-text text-transparent">
                  Anaya Suliemon
                </h1>
                <p className="text-sm text-gray-600 font-medium">
                  Fashion Enthusiast
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-[#5c0f49] py-3 border-b-2 border-transparent hover:border-[#ffcc00] transition-all duration-300 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="text-gray-600 hover:text-[#5c0f49] py-3 border-b-2 border-transparent hover:border-[#ffcc00] transition-all duration-300 font-medium"
            >
              Courses
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-600 hover:text-[#5c0f49] py-3 border-b-2 border-transparent hover:border-[#ffcc00] transition-all duration-300 font-medium"
            >
              Wishlist
            </Link>
            <Link
              href="/settings"
              className="text-[#5c0f49] py-3 border-b-2 border-[#ffcc00] font-semibold"
            >
              Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#5c0f49] to-purple-600 bg-clip-text text-transparent mb-2">
                Account Settings
              </h2>
              <p className="text-gray-600">
                Manage your account preferences and security settings
              </p>
            </div>

            {/* Modern Radio Button Navigation */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <label
                className={`group relative flex items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  activeSection === 'profile'
                    ? 'border-[#5c0f49] bg-gradient-to-r from-[#5c0f49]/5 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-[#ffcc00] hover:bg-yellow-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="settings-section"
                  value="profile"
                  checked={activeSection === 'profile'}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                    activeSection === 'profile'
                      ? 'border-[#5c0f49] bg-[#5c0f49]'
                      : 'border-gray-300 group-hover:border-[#ffcc00]'
                  }`}
                >
                  {activeSection === 'profile' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <User
                  className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                    activeSection === 'profile'
                      ? 'text-[#5c0f49]'
                      : 'text-gray-400 group-hover:text-[#ffcc00]'
                  }`}
                />
                <span
                  className={`font-medium transition-colors duration-300 ${
                    activeSection === 'profile'
                      ? 'text-[#5c0f49]'
                      : 'text-gray-700 group-hover:text-[#5c0f49]'
                  }`}
                >
                  Profile
                </span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-all duration-300 ${
                    activeSection === 'profile'
                      ? 'text-[#5c0f49] rotate-90'
                      : 'text-gray-400 group-hover:text-[#ffcc00]'
                  }`}
                />
              </label>

              <label
                className={`group relative flex items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  activeSection === 'password'
                    ? 'border-[#5c0f49] bg-gradient-to-r from-[#5c0f49]/5 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-[#ffcc00] hover:bg-yellow-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="settings-section"
                  value="password"
                  checked={activeSection === 'password'}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                    activeSection === 'password'
                      ? 'border-[#5c0f49] bg-[#5c0f49]'
                      : 'border-gray-300 group-hover:border-[#ffcc00]'
                  }`}
                >
                  {activeSection === 'password' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <Shield
                  className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                    activeSection === 'password'
                      ? 'text-[#5c0f49]'
                      : 'text-gray-400 group-hover:text-[#ffcc00]'
                  }`}
                />
                <span
                  className={`font-medium transition-colors duration-300 ${
                    activeSection === 'password'
                      ? 'text-[#5c0f49]'
                      : 'text-gray-700 group-hover:text-[#5c0f49]'
                  }`}
                >
                  Update Password
                </span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-all duration-300 ${
                    activeSection === 'password'
                      ? 'text-[#5c0f49] rotate-90'
                      : 'text-gray-400 group-hover:text-[#ffcc00]'
                  }`}
                />
              </label>

              <label
                className={`group relative flex items-center cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                  activeSection === 'notifications'
                    ? 'border-[#5c0f49] bg-gradient-to-r from-[#5c0f49]/5 to-purple-50 shadow-lg'
                    : 'border-gray-200 hover:border-[#ffcc00] hover:bg-yellow-50/50'
                }`}
              >
                <input
                  type="radio"
                  name="settings-section"
                  value="notifications"
                  checked={activeSection === 'notifications'}
                  onChange={(e) => setActiveSection(e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-all duration-300 ${
                    activeSection === 'notifications'
                      ? 'border-[#5c0f49] bg-[#5c0f49]'
                      : 'border-gray-300 group-hover:border-[#ffcc00]'
                  }`}
                >
                  {activeSection === 'notifications' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <Bell
                  className={`w-5 h-5 mr-3 transition-colors duration-300 ${
                    activeSection === 'notifications'
                      ? 'text-[#5c0f49]'
                      : 'text-gray-400 group-hover:text-[#ffcc00]'
                  }`}
                />
                <span
                  className={`font-medium transition-colors duration-300 ${
                    activeSection === 'notifications'
                      ? 'text-[#5c0f49]'
                      : 'text-gray-700 group-hover:text-[#5c0f49]'
                  }`}
                >
                  Notifications
                </span>
                <ChevronRight
                  className={`w-4 h-4 ml-auto transition-all duration-300 ${
                    activeSection === 'notifications'
                      ? 'text-[#5c0f49] rotate-90'
                      : 'text-gray-400 group-hover:text-[#ffcc00]'
                  }`}
                />
              </label>
            </div>

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="space-y-8 animate-in slide-in-from-right-5 duration-300">
                <div className="flex flex-col lg:flex-row gap-10">
                  {/* Profile Picture */}
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative group">
                      <Avatar className="h-40 w-40 ring-4 ring-[#ffcc00]/30 ring-offset-4 transition-all duration-300 group-hover:ring-[#ffcc00]/60">
                        <AvatarImage
                          src="/api/placeholder/160/160"
                          alt="Profile"
                        />
                        <AvatarFallback className="text-3xl bg-gradient-to-br from-[#5c0f49] to-purple-600 text-white font-bold">
                          AS
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-[#5c0f49] to-purple-600 hover:from-purple-600 hover:to-[#5c0f49] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Photo
                    </Button>
                  </div>

                  {/* Profile Form */}
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex-1 space-y-8"
                  >
                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-purple-100">
                      <Label
                        htmlFor="fullname"
                        className="text-sm font-semibold text-[#5c0f49] mb-3 block"
                      >
                        Full name
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Input
                            id="firstname"
                            placeholder="Anaya"
                            {...register('firstName')}
                            className="rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm transition-all duration-300"
                          />
                          <FormError message={errors.firstName?.message} />
                        </div>
                        <div>
                          <Input
                            id="lastname"
                            placeholder="Suliemon"
                            {...register('lastName')}
                            className="rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm transition-all duration-300"
                          />
                          <FormError message={errors.lastName?.message} />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-purple-100">
                      <Label
                        htmlFor="email"
                        className="text-sm font-semibold text-[#5c0f49] mb-3 block"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Anayaadamz@hotmail.com"
                        {...register('email')}
                        className="rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm transition-all duration-300"
                      />
                      <FormError message={errors.email?.message} />
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-purple-100">
                      <Label
                        htmlFor="phone"
                        className="text-sm font-semibold text-[#5c0f49] mb-3 block"
                      >
                        Phone
                      </Label>
                      <div className="flex">
                        <select className="rounded-l-xl border border-r-0 border-purple-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-sm font-medium text-[#5c0f49] focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 transition-all duration-300">
                          <option>+234</option>
                        </select>
                        <Input
                          id="phone"
                          placeholder="8045671129"
                          {...register('phone')}
                          className="rounded-l-none rounded-r-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                      <FormError message={errors.phone?.message} />
                    </div>

                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl border border-purple-100">
                      <Label
                        htmlFor="title"
                        className="text-sm font-semibold text-[#5c0f49] mb-3 block"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        placeholder="Fashion Enthusiast"
                        {...register('title')}
                        className="rounded-xl border-purple-200 focus:border-[#5c0f49] focus:ring-[#5c0f49]/20 bg-white/70 backdrop-blur-sm transition-all duration-300"
                      />
                      <FormError message={errors.title?.message} />
                    </div>

                    <Button
                      type="submit"
                      className="bg-gradient-to-r from-[#ffcc00] to-yellow-400 hover:from-yellow-400 hover:to-[#ffcc00] text-[#5c0f49] font-bold px-10 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </div>
              </div>
            )}

            {/* Password Section */}
            {activeSection === 'password' && <ChangePassword />}

            {/* Notifications Section */}
            {activeSection === 'notifications' && <NotificationPreferences />}
          </div>
        </div>
      </div>
    </div>
  );
}
