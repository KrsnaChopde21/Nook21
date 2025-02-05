import { Clock, HeartHandshake, ShieldCheck, Users } from 'lucide-react'

const benefits = [
  {
    name: 'Save Time',
    description: 'Automate routine tasks and streamline your workflow. Let our tool handle the repetitive work while you focus on growing your library.',
    icon: Clock,
    stat: '75%',
    statText: 'reduction in administrative tasks'
  },
  {
    name: 'Increase Retention',
    description: 'Track subscriptions proactively and engage with customers at the right time. Never miss a renewal opportunity.',
    icon: Users,
    stat: '40%',
    statText: 'improvement in customer retention'
  },
  {
    name: 'Reduce Errors',
    description: 'Centralize your data management and eliminate manual entry errors. Keep your records accurate and up-to-date.',
    icon: ShieldCheck,
    stat: '99.9%',
    statText: 'data accuracy rate'
  },
  {
    name: 'Better Service',
    description: 'Understand customer activity patterns and preferences to provide personalized service that keeps them coming back.',
    icon: HeartHandshake,
    stat: '90%',
    statText: 'customer satisfaction rate'
  }
]

export default function BenefitsSection() {
  return (
    <div id="benefits" className="bg-white py-24 sm:py-32">
      <div className="mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-semibold text-base text-nook-500 leading-7">
            Benefits
          </h2>
          <p className="mt-2 font-bold text-3xl text-gray-900 sm:text-4xl tracking-tight">
            Why Library Owners Love Our Tool
          </p>
        </div>

        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-2xl lg:max-w-none">
          <dl className="gap-x-8 gap-y-16 grid grid-cols-1 lg:grid-cols-2">
            {benefits.map((benefit) => (
              <div
                key={benefit.name}
                className="relative bg-white pl-16 transition-transform duration-300 hover:scale-105"
              >
                <div className="top-0 left-0 absolute flex justify-center items-center bg-nook-500 rounded-lg w-12 h-12">
                  <benefit.icon className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <dt className="font-semibold text-gray-900 text-xl leading-7">
                  {benefit.name}
                </dt>
                <dd className="mt-2 text-base text-gray-600 leading-7">
                  {benefit.description}
                </dd>
                <div className="flex items-baseline gap-x-2 mt-4">
                  <p className="font-bold text-3xl text-nook-500 tracking-tight">
                    {benefit.stat}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {benefit.statText}
                  </p>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="inline-flex bg-gray-50 p-2 rounded-lg">
            <p className="text-gray-900 text-sm leading-6">
              Ready to transform your library management? 
              <a href="#" className="ml-2 font-semibold text-nook-500 hover:text-nook-600">
                Get started today <span aria-hidden="true">→</span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 