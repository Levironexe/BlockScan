import React, { useState, useEffect } from 'react';
import { OurContributors, PagesExample, RiliabilitySection } from '@/components/index';

const OnScrollSection = () => {
  const [scrollY, setScrollY] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);

  useEffect(() => {
    setWindowHeight(window.innerHeight);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const firstTransitionPoint = windowHeight * 2 + 600;
  const secondTransitionPoint = windowHeight * 3 + 600;
  const thirdTransitionPoint = windowHeight * 4 + 600;

  return (
    <main className='bg-white px-16 w-full'>
      <div className="max-w-screen-2xl mx-auto">

        {/* Section hiển thị ở mọi kích thước màn hình */}
        <section className='pt-[300px] pb-10 text-center max-w-7xl mx-auto'>
          <h2 className='text-gray-800 text-4xl font-bold mb-4'>
            Empowering <span className='bg-gradient-to-r from-primary-red to-pink-600 text-transparent bg-clip-text'>Smart Contract Security</span> with Cutting-Edge Features
          </h2>
          <p className='text-xl text-gray-800/80'>
            Built with cutting-edge security frameworks, our comprehensive scanning suite identifies potential vulnerabilities in Smart Contracts, providing robust protection for web3 projects of any scale.
          </p>
        </section>


        {/* Các phần còn lại sẽ bị ẩn trên điện thoại */}
        <section className='relative h-[400vh] hidden sm:block'>
          {/* Sticky container for images */}
          <div className='sticky'>
            <div className='grid grid-cols-4 gap-10 items-center min-h-screen'>
              <div className='col-span-3'>
                {scrollY < firstTransitionPoint && (
                  <img src='/images/code_example.png' className='rounded-xl w-[95%] shadow-glow-purple animation-block-2'/>
                )}
                {(scrollY > firstTransitionPoint && scrollY < secondTransitionPoint) && (
                  <div className='flex items-center w-full py-auto'>
                    <div className='w-full'>
                      <RiliabilitySection/>
                    </div>
                  </div>
                )}
                {(scrollY > secondTransitionPoint && scrollY < thirdTransitionPoint) && (
                  <PagesExample/>
                )} 
                {(scrollY > thirdTransitionPoint) && (
                  <OurContributors/>
                )}
              </div>
            </div>
          </div>

          {/* Non-sticky text sections */}
          <div className='top-0 right-0 w-1/4 absolute hidden sm:block'>
            <div className='min-h-screen flex items-center'>
              <div className='animation-block'>
                <h2 className='text-purple-800 font-bold text-3xl mb-4'>
                  What are smart contracts?
                </h2>
                <p className='text-gray-800 text-xl'>
                  A smart contract is a self-executing program on a blockchain that automatically enforces agreement terms between parties. It runs exactly as programmed without human intervention, eliminating the need for intermediaries.
                </p>
              </div>
            </div>
            <div className='min-h-screen flex items-center'>
              <div className='animation-block'>
                <h2 className='text-pink-600 font-bold text-3xl mb-4'>
                  Secure and Reliable Blockchain Solution
                </h2>
                <p className='text-gray-800 text-xl'>
                  Get the lowest fees, fastest transactions, powerful APIs, and more.
                </p>
              </div>
            </div>  
            <div className='min-h-screen flex items-center'>
              <div className='animation-block'>
                <h2 className='text-primary-red font-bold text-3xl mb-4'>
                  BlockScan modern analyzing tool
                </h2>
                <p className='text-gray-800 text-xl'>
                  You can easily mitigate the risks by auditing your Smart Contract with Block Scan, a tool that scans your code for vulnerabilities and common attack vectors. The audit process evaluates contract security and identifies potential bugs, helping protect against costly exploits.
                </p>
              </div>
            </div>
            <div className='min-h-screen flex items-center'>
              <div className='animation-block'>
                <h2 className='text-hard-red font-bold text-3xl mb-4'>
                  Our Contributors
                </h2>
                <p className='text-xl'>
                  A collaboration between Slither&apos;s security tools, Swinburne University&apos;s research, <span className='font-semibold mr-1'>Mr. Hieu PC - Cybersecurity specialist</span> and <span className='font-semibold'> BlockScan&apos;s audit experts</span>.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default OnScrollSection;