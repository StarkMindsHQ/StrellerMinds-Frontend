'use client';
import { useState } from 'react';
import { Input } from './ui/input';
import { toast } from 'sonner';

export default function Card() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
  });

  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value))
      return 'Please enter a valid email address';
    return null;
  };

  const validateUsername = (value: string) => {
    if (!value) return 'Username is required';
    if (value.length < 3) return 'Username must be at least 3 characters';
    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // The submission logic should be placed here
    // After which a toast is shown depending on the state of submission
    toast.success(`Form submitted successfully!`);
  };

  return (
    <Input
      id="email"
      placeholder="your@email.com"
      type="email"
      required
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, email: e.target.value }))
      }
    />
  );
}
