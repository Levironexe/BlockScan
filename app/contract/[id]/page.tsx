"use client";
import React from 'react';
import RadarChart from '@/components/chart/RadarChart';
import CustomButton from '@/components/CustomButton';
import DonutChart from '@/components/chart/DonutChart'

const Page = () => {
  // Fake data for the Radar Chart
  const radarLabels = ['Contract', 'Social', 'Holder', 'Liquidity', 'Governance'];
  const radarScores = [90, 80, 70, 85, 75]; // Sample scores, update as needed

  const fakeResults = [
    { check: 'No vulnerable withdrawal functions found', status: '/images/check-2.png', bg: 'bg-primary-red'},
    { check: 'No reentrancy risk found', status: '/images/check-2.png', bg: 'bg-primary-red'},
    { check: 'No locks detected', status: '/images/check-2.png',bg: 'bg-primary-red' },
    { check: 'Verified source code found', status: '/images/check-2.png',bg: 'bg-primary-red' },
    { check: 'No mintable risks found', status: '/images/check-2.png',bg: 'bg-primary-red' },
    { check: 'Ownership is renounced', status: '/images/cross-2.png',bg: 'bg-black' },
    { check: 'No blacklisted functions found', status: '/images/check-2.png', bg: 'bg-primary-red'},
    { check: 'No proxy contract detected', status: '/images/check-2.png' ,bg: 'bg-primary-red'},
    { check: 'Liquidity locked', status: '/images/check-2.png', bg: 'bg-primary-red'},
    { check: 'Audit report found', status: '/images/cross-2.png', bg: 'bg-black' },
  ];

  const handleScroll = () => {
    // Add your scroll logic here
  };

  return (
    <main className='bg-black min-h-screen '>
      <section className='max-w-6xl mx-auto'>
        <div className='flex flex-col lg:flex-row justify-between mb-8'>
          <div>
            <h1 className='text-white text-4xl lg:text-6xl mt-4 lg:mt-8 mb-4 font-bold text-shadow-weak-ass-glow' style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}>
              Smart scanning
            </h1>
            <div className='flex flex-col lg:flex-row text-subtitle__grey font-bold text-sm lg:text-base'>
              <span>Leverage advanced algorithms</span>
              <span className='hidden lg:inline mx-4'>|</span>
              <span>Identify key contract insights</span>
              <span className='hidden lg:inline mx-4'>|</span>
              <span>Optimize processes</span>
            </div>
          </div>
        </div>
        <div className='flex flex-col lg:flex-row items-center gap-4 mb-8 mt-16'>
          <input
            type="text"
            placeholder="Search a contract"
            className="w-full lg:w-auto flex-grow rounded p-2 border-2 border-white shadow-weak-ass-glow bg-black white"
          />
          <label className='text-center white rounded p-2 border-2 border-white shadow-weak-ass-glow cursor-pointer'>
            Upload
            <input type="file" accept='.sol' className='hidden' />
          </label>
        </div>
      </section>
      
      <section className='bg-white__bg'>
        <div className='max-w-6xl mx-auto lg:py-8'>
          <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 mb-8'>
          <div className="flex items-center flex-grow">
              <img src="/images/ddcoin.png" alt="coin logo" width={96} height={96} className="mr-4" />
              <div>
                <div className="flex items-baseline gap-3 pb-2">
                  <h2 className="font-bold text-2xl text-primary-red">DiDi Coin</h2>
                  <span className="font-normal text-xl text-gray-500">DC</span>
                </div>
                <p className="font-normal text-xs text-gray-500 break-all">
                  0x2260fac5e5542a773aa44fbcfedf7c193bc2c599
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="border-2 p-3 rounded-lg bg-white text-primary-red font-bold text-center">
                Safety score: 93/100
              </p>
              <p className="border-2 p-3 rounded-lg bg-primary-red text-white font-bold text-center">
                Attention required: 1
              </p>
            </div>
            <CustomButton
              icon={<img src='/images/download-2.png' alt='icon' className='w-5 h-5' />}
              title="Export"
              containerStyles="bg-primary-red text-white rounded-full px-4 py-2 lg:py-3 shadow-glow-red"
              handleClick={handleScroll} // Works since CustomButton is a Client Component
            />
          </div>
          
          <hr className='my-8 border-slate-200' />
          
          <div className='flex flex-col lg:flex-row gap-8'>
            <div className='flex-[6]'>
              <ul className='space-y-4'>
                {fakeResults.map((result, index) => (
                  <li key={index} className='p-4 lg:p-6 rounded-lg bg-white border border-slate-200'>
                    <div className='flex items-center'>
                      <img src={result.status} alt='checking symbol' className={`p-2 rounded-lg mr-4 ${result.bg}`} />
                      <p className='font-bold text-lg lg:text-xl'>{result.check}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            
            <div className='flex-[4] lg:w-1/3'>
              <RadarChart labels={radarLabels} scores={radarScores} /> {/* Passing the dynamic data */}
              <DonutChart/>
              <p className='text-center lg:text-left'>Additional information or charts can go here</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Page;