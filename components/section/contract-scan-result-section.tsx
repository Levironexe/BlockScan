import React from 'react';
import {CustomButton, SafetyCheck, RadarChart, DonutChart, CopyButton, TokenBasicInfo} from '@/components/index';

const ContractScanResult = () => {
  
  // Handler for redirecting to PDF result
  const handleRedirectToPdf = () => {
    // Replace the URL below with the actual URL of your PDF
    const pdfUrl = '/contract/scanresult';
    // Open the PDF in a new tab
    window.open(pdfUrl, '_blank');
  };

  // Full contract address
  const fullAddress = '0x576e2bed8f7b46d34016198911cdf9886f78bea7';

  // Function to shorten the address for display
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Data for radar chart
  const radarLabels = ['Contract', 'Social', 'Holder', 'Liquidity', 'Governance'];
  const radarScores = [90, 80, 70, 85, 75]; 

  return (
    <section className='bg-white__bg pb-20'>
        <div className='max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8'>
          {/* Contract information header */}
          <div className='flex flex-col lg:flex-row items-center justify-between mb-12 gap-8 shadow-md bg-white p-5 rounded-xl'>
            {/* Token logo and basic info */}
            <div className="flex items-center flex-grow">
              <img src="/images/didi-logo.png" alt="coin logo" width={96} height={96} className="mr-4" />
              <div>
                <div className="flex items-baseline gap-1 pb-1">
                  <h2 className="font-bold text-2xl text-primary-red mr-2">DiDi Coin</h2>
                  <span className="font-bold text-xl text-gray-500">DC</span>
                </div>
                <div className="flex items-center gap-1">
                  <p className="font-normal text-sm text-gray-500 break-all underline">
                    {shortenAddress(fullAddress)}
                  </p>
                  <CopyButton textToCopy={fullAddress} />
                </div>

                {/* Deployment info */}
                <div className="flex items-center text-gray-500 text-sm mt-2">
                  <p>Deployed – Wed, 2 Oct 2024 • Project age 6h</p>
                </div>
              </div>
            </div>

            {/* Risk and safety score information */}
            <div className="flex flex-row justify-between gap-4">
              {/* Left Column */}
              <div className="flex flex-col gap-3 w-3/7">
                <p className="border-2 p-3 rounded-xl bg-white text-black font-bold text-center h-[50px] flex items-center justify-center">
                  Medium Risk: <span className='text-yellow-500 ml-1'>3</span>
                </p>

                <p className="border-2  rounded-xl bg-white text-black font-bold text-center h-[50px] flex items-center justify-center">
                  High Risk: <span className='text-red-600 ml-1'>2</span>
                </p>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-3 w-4/7">
                <p className="border-2 p-3 rounded-xl bg-gradient-to-r from-primary-red via-pink-500 to-purple-600 text-white font-bold text-center h-[50px] flex items-center justify-center">
                  Safety score: 93/100
                </p>

                <p className="border-2 p-3 rounded-xl bg-white text-black font-bold text-center h-[50px] flex items-center justify-center">
                  Attention Required: <span className='text-green-600 ml-1'>8</span>
                </p>
              </div>
            </div>

            {/* Export button */}
            <CustomButton
              icon={<img src='/images/download-2.png' alt='icon' className='w-5 h-5' />}
              title="Export"
              containerStyles=" bg-primary-red text-white rounded-full px-4 py-2 lg:py-3 shadow-glow-red transition-all duration-300 ease-in-out transform hover:scale-105"
              handleClick={handleRedirectToPdf}
            />
          </div>
          
          {/* Main content area */}
          <div className='flex flex-col lg:flex-row gap-8'>
            {/* Safety check component */}
            <div className='flex-[5] lg:w-1/3'>
              <SafetyCheck/>
            </div> 
            {/* Charts and token info */}
            <div className='flex-[4] lg:w-1/3'>
              <RadarChart labels={radarLabels} scores={radarScores} />
              <TokenBasicInfo/>
              <DonutChart/>
            </div>
          </div>
        </div>
      </section>
  )
}

export default ContractScanResult