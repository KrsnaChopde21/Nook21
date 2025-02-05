'use client'

import { db } from '@/lib/firebase/firebase'
import { useDigidates } from '@/lib/hooks/useDigidates'
import { doc, updateDoc } from 'firebase/firestore'
import { X } from 'lucide-react'
import { useState } from 'react'

interface EditCustomerModalProps {
  customer: {
    id: string
    name: string
    months: number
    joiningDate: string
  }
  onClose: () => void
  onUpdate: () => void
}

export default function EditCustomerModal({ customer, onClose, onUpdate }: EditCustomerModalProps) {
  const [loading, setLoading] = useState(false)
  const { convertDate, loading: dateLoading } = useDigidates()
  const [formData, setFormData] = useState({
    additionalMonths: '1',
    renewalDate: new Date().toISOString().split('T')[0]
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Convert renewal date using Digidates API
      const convertedDate = await convertDate(formData.renewalDate, 'YYYY-MM-DD')
      
      if (!convertedDate) {
        throw new Error('Failed to convert date')
      }

      const customerRef = doc(db, 'customers', customer.id)
      
      // Calculate new total months
      const newTotalMonths = customer.months + parseInt(formData.additionalMonths)
      
      await updateDoc(customerRef, {
        months: newTotalMonths,
        joiningDate: convertedDate.convertedDate, // Use converted date
        deletionWarned: false
      })

      onUpdate()
      onClose()
    } catch (error) {
      console.error('Error updating customer:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-medium text-gray-900 text-lg">
            Update Subscription - {customer.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="additionalMonths" className="block font-medium text-gray-700 text-sm">
              Add Months
            </label>
            <input
              type="number"
              id="additionalMonths"
              min="1"
              value={formData.additionalMonths}
              onChange={(e) => setFormData({ ...formData, additionalMonths: e.target.value })}
              className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="renewalDate" className="block font-medium text-gray-700 text-sm">
              Renewal Date
            </label>
            <input
              type="date"
              id="renewalDate"
              value={formData.renewalDate}
              onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
              className="block border-gray-300 focus:border-nook-500 shadow-sm mt-1 rounded-md focus:ring-nook-500 w-full sm:text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border-gray-300 bg-white hover:bg-gray-50 px-4 py-2 border rounded-md focus:ring-2 focus:ring-nook-500 focus:ring-offset-2 font-medium text-gray-700 text-sm focus:outline-none"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-nook-500 hover:bg-nook-600 disabled:opacity-50 px-4 py-2 border border-transparent rounded-md focus:ring-2 focus:ring-nook-500 focus:ring-offset-2 font-medium text-sm text-white focus:outline-none"
            >
              {loading ? 'Updating...' : 'Update Subscription'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 