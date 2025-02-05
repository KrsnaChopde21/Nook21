import { Database, Key, Lock, Shield } from 'lucide-react'

const securityFeatures = [
  {
    name: 'Advanced Encryption',
    description: 'Your data is protected with industry-standard AES-256 encryption at rest and in transit.',
    icon: Lock,
  },
  {
    name: 'Secure Authentication',
    description: 'Multi-factor authentication and secure session management keep your account protected.',
    icon: Key,
  },
  {
    name: 'Data Backup',
    description: 'Automated backups ensure your library data is always safe and recoverable.',
    icon: Database,
  },
  {
    name: 'Privacy First',
    description: 'We follow strict data privacy guidelines and compliance standards to protect your information.',
    icon: Shield,
  },
]

export default function SecuritySection() {
  return (
    <div id="security" className="bg-gray-50 py-24 sm:py-32">
      <div className="mx-auto px-6 lg:px-8 max-w-7xl">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="font-semibold text-base text-nook-500 leading-7">
            Security
          </h2>
          <p className="mt-2 font-bold text-3xl text-gray-900 sm:text-4xl tracking-tight">
            Secure and Reliable—Your Data, Protected
          </p>
          <p className="mt-6 text-gray-600 text-lg leading-8">
            We know how important your library's data is. That's why our tool uses top-notch encryption 
            and secure authentication to keep your customer information safe. Trust us to provide a 
            reliable system you can count on.
          </p>
        </div>

        <div className="mx-auto mt-16 sm:mt-20 lg:mt-24 max-w-2xl lg:max-w-none">
          <dl className="gap-x-8 gap-y-16 grid grid-cols-1 lg:grid-cols-2 max-w-xl">
            {securityFeatures.map((feature) => (
              <div 
                key={feature.name} 
                className="flex flex-col items-start bg-white shadow-lg hover:shadow-xl p-8 rounded-2xl transition-shadow duration-300"
              >
                <div className="bg-nook-500/10 p-4 rounded-lg">
                  <feature.icon className="w-6 h-6 text-nook-500" aria-hidden="true" />
                </div>
                <dt className="mt-4 font-semibold text-gray-900 text-lg">
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base text-gray-600 leading-7">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Security Badge Section */}
        <div className="flex justify-center mt-20">
          <div className="flex items-center gap-x-8 bg-white shadow-lg p-8 rounded-2xl">
            <div className="flex items-center gap-x-4">
              <Lock className="w-12 h-12 text-nook-500" />
              <div>
                <div className="font-semibold text-gray-900">AES-256 Encryption</div>
                <div className="text-gray-500 text-sm">Industry Standard Security</div>
              </div>
            </div>
            <div className="bg-gray-200 w-px h-12" />
            <div className="flex items-center gap-x-4">
              <Key className="w-12 h-12 text-nook-500" />
              <div>
                <div className="font-semibold text-gray-900">Multi-Factor Authentication</div>
                <div className="text-gray-500 text-sm">Enhanced Account Protection</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 