"use client";
import React from 'react';
import Link from 'next/link';
import  {motion} from "framer-motion";
import {splitString, UploadForm} from '@/components/index';
import ParticlesComponent from '@/components/utils/particles';

const heading1 = 'Your Trusted Solution';
const heading2 = ' for Fast and Secure Smart Contract Scanning';
const subtitle = 'An advanced smart contract scanning website designed to uncover vulnerabilities within your code.';
const charVariants = {
    hidden: {opacity: 0},
    reveal: {opacity: 1},
}



const Hero = () => {
    const splitHeading1 = splitString(heading1);
    const splitHeading2 = splitString(heading2);
    const splitSubtitle = splitString(subtitle);



    return (
        <main className='max-w-full bg-gradient-to-bl from-black via-black/90 to-black/70 px-16 pt-16 sm:pt-0'>
            <div className="flex flex-col xl:flex-row  min-h-screen items-center max-w-screen-2xl mx-auto">
                <ParticlesComponent id='particles'/>
                {/* Text content */}
                <div className="flex-1 xl:flex-[2] flex items-center justify-center ">
                    <div>
                        <motion.h1
                        className="hero__title text-4xl sm:text-5xl lg:text-6xl xl:text-[64px] leading-relaxed xl:leading-relaxed mb-4 xl:mb-6 animate-fadeUp"
                        initial="hidden"
                        whileInView="reveal"
                        transition={{staggerChildren: 0.02}}
                        
                        >
                            <span
                            className=' text-primary-red '
                            style={{filter: 'drop-shadow(0 0 10px rgba(231, 33, 6, 0.8))',}}>{splitHeading1.map(char =>
                                <motion.span key={char} transition={{duration: 0.5}} variants={charVariants} >
                                    {char}
                                </motion.span>
                            )}</span>
                            <span className="text-white" style={{filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))',}}>
                                {splitHeading2.map(char =>
                                    <motion.span key={char} transition={{duration:0.5}} variants={charVariants}>
                                        {char}
                                    </motion.span>
                                )}
                            </span>
                        </motion.h1>
                        <motion.p 
                            className="hero__subtitle text-white text-lg sm:text-xl lg:text-2xl mb-8 xl:mb-16"
                            initial='hidden'
                            whileInView='reveal'
                            transition={{
                                staggerChildren: 0.01,
                                delayChildren: 1.5,
                            }}
                        >
                            {splitSubtitle.map( char =>
                                <motion.span key={char} transition={{duration: 0.5}} variants={charVariants}>
                                    {char}
                                </motion.span>
                            )}
                        </motion.p>

                    
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 xl:space-x-6 mt-8 xl:mt-14">
                            <UploadForm style=' justify-center text-white/80 rounded-xl text-base sm:text-lg xl:text-[22px] font-normal p-[14px] xl:px-[42px] w-full sm:w-auto hover:bg-white hover:text-white
                            bg-gradient-to-r from-primary-red to-pink-600 shadow-glow-red  hover:shadow-glow-red
                            hover:bg-gradient-to-r  hover:from-primary-red hover:to-primary-red transition-all duration-300'
                            title="Create a project"/>
                            <p className='text-xl sm:text-2xl xl:text-3xl white font-light px-2 xl:px-4'>or </p>
                            <button>
                                <Link href='/projects'>
                                <p className='border-2 border-white py-3 px-5 xl:px-[40px] rounded-xl text-base sm:text-lg xl:text-[20px] font-normal hover:bg-white
                                text-white hover:text-pink-500 transition-colors duration-300 w-full sm:w-auto text-center'>
                                    View your projects
                                </p>
                                </Link>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Video content */}
                <div className="flex-1  flex items-center justify-center xl:justify-end mt-8 xl:mt-0">
                    <video 
                        autoPlay 
                        loop 
                        muted 
                        src="/videos/video-6.mp4" 
                        className="h-[300px] sm:h-[400px] lg:h-[500px] xl:h-[700px] w-full xl:w-auto rounded-[50px] object-cover object-center"
                    />   
                </div>
            </div>

            
            <div className='h-[600px]'>
    <div className='max-w-screen-2xl mx-auto grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-4 pt-[150px]'>
        <div className='flex flex-col items-center'>
        <img src='/images/experts_recommendation.svg' alt='Swinburn audit experts'/>
            <p className='text-center text-[18px] font-semibold mt-2 text-white'>Swinburne Audit Experts</p>
        </div>
        <div className='flex flex-col items-center'>
            <img src='/images/seamless_integration.svg' alt='Seamless Integration'/>
            <p className='text-center text-[18px] font-semibold mt-2 text-white'>Seamless Integration</p>
        </div>
        <div className='flex flex-col items-center'>
            <img src='/images/slither_detectors.svg' alt='93+ Slither Detectors'/>
            <p className='text-center text-[18px] font-semibold mt-2 text-white'>93+ Slither Detectors</p>
        </div>
        <div className='flex flex-col items-center'>
            <img src='/images/audit_report.svg' alt='Generate Audit Reports'/>
            <p className='text-center text-[18px] font-semibold mt-2 text-white'>Generate Audit Reports</p>
        </div>
    </div>
</div>


        
        </main>
    );
};

export default Hero;