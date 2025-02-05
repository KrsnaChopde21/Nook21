'use client'

import { useAuth } from '@/lib/contexts/AuthContext'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const { user } = useAuth()
  const router = useRouter()

  const handleGetStarted = () => {
    if (user) {
      router.push('/dashboard/customers')
    } else {
      router.push('/login')
    }
  }

  return (
    <div className="relative bg-white overflow-hidden isolate">
      <div className="lg:flex mx-auto px-6 lg:px-8 lg:py-40 pt-10 pb-24 sm:pb-32 max-w-7xl">
        <div className="flex-shrink-0 mx-auto lg:mx-0 lg:pt-8 max-w-2xl lg:max-w-xl">
          <div className="mt-24 sm:mt-32 lg:mt-16">
            <a href="#" className="inline-flex space-x-6">
              <span className="bg-nook-500/10 px-3 py-1 rounded-full ring-1 ring-nook-500/10 ring-inset font-semibold text-nook-500 text-sm leading-6">
                What&apos;s new
              </span>
              <span className="inline-flex items-center space-x-2 font-medium text-gray-600 text-sm leading-6">
                <span>Just shipped v1.0</span>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </span>
            </a>
          </div>
          <h1 className="mt-10 font-bold text-4xl text-gray-900 sm:text-6xl tracking-tight">
            Your Library&apos;s Digital Manager
          </h1>
          <p className="mt-6 text-gray-600 text-lg leading-8">
            Our Library Management SaaS is a cutting-edge tool designed to make library operations effortless. 
            From adding customers to tracking their subscriptions and rankings, we ensure your library stays 
            organized and secure. Say goodbye to manual work and hello to a seamless experience!
          </p>
          <div className="flex items-center gap-x-6 mt-10">
            <button
              onClick={handleGetStarted}
              className="bg-nook-500 hover:bg-nook-600 shadow-sm px-3.5 py-2.5 rounded-md font-semibold text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nook-500"
            >
              {user ? 'Go to Dashboard' : 'Get started'}
            </button>
            <a href="#features" className="font-semibold text-gray-900 text-sm leading-6">
              Learn more <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div className="flex lg:flex-none mx-auto mt-16 sm:mt-24 lg:mt-0 lg:mr-0 lg:ml-10 xl:ml-32 max-w-2xl lg:max-w-none">
          <div className="flex-none w-full max-w-3xl sm:max-w-5xl lg:max-w-none">
            <div className="relative mx-auto w-full max-w-[800px]">
              <Image
                src="/record.png"
                alt="NOOK - Start Managing Your Library Better Today"
                width={800}
                height={450}
                className="shadow-2xl rounded-md w-full h-auto object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 