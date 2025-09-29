'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import AnimatedGradientBackground from '@/components/Animated-graded-background';
import Lottie from 'lottie-react';
import strellerAnimation from '@/asset/Streller.json';
import styled from 'styled-components';

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);

  const texts = [
    "Master Blockchain on the <span class='text-[#ffcc00] font-bold'>Stellar</span> <span class='text-[#5c0f49]'>Network</span>",
    "<span class='text-[#5c0f49]'>Build</span> <span class='text-[#ffcc00]'>Secure Smart</span> <span class='text-[#5c0f49]'>Contracts</span>",
    "<span class='text-[#5c0f49]'>Join a</span> <span class='text-[#ffcc00]'>Community</span> <span class='text-[#5c0f49]'>of Innovators</span>",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const StyledWrapper = styled.div`
    .button {
      cursor: pointer;
      padding: 12px 18px;
      border-radius: 30px;
      border: 5px solid #5c0f49;
      display: inline-block;
      overflow: hidden;
      background: #7a1a5f;
      box-shadow:
        inset 6px 6px 10px rgba(255, 255, 255, 0.3),
        inset -6px -6px 10px rgba(0, 0, 0, 0.3),
        2px 2px 10px rgba(0, 0, 0, 0.3),
        -2px -2px 10px rgba(255, 255, 255, 0.2);
      transition:
        box-shadow 0.3s ease,
        transform 0.1s ease;
    }

    .button span {
      font-family: 'monospace';
      font-weight: 900;
      font-size: 24px;
      color: #ffcc00;
      text-shadow:
        1px 1px 1px rgba(0, 0, 0, 0.4),
        -1px -1px 1px rgba(255, 255, 255, 0.2);
      position: relative;
      display: inline-block;
      transition: transform 0.3s ease-out;
      z-index: 1;
      padding: 0px 4px;
    }

    .button span:nth-child(1)::before {
      transition-delay: 0ms;
    }
    .button span:nth-child(2)::before {
      transition-delay: 100ms;
    }
    .button span:nth-child(3)::before {
      transition-delay: 200ms;
    }
    .button span:nth-child(4)::before {
      transition-delay: 300ms;
    }

    .button:hover span {
      color: #ffffff;
    }

    .button:active span {
      color: #ffcc00;
      text-shadow:
        1px 1px 1px rgba(255, 255, 255, 0.5),
        -1px -1px 2px rgba(0, 0, 0, 0.5);
    }

    .button span:hover {
      transform: translateY(-7px);
    }

    .button:active {
      box-shadow:
        inset 2px 2px 1px rgba(0, 0, 0, 0.3),
        inset -2px -2px 1px rgba(255, 255, 255, 0.5);
      transform: scale(0.98);
    }
  `;

  return (
    <div className="relative overflow-hidden bg-[#f3f6f8] py-12 md:py-16 min-h-[600px] flex items-center">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <AnimatedGradientBackground />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-start">
          {/* Text content - Left aligned */}
          <div className="flex flex-col space-y-8 max-w-2xl">
            <div>
              <div className="inline-block mb-6">
                <p className="bg-gradient-to-r from-[#5c0f49] to-[#7a1a5f] text-[#ffcc00] px-4 py-2 font-mono rounded-full text-sm tracking-wide shadow-md border border-[#ffcc00]/20 animate-pulse hover:animate-none transition-all duration-300 hover:shadow-lg hover:shadow-[#ffcc00]/10 overflow-hidden">
                  <span className="font-semibold relative inline-block overflow-hidden">
                    Now Enrolling:
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffcc00] animate-shimmer"></span>
                  </span>
                  <span className="relative inline-block overflow-hidden group">
                    Stellar Smart Contract Development
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#ffcc00] group-hover:w-full transition-all duration-700"></span>
                  </span>
                </p>
              </div>

              <div className="relative w-full h-[100px] sm:h-[120px] md:h-[150px] overflow-hidden">
                <motion.p
                  key={textIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                  className="absolute text-4xl sm:text-5xl md:text-6xl font-mono font-bold w-full text-left leading-tight tracking-tight bg-gradient-to-r from-[#333] to-[#444] bg-clip-text text-transparent"
                  dangerouslySetInnerHTML={{ __html: texts[textIndex] }}
                />
              </div>

              <p className="mt-6 max-w-xl text-lg text-gray-600">
                Comprehensive blockchain education with high-quality video
                content, interactive labs and a vibrant community of learners
                and experts.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <StyledWrapper>
                <button className="button">
                  <span>J</span>
                  <span>O</span>
                  <span>I</span>
                  <span>N</span>
                </button>
              </StyledWrapper>

              <StyledWrapper>
                <button className="button">
                  <span>W</span>
                  <span>A</span>
                  <span>T</span>
                  <span>C</span>
                  <span>H</span>
                  <span className="ml-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </button>
              </StyledWrapper>
            </div>

            <div className="flex items-center">
              <div className="flex items-center bg-gradient-to-r from-[#5c0f49]/10 to-[#7a1a5f]/10 p-4 rounded-lg border border-[#ffcc00]/20 backdrop-blur-sm shadow-lg">
                <div className="flex items-center">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#5c0f49] to-[#7a1a5f] border-2 border-[#ffcc00] shadow-md relative overflow-hidden ${i !== 0 ? '-ml-[12px]' : ''}`}
                    >
                      <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                    </div>
                  ))}
                  <div className="ml-2 w-[30px] h-[30px] rounded-full bg-[#ffcc00]/20 border-2 border-[#ffcc00] shadow-md flex items-center justify-center">
                    <span className="text-[#5c0f49] text-xs font-bold">+</span>
                  </div>
                </div>
                <div className="ml-4 flex flex-col">
                  <p className="text-[#5c0f49] font-mono text-sm">
                    Join{' '}
                    <span className="text-[#ffcc00] font-bold">2,500+</span>{' '}
                    <span className="relative">
                      learners
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-[#ffcc00]/50"></span>
                    </span>
                  </p>
                  <p className="text-[#5c0f49]/70 text-xs">
                    worldwide community
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Animation - Right side */}
          <div className="hidden lg:flex items-center justify-center mt-10 lg:mt-0">
            <div className="w-[450px] h-[500px]">
              <Lottie
                animationData={strellerAnimation}
                loop={true}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
