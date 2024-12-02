"use client"
import React from 'react'
import { useScanning, ScanningNotification, UploadForm } from '@/components/index'


//component that handles address searching feature and uploading file
const SmartScanning = () => {
  const { isScanning} = useScanning();


  return (
    <div className='w-full bg-black pt-24 px-16'>

      <div className='flex flex-col mb-8 max-w-screen-2xl mx-auto'>
        <div>
          {/*Section title*/}
          <h1 className='text-white text-3xl sm:text-4xl lg:text-6xl mt-4 lg:mt-8 font-bold text-shadow-weak-ass-glow' style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))' }}>
            Smart scanner
          </h1>
          <div className='flex flex-col sm:flex-row sm:flex-wrap justify-between items-end gap-2 sm:gap-4 text-subtitle__gray font-bold text-sm sm:text-base'>
            <div className='flex items-center'>
              <span>Leverage advanced algorithms</span>
              <span className='hidden sm:inline px-1 text-2xl font-light'>|</span>
              <span>Identify key contract insights</span>
              <span className='hidden sm:inline px-1 text-2xl font-light'>|</span>
              <span>Optimize processes</span>
            </div>
            <div>
              {/* Upload button for uploading contract file */}
              <UploadForm title='Create a project' style='rounded-xl p-2 px-8  border-2 border-white shadow-weak-ass-glow bg-black text-white transition-all duration-300 ease-in-out transform hover:scale-105 sm:hover:scale-y-110'/>
            </div>
          </div>
        </div>
      </div>

      {/* Display scanning notification if scanning is in progress */}
      {isScanning && <ScanningNotification />}
      

    </div>
  )
}

export default SmartScanning