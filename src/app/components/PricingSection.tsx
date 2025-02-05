import { Check } from 'lucide-react'

const tiers = [
  {
    name: 'Free Trial',
    id: 'free',
    priceMonthly: '₹0',
    description: '20 days free trial to explore all features',
    features: [
      'Basic customer management',
      'Subscription tracking',
      'Customer profiles',
      'Basic analytics',
      'Email support'
    ],
    cta: 'Start free trial',
    mostPopular: false,
  },
  {
    name: 'Starter',
    id: 'starter',
    priceMonthly: '₹1,499',
    description: 'Perfect for small libraries getting started',
    features: [
      'All Free Trial features',
      'Advanced customer management',
      'Subscription alerts',
      'Payment tracking',
      'Priority email support'
    ],
    cta: 'Get started',
    mostPopular: true,
  },
  {
    name: 'Pro',
    id: 'pro',
    priceMonthly: '₹14,999/year',
    description: 'Save ₹3,000 with annual billing',
    features: [
      'All Starter features',
      'Advanced analytics',
      'Customer ranking system',
      'Bulk operations',
      '24/7 phone support'
    ],
    cta: 'Go Pro',
    mostPopular: false,
  },
  {
    name: 'Enterprise',
    id: 'enterprise',
    priceMonthly: 'Custom',
    description: 'For large libraries with custom needs',
    features: [
      'All Pro features',
      'Custom integrations',
      'Dedicated account manager',
      'Advanced security features',
      'Custom analytics'
    ],
    cta: 'Contact sales',
    mostPopular: false,
  },
]

export default function PricingSection() {
  return (
    <div id="pricing" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-semibold text-base text-nook-500 leading-7">
            Pricing
          </h2>
          <p className="mt-2 font-bold text-3xl text-gray-900 sm:text-4xl tracking-tight">
            Affordable Plans for Every Library
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-8">
            Choose the perfect plan for your library's needs. All plans include our core features.
          </p>
        </div>

        <div className="gap-y-8 grid grid-cols-1 lg:grid-cols-4 mx-auto lg:mx-0 mt-16 max-w-md lg:max-w-none isolate">
          {tiers.map((tier, tierIdx) => (
            <div
              key={tier.id}
              className={`
                flex flex-col justify-between rounded-3xl bg-white p-8 ring-1 ring-gray-200 xl:p-10
                ${tier.mostPopular ? 'lg:z-10 lg:rounded-b-none' : ''}
                ${tierIdx === 0 ? 'lg:rounded-r-none' : ''}
                ${tierIdx === tiers.length - 1 ? 'lg:rounded-l-none' : ''}
                ${tier.mostPopular ? 'ring-2 ring-nook-500' : ''}
              `}
            >
              <div>
                <div className="flex justify-between items-center gap-x-4">
                  <h3 className={`text-lg font-semibold leading-8 ${
                    tier.mostPopular ? 'text-nook-500' : 'text-gray-900'
                  }`}>
                    {tier.name}
                  </h3>
                  {tier.mostPopular && (
                    <p className="bg-nook-500/10 px-2.5 py-1 rounded-full font-semibold text-nook-500 text-xs leading-5">
                      Most popular
                    </p>
                  )}
                </div>
                <p className="mt-4 text-gray-600 text-sm leading-6">
                  {tier.description}
                </p>
                <p className="flex items-baseline gap-x-1 mt-6">
                  <span className="font-bold text-4xl text-gray-900 tracking-tight">{tier.priceMonthly}</span>
                  {tier.id !== 'enterprise' && tier.id !== 'pro' && (
                    <span className="font-semibold text-gray-600 text-sm leading-6">/month</span>
                  )}
                </p>
                <ul role="list" className="space-y-3 mt-8 text-gray-600 text-sm leading-6">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-x-3">
                      <Check className="flex-none w-5 h-6 text-nook-500" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <a
                href="#"
                className={`
                  mt-8 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                  ${tier.mostPopular
                    ? 'bg-nook-500 text-white shadow-sm hover:bg-nook-600 focus-visible:outline-nook-500'
                    : 'bg-white text-nook-500 ring-1 ring-inset ring-nook-200 hover:ring-nook-300'
                  }
                `}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">
            All plans include access to our core features. Need a custom solution?{' '}
            <a href="#" className="font-semibold text-nook-500 hover:text-nook-600">
              Contact our sales team
            </a>
            {' '}or call us at{' '}
            <a 
              href="tel:+919405277621" 
              className="font-semibold text-nook-500 hover:text-nook-600"
            >
              +91 94052 77621
            </a>
          </p>
        </div>
      </div>
    </div>
  )
} 