import { Cog, LayoutDashboard, Trophy, UserPlus, Users } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    name: 'Easily Add Customers and Manage Their Profiles',
    description: 'Our tool lets you quickly add new customers with all their details, from contact information to subscription preferences. Whether you\'re onboarding a new member or updating an existing one, the process is simple, streamlined, and fast.',
    icon: UserPlus,
    image: '/features/timeline.png'
  },
  {
    name: 'Track Customer Activity Effortlessly',
    description: 'Keep a detailed record of every customer. Access their subscription history, activity log, and even payment records—all stored securely in our system. With everything in one place, managing your customers has never been this easy!',
    icon: Users,
    image: '/features/account.png'
  },
  {
    name: 'Stay Ahead with Customer Ranking and Alerts',
    description: 'Never lose track of expiring subscriptions! Our ranking table sorts customers by their subscription status, so you can prioritize follow-ups and renewals. Be proactive and keep your library running smoothly.',
    icon: Trophy,
    image: '/features/ranking1.png'
  },
  {
    name: 'Automate and Simplify Your Library Operations',
    description: 'Why spend hours on manual processes when our tool can do the work for you? From automated alerts to effortless customer tracking, we take the stress out of managing your library so you can focus on what matters most—your customers.',
    icon: Cog,
    image: '/features/Automate.png'
  },
  {
    name: 'Smart Seat Navigation & Scheduling',
    description: 'Efficiently manage your library space with our intuitive seat allocation system. Assign and track customer seating arrangements while scheduling their preferred time slots for a seamless library experience.',
    icon: LayoutDashboard,
    image: '/features/client-activity.png'
  },
]

export default function Features() {
  return (
    <div id="features" className="bg-white py-24 sm:py-32">
      <div className="mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-semibold text-base text-indigo-600 leading-7">Powerful Features</h2>
          <p className="mt-2 font-bold text-3xl text-gray-900 sm:text-4xl tracking-tight">
            Everything you need to manage your library
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-8">
            Streamline your library operations with our comprehensive set of features designed for modern library management.
          </p>
        </div>
        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-2xl lg:max-w-none">
          <dl className="gap-x-8 gap-y-16 grid grid-cols-1 lg:grid-cols-2 max-w-xl lg:max-w-none">
            {features.map((feature) => (
              <div key={feature.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 font-semibold text-base text-gray-900 leading-7">
                  <feature.icon className="flex-none w-5 h-5 text-indigo-600" aria-hidden="true" />
                  {feature.name}
                </dt>
                <dd className="flex flex-col flex-auto mt-4 text-base text-gray-600 leading-7">
                  <p className="flex-auto">{feature.description}</p>
                  <div className="shadow-lg mt-6 rounded-lg overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.name}
                      width={800}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
} 