"use client";

import AnimatedGradientBackground from "@/components/Animated-graded-background";
import { FiArrowRight } from "react-icons/fi"
import { FiPlay } from "react-icons/fi"
import { FiImage } from "react-icons/fi"
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Hero () {

    const [textIndex, setTextIndex] = useState(0);

    const texts = [
        "Master Blockchain on <br /> the <span class='text-[#3B40E0] animated-underline'>Stellar</span> Network",
        "Build Secure Smart <br /> Contracts",
        "Join a Community of <br /> Innovators"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
        }, 10000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <> 
        <section className="relative w-full h-screen overflow-hidden">
                <AnimatedGradientBackground />
                <div className="flex  items-center w-[100%] ml-[40px] mt-[100px]">
                <div className="w-[40%]">
                    <p className="bg-[#3B40E0] text-[12px] text-[#FFFFFF] px-[5px] w-[55%] py-[5px] font-mono rounded-[15px] mt-[30px] mb-[-15px]">
                        Now Enrolling: Stellar Smart Contract Development 
                    </p>
                    <div className="relative w-full h-[200px] overflow-hidden flex justify-center">
                        <motion.p
                            key={textIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                            className="absolute text-[50px] font-mono font-[700] w-full"
                            dangerouslySetInnerHTML={{ __html: texts[textIndex] }} // Render HTML content inside the text
                        />
                    </div>
                    <p className="font-mono text-[#6B7280]">
                    Comprehensive blockchain eduaction with high-quality video content, <br />
                    interactive lab and a vibrant community of learners and experts.
                    </p>
                    <div>
                        <button className="bg-[#3B40E0] px-[40px] py-[12px] border-none rounded-[5px] text-[#FFFFFF] ">
                            Get Started
                            <FiArrowRight className="ml-[15px] pt-[2px]" />
                        </button>
                        <button className="px-[40px] py-[12px] border-none rounded-[5px] bg-[#FFFFFF] ml-[15px] ">
                            <FiPlay className="pr-[10px] pt-[2px] "/>
                            Watch Introduction
                        </button>
                    </div>
                    <div className="flex mt-[10px]">
                        <div className="flex items-center bg-blue-100 p-4 rounded-lg">
                            {[...Array(4)].map((_, i) => (
                                <div
                                key={i}
                                className={`w-[25px] h-[25px] rounded-full bg-[#EDF2F7] border-2 border-[white] shadow-md ${i !== 0 ? "-ml-[8px]" : ""}`}
                                />
                            ))}
                        </div>
                        <p className="text-[#6B7280] text-[12px] ml-[10px]">Join <span className="text-[black]" >2,500</span> learners worldwide</p>
                    </div>
                </div>
                <div className="relative w-[600px] h-[350px] bg-[#d1d5db] rounded-xl shadow-[100%] overflow-hidden right-[-8%] rounded-[10px]">
                
                    <div className="relative flex items-center justify-center mt-[90px]">
                        <div className="w-[64px] h-[64px] bg-[#e5e7eb] rounded-full flex items-center justify-center">
                            <span className="text-[#6b7280] text-[20px]">
                               <FiImage  />
                            </span>
                        </div>
                    </div>

                    <div className="absolute bottom-[10%] w-[85%] h-[15%] ml-[30px] bg-[#111827] text-[#ffffff] rounded-[5px] px-[16px]  flex items-center  ">
                        <div className="w-[24px] h-[24px] bg-[#3b82f6] rounded-full flex items-center justify-center text-[12px]">
                           <FiPlay />
                        </div>
                        <div className="ml-[10px] "> 
                            <p className="font-[600] text-[14px] text-[#ffffff]">
                                Introduction to Stellar Smart Contracts
                            </p>
                            <p className="text-[12px] text-[#d1d5db] mt-[-10px]">
                                Learn the fundamentals of blockchain development on Stellar
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    )
}