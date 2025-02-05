'use client'

import { db, storage } from '@/lib/firebase/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { Camera, Clock } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'

// Predefined time slots
const PREDEFINED_SLOTS = {
  'full_day': 'Full Day',
  'half_day': 'Half Day',
  'custom': 'Custom Time Slot'
}

export default function AddCustomer() {
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    joiningDate: '',
    months: '',
    imageUrl: '',
    timeSlotType: 'full_day',
    customStartTime: '09:00',
    customEndTime: '17:00'
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ''
      
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0]
        const storageRef = ref(storage, `customer-images/${Date.now()}-${file.name}`)
        await uploadBytes(storageRef, file)
        imageUrl = await getDownloadURL(storageRef)
      }

      // Format time slot data
      const timeSlotData = formData.timeSlotType === 'custom' 
        ? {
            timeSlotType: 'custom',
            customStartTime: formData.customStartTime,
            customEndTime: formData.customEndTime
          }
        : {
            timeSlotType: formData.timeSlotType
          }

      // Add customer to Firestore
      await addDoc(collection(db, 'customers'), {
        ...formData,
        ...timeSlotData,
        imageUrl,
        createdAt: new Date().toISOString()
      })

      // Reset form and redirect
      setFormData({
        name: '',
        mobile: '',
        joiningDate: '',
        months: '',
        imageUrl: '',
        timeSlotType: 'full_day',
        customStartTime: '09:00',
        customEndTime: '17:00'
      })
      setImagePreview(null)
      router.push('/dashboard')
    } catch (error) {
      console.error('Error adding customer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 font-bold text-2xl">Add New Customer</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Profile preview"
                fill
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex justify-center items-center bg-gray-100 rounded-full w-full h-full">
                <Camera size={40} className="text-gray-400" />
              </div>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-indigo-600 text-sm hover:text-indigo-500"
          >
            Upload Photo
          </button>
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block font-medium text-gray-700 text-sm">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full"
          />
        </div>

        {/* Mobile */}
        <div>
          <label htmlFor="mobile" className="block font-medium text-gray-700 text-sm">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            required
            value={formData.mobile}
            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
            className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full"
          />
        </div>

        {/* Joining Date */}
        <div>
          <label htmlFor="joiningDate" className="block font-medium text-gray-700 text-sm">
            Joining Date
          </label>
          <input
            type="date"
            id="joiningDate"
            required
            value={formData.joiningDate}
            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
            className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full"
          />
        </div>

        {/* Number of Months */}
        <div>
          <label htmlFor="months" className="block font-medium text-gray-700 text-sm">
            Number of Months
          </label>
          <input
            type="number"
            id="months"
            required
            min="1"
            value={formData.months}
            onChange={(e) => setFormData({ ...formData, months: e.target.value })}
            className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full"
          />
        </div>

        {/* Time Slot Selection */}
        <div className="space-y-4">
          <label className="block font-medium text-gray-700 text-sm">
            Time Slot
          </label>
          
          {/* Time Slot Type Selection */}
          <div className="gap-4 grid grid-cols-3">
            {Object.entries(PREDEFINED_SLOTS).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setFormData({ ...formData, timeSlotType: value })}
                className={`flex items-center justify-center px-4 py-2 border rounded-md text-sm font-medium transition-colors
                  ${formData.timeSlotType === value
                    ? 'border-nook-500 bg-nook-50 text-nook-500'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <Clock className="mr-2 w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Custom Time Slot Fields */}
          {formData.timeSlotType === 'custom' && (
            <div className="gap-4 grid grid-cols-2 mt-4">
              <div>
                <label htmlFor="startTime" className="block font-medium text-gray-700 text-sm">
                  Start Time
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={formData.customStartTime}
                  onChange={(e) => setFormData({ ...formData, customStartTime: e.target.value })}
                  className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full"
                />
              </div>
              <div>
                <label htmlFor="endTime" className="block font-medium text-gray-700 text-sm">
                  End Time
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={formData.customEndTime}
                  onChange={(e) => setFormData({ ...formData, customEndTime: e.target.value })}
                  className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex justify-center bg-nook-500 hover:bg-nook-600 disabled:opacity-50 shadow-sm px-4 py-2 border border-transparent rounded-md focus:ring-2 focus:ring-nook-500 focus:ring-offset-2 w-full font-medium text-sm text-white focus:outline-none"
          >
            {loading ? 'Adding Customer...' : 'Add Customer'}
          </button>
        </div>
      </form>
    </div>
  )
} 