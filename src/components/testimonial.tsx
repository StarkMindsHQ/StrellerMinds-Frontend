/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
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
import { X, Play, Star, CheckCircle2 } from 'lucide-react';
import styled from 'styled-components';

// Custom Watch Demo Button Component
const WatchDemoButton = () => {
  return (
    <WatchButtonWrapper>
      <button className="btn">Watch Demo</button>
    </WatchButtonWrapper>
  );
};

const WatchButtonWrapper = styled.div`
  .btn {
    width: 8.5em;
    height: 2.3em;
    margin: 0.5em;
    background: #5c0f49;
    color: white;
    border: none;
    border-radius: 0.625em;
    font-size: 20px;
    font-weight: bold;
    cursor: pointer;
    position: relative;
    z-index: 1;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  button:hover {
    color: #5c0f49;
  }

  button:after {
    content: '';
    background: white;
    position: absolute;
    z-index: -1;
    left: -20%;
    right: -20%;
    top: 0;
    bottom: 0;
    transform: skewX(-45deg) scale(0, 1);
    transition: all 0.5s;
  }

  button:hover:after {
    transform: skewX(-45deg) scale(1, 1);
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
  }
`;

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  title: string;
  company: string;
  avatarUrl: string;
}

// Throttle function for mouse movement
const throttle = (func: (e: MouseEvent) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;

  return function (...args: [MouseEvent]) {
    const currentTime = Date.now();

    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(
        () => {
          func(...args);
          lastExecTime = Date.now();
        },
        delay - (currentTime - lastExecTime),
      );
    }
  };
};

export default function TestimonialsSection() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check for reduced motion preference
  const shouldReduceMotion = useReducedMotion();

  // Apply reduced motion only to background animations, keep UI animations
  const ANIMATED_PARTICLES_COUNT = shouldReduceMotion ? 0 : 6;
  const FLOATING_CIRCLES_COUNT = shouldReduceMotion ? 0 : 6;

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

  // Optimized mouse tracking with throttling
  const throttledMouseMove = useCallback(
    throttle((e: MouseEvent) => {
      if (!shouldReduceMotion) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    }, 16),
    [shouldReduceMotion],
  );

  useEffect(() => {
    if (!shouldReduceMotion) {
      window.addEventListener('mousemove', throttledMouseMove);
      return () => {
        window.removeEventListener('mousemove', throttledMouseMove);
      };
    }
  }, [throttledMouseMove, shouldReduceMotion]);

  // Handle video play/pause events
  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  // Animation variants for better performance
  const particleVariants = {
    animate: {
      x: ['0%', '100%', '0%'],
      y: ['0%', '100%', '0%'],
      transition: {
        duration: shouldReduceMotion ? 0 : 25,
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: 'linear',
      },
    },
  };

  const floatingVariants = {
    animate: {
      x: ['0%', '10%', '0%'],
      y: ['0%', '15%', '0%'],
      transition: {
        duration: shouldReduceMotion ? 0 : 20,
        repeat: shouldReduceMotion ? 0 : Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <>
      {/* Why Learn Section */}
      <section className="py-16 bg-gradient-to-b from-white to-[#f8f0f5] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute h-full w-full bg-[url('/patterns/circuit-board.svg')] bg-repeat opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Card className="bg-white/90 backdrop-blur-sm border-none rounded-2xl shadow-xl overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 p-8 md:p-12">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-900 to-pink-600 bg-clip-text text-transparent mb-6">
                    Why Learn with Streller Minds?
                  </h2>
                  <p className="text-gray-700 mb-8 text-lg">
                    Our platform leverages modern technologies, including React
                    for frontend and Stellar smart contracts for decentralized
                    education solutions that transform how you learn blockchain.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    {[
                      {
                        title: 'High-Quality Content',
                        description:
                          'Professionally produced videos that simplify complex blockchain concepts',
                      },
                      {
                        title: 'Practical Projects',
                        description:
                          'Interactive labs and real-world projects to apply theoretical knowledge',
                      },
                      {
                        title: 'Community Building',
                        description:
                          'Vibrant community where learners and industry experts collaborate',
                      },
                      {
                        title: 'Certification Programs',
                        description:
                          'Accredited courses offering verifiable credentials',
                      },
                    ].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: index * 0.1,
                          duration: 0.5,
                          ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                        viewport={{ once: true }}
                        className="flex gap-3"
                      >
                        <div className="mt-1 flex-shrink-0">
                          <CheckCircle2 className="h-5 w-5 text-pink-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="md:w-1/2 relative min-h-[400px]">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 to-pink-600/90">
                    <motion.div
                      className="absolute inset-0 mix-blend-overlay opacity-20"
                      animate={{
                        backgroundPosition: ['0% 0%', '100% 100%'],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: 'reverse',
                      }}
                    >
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <pattern
                            id="grid"
                            width="10"
                            height="10"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 10 0 L 0 0 0 10"
                              fill="none"
                              stroke="white"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100" height="100" fill="url(#grid)" />
                      </svg>
                    </motion.div>

                    {/* Animated particles */}
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute rounded-full bg-white/30"
                        initial={{
                          x: Math.random() * 100 + '%',
                          y: Math.random() * 100 + '%',
                          scale: Math.random() * 0.3 + 0.1,
                        }}
                        animate={{
                          x: [
                            Math.random() * 100 + '%',
                            Math.random() * 100 + '%',
                            Math.random() * 100 + '%',
                          ],
                          y: [
                            Math.random() * 100 + '%',
                            Math.random() * 100 + '%',
                            Math.random() * 100 + '%',
                          ],
                        }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                        style={{
                          width: Math.random() * 10 + 5 + 'px',
                          height: Math.random() * 10 + 5 + 'px',
                          filter: 'blur(' + (Math.random() * 2 + 1) + 'px)',
                        }}
                      />
                    ))}
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group">
                        <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg">
                          {!shouldReduceMotion && (
                            <div className="absolute inset-0 rounded-full animate-ping bg-white/20 opacity-75"></div>
                          )}
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 mt-6">
                          <WatchDemoButton />
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-2xl p-0 bg-black border-none overflow-hidden rounded-xl">
                      <div className="relative aspect-video w-full">
                        <video
                          ref={videoRef}
                          className="w-full h-full object-cover"
                          controls
                          autoPlay
                          onPlay={handleVideoPlay}
                          onPause={handleVideoPause}
                        >
                          <source
                            src="/videos/demo-video.mp4"
                            type="video/mp4"
                          />
                          Your browser does not support video playback.
                        </video>

                        {!isVideoPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-700 to-pink-600 flex items-center justify-center">
                              <Play className="h-8 w-8 text-white fill-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogClose className="absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center bg-black/50 text-white hover:bg-black/70 transition-colors">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonials Section - With dynamic background */}
      <section
        className="py-20 px-4 relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #dfb1cc 0%, #e9c6db 50%, #f0d6e6 100%)`,
        }}
      >
        {/* Optimized animated background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Reduced animated circles from 15 to 8 */}
          {Array.from({ length: FLOATING_CIRCLES_COUNT }, (_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-20"
              initial={{
                x: Math.random() * 100 + '%',
                y: Math.random() * 100 + '%',
                scale: Math.random() * 0.5 + 0.5,
              }}
              animate={{
                x: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
                y: [
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                  Math.random() * 100 + '%',
                ],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                width: Math.random() * 150 + 50 + 'px',
                height: Math.random() * 150 + 50 + 'px',
                filter: 'blur(' + (Math.random() * 30 + 5) + 'px)',
              }}
            />
          ))}

          {/* Interactive gradient overlay that follows mouse */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-pink-300/30 to-transparent"
            animate={{
              background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(236, 72, 153, 0.15) 0%, rgba(223, 177, 204, 0) 50%)`,
            }}
            transition={{ type: 'spring', damping: 15 }}
          />

          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] opacity-5"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Testimonials Section */}
          <div className="text-center mb-12">
            <Badge
              variant="outline"
              className="mb-4 px-4 py-1 bg-white/30 backdrop-blur-sm text-purple-900 border-purple-200"
            >
              TESTIMONIALS
            </Badge>
            <h2 className="text-4xl font-bold text-purple-900 mb-4">
              What Our Students Say
            </h2>
            <p className="text-lg text-purple-800 max-w-2xl mx-auto">
              Join thousands of satisfied learners who have transformed their
              careers with Streller Minds
            </p>
          </div>

          <Carousel className="w-full max-w-4xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem
                  key={testimonial.id}
                  className={index === activeSlide ? 'block' : 'hidden'}
                >
                  <motion.div
                    key={`testimonial-${testimonial.id}-${activeSlide}`}
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                  >
                    <Card className="bg-white/95 backdrop-blur-sm border-none rounded-2xl shadow-xl overflow-hidden">
                      <CardContent className="p-8 md:p-10">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                          <div className="flex-shrink-0">
                            <div className="relative">
                              <div className="absolute -inset-1 bg-gradient-to-br from-purple-600 to-pink-500 rounded-full blur opacity-30"></div>
                              <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-white relative">
                                <AvatarImage
                                  src={testimonial.avatarUrl}
                                  alt={testimonial.name}
                                />
                                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-pink-500 text-white text-xl">
                                  {testimonial.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <div className="hidden md:flex flex-col items-center mt-4 space-y-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-5 w-5 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                          </div>

                          <div className="flex-1">
                            <div className="flex md:hidden mb-4 space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>

                            <p className="text-xl md:text-2xl italic text-gray-800 mb-6 leading-relaxed">
                              &quot;{testimonial.quote}&quot;
                            </p>

                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <h4 className="font-bold text-xl text-gray-900">
                                  {testimonial.name}
                                </h4>
                                <p className="text-gray-600">
                                  {testimonial.title}, {testimonial.company}
                                </p>
                              </div>
                              <Badge className="mt-2 md:mt-0 self-start md:self-auto bg-gradient-to-r from-purple-600 to-pink-500 text-white border-none px-3 py-1">
                                Graduate
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex items-center justify-center mt-8">
              <div className="flex items-center gap-4">
                <CarouselPrevious
                  variant="outline"
                  className="relative mr-2 h-10 w-10 rounded-full border-purple-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-110 transition-all"
                  onClick={() =>
                    setActiveSlide(
                      (current) =>
                        (current - 1 + testimonials.length) %
                        testimonials.length,
                    )
                  }
                />

                <div className="flex items-center gap-3">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveSlide(index)}
                      className="group focus:outline-none"
                      aria-label={`Go to slide ${index + 1}`}
                    >
                      <div className="relative h-3 w-12 overflow-hidden rounded-full bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full"
                          initial={{
                            width: index === activeSlide ? '100%' : '0%',
                          }}
                          animate={{
                            width: index === activeSlide ? '100%' : '0%',
                          }}
                          transition={{
                            duration: index === activeSlide ? 5 : 0.3,
                            ease: 'linear',
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>

                <CarouselNext
                  variant="outline"
                  className="relative ml-2 h-10 w-10 rounded-full border-purple-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 hover:scale-110 transition-all"
                  onClick={() =>
                    setActiveSlide(
                      (current) => (current + 1) % testimonials.length,
                    )
                  }
                />
              </div>
            </div>
          </Carousel>
        </div>
      </section>
    </>
  );
}
