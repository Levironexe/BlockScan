import React from 'react'
import {Facebook, Github} from 'lucide-react'
import {motion} from 'framer-motion'
const MeetTheTeam = () => {
    const fadeUp = {
        hidden: {opacity: 0, y: 100},
        reveal: {opacity: 1, y: 0},
    }
  return (
    <main className='overflow-hidden bg-white min-h-fit w-full p-16'>
            
    <div className='max-w-screen-2xl mx-auto text-center pb-10'>
        <h2 className='text-gray-800 font-bold text-4xl mb-4'>Meet the <span className='bg-gradient-to-r from-primary-red to-pink-600 text-transparent bg-clip-text'>Team</span></h2>
        <p className='text-xl text-subtitle__gray'>We are always willing to listen to everyone!</p>
    </div>
    <section className="max-w-screen-2xl mx-auto py-20 first-line:flex flex-col smp:flex-row gap-12  z-50" >
        <motion.div 
        className="flex flex-col gap-10 justify-center items-center xl:items-start xl:flex-row xl:gap-20 xl:mb-0"
        initial='hidden'
        whileInView='reveal'
        transition={{ staggerChildren: 0.2 }}>
            <motion.div
            className='flex flex-col items-center p-4 space-y-2'
            transition={{duration: 0.5, delay: 0.1}}
            variants={fadeUp}>
                <div className='border-b-[6px] border-b-primary-red rounded-full shadow-xl mb-4'>
                    <img src='/images/member_1.jpg' className='h-[170px] w-[170px] rounded-full shadow-weak-ass-glow'/>
                </div>
                <div className='text-center'>
                    <p className='text-xl text-gray-800 font-semibold'>Nguyen Thien Phuoc</p>
                    <p className='text-xl text-subtitle__gray'>Founder & CEO</p>
                </div>
                <div className='flex space-x-2 h-5 '>
                    <a href='https://www.facebook.com/profile.php?id=61566144360040' target='_blank'>
                    <Facebook className='text-subtitle__gray w-7 h-7 hover:scale-105 duration-200 transition-all'/>
                    </a>
                    <a href='https://github.com/Levironexe' target='_blank'>
                    <Github className='text-subtitle__gray w-7 h-7 hover:scale-105 duration-200 transition-all'/>
                    </a>
                </div>
            </motion.div>
            <motion.div
            className='flex flex-col items-center p-4 space-y-2'
            transition={{duration: 0.5, delay: 0.25}}
            variants={fadeUp}>
                <div className='border-b-[6px] border-b-primary-red rounded-full shadow-xl mb-4'>
                    <img src='/images/member_2.jpg' className='h-[170px] w-[170px] rounded-full shadow-weak-ass-glow'/>
                </div>
                <div className='text-center'>
                    <p className='text-xl text-gray-800 font-semibold'>Viet Nguyen</p>
                    <p className='text-xl text-subtitle__gray'>Co-Founder</p>
                </div>
                <div className='flex space-x-2 h-5 '>
                    <a href='https://www.facebook.com/vxtduckie' target='_blank'>
                    <Facebook className='text-subtitle__gray w-7 h-7 hover:scale-105 duration-200 transition-all'/>
                    </a>
                    <a href='https://github.com/VxTDuckie/BlockScan' target='_blank'>
                    <Github className='text-subtitle__gray w-7 h-7 hover:scale-105 duration-200 transition-all'/>
                    </a>
                </div>
            </motion.div>
        </motion.div> 
    </section>
    


</main>


  )
}

export default MeetTheTeam