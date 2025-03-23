'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { X, Play } from 'lucide-react';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
}

export default function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote:
        'As someone with a non-technical background, I was worried about learning blockchain concepts. Streller Minds made it accessible and engaging. Now I can confidently lead blockchain initiatives at my company.',
      name: 'Sarah Chen',
      title: 'Product Manager',
      company: 'BlockInnovate',
      avatarUrl: '/avatars/sarah.jpg',
    },
    {
      id: 2,
      quote:
        'The practical projects helped me bridge the gap between theory and application. I built my first dApp within weeks of starting the course!',
      name: 'Miguel Rodriguez',
      title: 'Software Developer',
      company: 'TechFusion',
      avatarUrl: '/avatars/miguel.jpg',
    },
    {
      id: 3,
      quote:
        "The community at Streller Minds is incredible. I've made valuable connections with both learners and industry experts that have opened doors for my career.",
      name: 'Aisha Johnson',
      title: 'Blockchain Consultant',
      company: 'DistributedSystems',
      avatarUrl: '/avatars/aisha.jpg',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((current) => (current + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <section className="py-16 px-4 bg-gray-50">
      <Card className="bg-gray-200 border-none shadow-sm">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
            <div className="md:w-1/2">
              <h1 className="text-2xl font-bold text-gray-900">
                Why Learn with Streller Minds?
              </h1>
              <p className="text-gray-600 my-4 text-md">
                Our platform leverages modern technologies, including React for
                frontend, and Stellar smart contract for decentralized education
                solution
              </p>
              <div className="text-gray-600 grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <div className="mb-4">
                    <h3 className="text-gray-950 text-lg font-semibold">
                      High-Quality Content
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Professionally produced videos that simplify complex
                      blockchain concepts
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-950 text-lg font-semibold">
                      Community Building
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Vibrant community where learners and industry experts
                      collaborate
                    </p>
                  </div>
                </div>
                <div>
                  <div className="mb-4">
                    <h3 className="text-gray-950 text-lg font-semibold">
                      Practical Projects
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Interactive labs and real-world projects to apply
                      theoretical knowledge
                    </p>
                  </div>
                  <div>
                    <h3 className="text-gray-950 text-lg font-semibold">
                      Certification Programs
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Accredited courses offering verifiable credentials
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 relative w-full h-64 md:h-72 lg:h-80 rounded-lg overflow-hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="relative w-full h-full bg-gray-800 rounded-lg cursor-pointer group">
                    <Image
                      src="/thumbnail.png"
                      alt="Video thumbnail"
                      fill
                      className="object-cover opacity-75 group-hover:opacity-60 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button
                        variant="outline"
                        className="absolute left-3 bottom-3 bg-white text-gray-900 hover:bg-gray-100"
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Watch Demo
                      </Button>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <div className="relative aspect-video w-full">
                    <video
                      className="w-full h-full object-cover rounded-md"
                      controls
                      autoPlay
                    >
                      <source src="/videos/demo-video.mp4" type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                  <DialogClose className="absolute top-2 right-2 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Students Say
          </h2>
          <p className="text-lg text-gray-600">
            Join thousands of satisfied learners who have transformed their
            careers with Streller Minds
          </p>
        </div>

        <Carousel className="w-full max-w-3xl mx-auto">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={testimonial.id}
                className={index === activeSlide ? 'block' : 'hidden'}
              >
                <Card className="bg-white">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage
                          src={testimonial.avatarUrl}
                          alt={testimonial.name}
                        />
                        <AvatarFallback>
                          {testimonial.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-lg italic text-gray-800 mb-4">
                          &quot;{testimonial.quote}&quot;
                        </p>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {testimonial.name}
                          </h4>
                          <div className="flex items-center gap-2">
                            <p className="text-gray-600 text-sm">
                              {testimonial.title}, {testimonial.company}
                            </p>
                            <Badge variant="secondary" className="ml-2">
                              Graduate
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex items-center justify-center mt-4">
            <CarouselPrevious
              variant="outline"
              className="relative mr-2"
              onClick={() =>
                setActiveSlide(
                  (current) =>
                    (current - 1 + testimonials.length) % testimonials.length,
                )
              }
            />
            {testimonials.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className={`mx-1 w-3 h-3 p-0 rounded-full ${
                  index === activeSlide ? 'bg-blue-600' : 'bg-gray-300'
                } hover:bg-blue-400`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
            <CarouselNext
              variant="outline"
              className="relative ml-2"
              onClick={() =>
                setActiveSlide((current) => (current + 1) % testimonials.length)
              }
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
