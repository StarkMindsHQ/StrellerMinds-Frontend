"use client";

import React from 'react';
import { BookOpen, Code, Users, Layers } from 'lucide-react';
import styled from 'styled-components';

const StyledWrapper = styled.div`
  display: block;
  margin: 0;
  padding: 0;
  
  .card-title { 
    color: #262626; 
    font-size: 1.5em; 
    line-height: normal; 
    font-weight: 700; 
    margin-bottom: 0.5em; 
  } 

  .small-desc { 
    font-size: 1em; 
    font-weight: 400; 
    line-height: 1.5em; 
    color: #452c2c; 
  } 

  .go-corner { 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    position: absolute; 
    width: 2em; 
    height: 2em; 
    overflow: hidden; 
    top: 0; 
    right: 0; 
    background: linear-gradient(135deg, #7a1a5f, #5c0f49); 
    border-radius: 0 4px 0 32px; 
  } 

  .go-arrow { 
    margin-top: -4px; 
    margin-right: -4px; 
    color: #ffcc00; 
    font-family: courier, sans; 
  } 

  .card { 
    display: block; 
    position: relative; 
    height: 100%;
    min-height: 200px;
    background-color: #f2f8f9; 
    border-radius: 10px; 
    padding: 2em 1.2em; 
    margin: 12px; 
    text-decoration: none; 
    z-index: 0; 
    overflow: hidden; 
    background: linear-gradient(to bottom, #f3f6f8, #e8edf0); 
    font-family: Arial, Helvetica, sans-serif; 
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  } 
  
  .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }

  .card:before { 
    content: ''; 
    position: absolute; 
    z-index: -1; 
    top: -16px; 
    right: -16px; 
    background: linear-gradient(135deg, #7a1a5f, #5c0f49); 
    height: 32px; 
    width: 32px; 
    border-radius: 32px; 
    transform: scale(1); 
    transform-origin: 50% 50%; 
    transition: transform 0.35s ease-out; 
  } 

  .card:hover:before { 
    transform: scale(28); 
  } 

  .card:hover .small-desc { 
    transition: all 0.5s ease-out; 
    color: rgba(255, 255, 255, 0.8); 
  } 

  .card:hover .card-title { 
    transition: all 0.5s ease-out; 
    color: #ffffff; 
  }
  
  .icon-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
    position: relative;
    z-index: 1;
  }
  
  .icon {
    color: #5c0f49;
    transition: all 0.5s ease-out;
  }
  
  .card:hover .icon {
    color: #ffcc00;
  }
`;

export default function FeatureCards() {
  const features = [
    {
      title: "Comprehensive Curriculum",
      description: "From blockchain fundamentals to advanced smart contract development on Stellar.",
      icon: <BookOpen className="h-8 w-8 icon" />
    },
    {
      title: "Interactive Learning",
      description: "Hands-on labs and real-world projects built with Soroban on the Stellar network.",
      icon: <Code className="h-8 w-8 icon" />
    },
    {
      title: "Vibrant Community",
      description: "Connect with peers, mentors, and industry experts in our growing blockchain ecosystem.",
      icon: <Users className="h-8 w-8 icon" />
    },
    {
      title: "Stellar Integration",
      description: "Built on Stellar blockchain with secure smart contracts for credentialing and token management.",
      icon: <Layers className="h-8 w-8 icon" />
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">Our Platform Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <StyledWrapper key={index}>
              <div className="card">
                <div className="icon-container">
                  {feature.icon}
                </div>
                <p className="card-title">{feature.title}</p>
                <p className="small-desc">{feature.description}</p>
                <div className="go-corner">
                  <div className="go-arrow">→</div>
                </div>
              </div>
            </StyledWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}