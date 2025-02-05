'use client'

import EditCustomerModal from '@/app/components/EditCustomerModal'
import { db } from '@/lib/firebase/firebase'
import { backupCustomer } from '@/lib/firebase/firebaseUtils'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore'
import { AlertTriangle, Edit, RefreshCw, Search, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Customer {
  id: string
  name: string
  imageUrl: string
  joiningDate: string
  months: number
  timeSlotType: string
  customStartTime?: string
  customEndTime?: string
  createdAt: string
  deletionWarned?: boolean
}

interface DeletedCustomer {
  id: string
  originalId: string
  name: string
  deletedAt: string
  // ... other customer fields
}

export default function CustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [deletedCustomers, setDeletedCustomers] = useState<DeletedCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showDeletedCustomers, setShowDeletedCustomers] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    fetchCustomers()
    fetchDeletedCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const q = query(collection(db, 'customers'), orderBy('createdAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const customersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Customer[]

      // Sort by status (expired first) and then by days remaining
      const sortedCustomers = customersData.sort((a, b) => {
        const aActive = isSubscriptionActive(a)
        const bActive = isSubscriptionActive(b)
        
        // If one is active and other isn't, expired comes first
        if (aActive !== bActive) {
          return aActive ? 1 : -1
        }
        
        const aDaysRemaining = calculateDaysRemaining(a.joiningDate, a.months)
        const bDaysRemaining = calculateDaysRemaining(b.joiningDate, b.months)
        
        // For expired customers (both inactive), sort by most days expired
        if (!aActive && !bActive) {
          return bDaysRemaining - aDaysRemaining
        }
        
        // For active customers, sort by least days remaining
        return aDaysRemaining - bDaysRemaining
      })

      setCustomers(sortedCustomers)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDeletedCustomers = async () => {
    try {
      const q = query(collection(db, 'deleted_customers'), orderBy('deletedAt', 'desc'))
      const querySnapshot = await getDocs(q)
      
      const deletedCustomersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as DeletedCustomer[]

      setDeletedCustomers(deletedCustomersData)
    } catch (error) {
      console.error('Error fetching deleted customers:', error)
    }
  }

  const calculateDaysRemaining = (joiningDate: string, months: number) => {
    const startDate = new Date(joiningDate)
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + months))
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    // If subscription has expired, return positive number of days since expiry
    if (daysRemaining < 0) {
      return Math.abs(daysRemaining)
    }
    
    return daysRemaining
  }

  const handleExpiredCustomers = async () => {
    const expiredCustomers = customers.filter(customer => {
      const daysOverdue = calculateDaysRemaining(customer.joiningDate, customer.months)
      return daysOverdue >= 25 && !isSubscriptionActive(customer)
    })

    // First, warn about customers approaching deletion
    const customersToWarn = customers.filter(customer => {
      const daysOverdue = calculateDaysRemaining(customer.joiningDate, customer.months)
      return daysOverdue >= 20 && daysOverdue < 25 && !customer.deletionWarned && !isSubscriptionActive(customer)
    })

    // Update warning status for customers
    for (const customer of customersToWarn) {
      try {
        await updateDoc(doc(db, 'customers', customer.id), {
          deletionWarned: true
        })
      } catch (error) {
        console.error('Error updating warning status:', error)
      }
    }

    // Delete and backup customers expired for 25+ days
    for (const customer of expiredCustomers) {
      try {
        await backupCustomer(customer.id)
        await deleteDoc(doc(db, 'customers', customer.id))
      } catch (error) {
        console.error('Error handling expired customer:', error)
      }
    }

    if (expiredCustomers.length > 0 || customersToWarn.length > 0) {
      fetchCustomers()
      fetchDeletedCustomers()
    }
  }

  const isSubscriptionActive = (customer: Customer) => {
    const startDate = new Date(customer.joiningDate)
    const endDate = new Date(startDate.setMonth(startDate.getMonth() + customer.months))
    const today = new Date()
    return endDate.getTime() > today.getTime()
  }

  // Check for expired customers periodically
  useEffect(() => {
    handleExpiredCustomers()
    // Check every day
    const interval = setInterval(handleExpiredCustomers, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [customers])

  const getTimeSlotText = (customer: Customer) => {
    if (customer.timeSlotType === 'full_day') return 'Full Day'
    if (customer.timeSlotType === 'half_day') return 'Half Day'
    return `${customer.customStartTime} - ${customer.customEndTime}`
  }

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Restore deleted customer
  const handleRestore = async (deletedCustomer: DeletedCustomer) => {
    try {
      const { id, deletedAt, originalId, ...customerData } = deletedCustomer
      await addDoc(collection(db, 'customers'), {
        ...customerData,
        restoredAt: new Date().toISOString()
      })
      await deleteDoc(doc(db, 'deleted_customers', id))
      fetchCustomers()
      fetchDeletedCustomers()
    } catch (error) {
      console.error('Error restoring customer:', error)
    }
  }

  const getDaysRemainingColor = (isActive: boolean, daysRemaining: number) => {
    if (!isActive) {
      return 'text-red-600 font-medium' // Expired status
    }
    
    if (daysRemaining <= 7) {
      return 'text-red-600 font-medium' // Critical - less than a week
    }
    if (daysRemaining <= 15) {
      return 'text-orange-500 font-medium' // Warning - less than two weeks
    }
    if (daysRemaining <= 30) {
      return 'text-yellow-600 font-medium' // Attention - less than a month
    }
    return 'text-green-600 font-medium' // Healthy - more than a month
  }

  if (loading) {
    return <div className="py-8 text-center">Loading...</div>
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="font-bold text-2xl text-gray-900">Customers</h1>
          <p className="mt-2 text-gray-700 text-sm">
            A list of all customers sorted by days remaining in their subscription.
          </p>
        </div>
        <div className="sm:flex-none mt-4 sm:mt-0 sm:ml-16">
          <Link
            href="/dashboard/add-customer"
            className="flex justify-center bg-nook-500 hover:bg-nook-600 shadow-sm px-3 py-2 rounded-md font-semibold text-sm text-white"
          >
            Add customer
          </Link>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-8 mb-4">
        <div className="relative max-w-xs">
          <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customers..."
            className="block border-gray-300 focus:border-nook-500 bg-white py-2 pr-3 pl-10 border rounded-md focus:ring-1 focus:ring-nook-500 w-full sm:text-sm leading-5 focus:outline-none focus:placeholder-gray-400 placeholder-gray-500"
          />
        </div>
      </div>

      {/* Toggle Deleted Customers */}
      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowDeletedCustomers(!showDeletedCustomers)}
          className="flex items-center gap-2 text-gray-600 text-sm hover:text-gray-900"
        >
          <RefreshCw className="w-4 h-4" />
          {showDeletedCustomers ? 'Show Active Customers' : 'Show Deleted Customers'}
        </button>
      </div>

      {/* Warning Messages */}
      {customers.map(customer => {
        const daysOverdue = calculateDaysRemaining(customer.joiningDate, customer.months)
        if (daysOverdue >= 20 && daysOverdue < 25 && !isSubscriptionActive(customer)) {
          return (
            <div key={`warning-${customer.id}`} className="bg-yellow-50 mt-4 p-4 rounded-md">
              <div className="flex">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="font-medium text-sm text-yellow-800">
                    Deletion Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      Customer "{customer.name}" will be automatically deleted in {25 - daysOverdue} days.
                      Please contact them for subscription renewal.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        }
        return null
      })}

      {/* Table */}
      {showDeletedCustomers ? (
        <div className="mt-4">
          <h2 className="font-medium text-gray-900 text-lg">Recently Deleted Customers</h2>
          <div className="bg-white shadow mt-4 rounded-lg">
            {deletedCustomers.map(customer => (
              <div key={customer.id} className="flex justify-between items-center p-4 border-b">
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-gray-500 text-sm">
                    Deleted on: {new Date(customer.deletedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleRestore(customer)}
                  className="flex items-center gap-2 text-nook-500 hover:text-nook-600"
                >
                  <RefreshCw className="w-4 h-4" />
                  Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-4 flow-root">
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-2 overflow-x-auto">
            <div className="inline-block sm:px-6 lg:px-8 py-2 min-w-full align-middle">
              <div className="ring-opacity-5 shadow sm:rounded-lg ring-1 ring-black overflow-hidden">
                <table className="divide-y divide-gray-300 min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3.5 pr-3 pl-4 sm:pl-6 font-semibold text-gray-900 text-left text-sm">
                        Sr.No.
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Profile
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Joining Date
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Time Slot
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Month
                      </th>
                      <th scope="col" className="px-3 py-3.5 font-semibold text-gray-900 text-left text-sm">
                        Days Remaining
                      </th>
                      <th scope="col" className="relative py-3.5 pr-4 sm:pr-6 pl-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCustomers.map((customer, index) => {
                      const isActive = isSubscriptionActive(customer)
                      const daysRemaining = calculateDaysRemaining(customer.joiningDate, customer.months)

                      return (
                        <tr key={customer.id}>
                          <td className="py-4 pr-3 pl-4 sm:pl-6 font-medium text-gray-900 text-sm whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <div className="bg-gray-100 rounded-full w-10 h-10 overflow-hidden">
                              {customer.imageUrl ? (
                                <Image
                                  src={customer.imageUrl}
                                  alt={customer.name}
                                  width={40}
                                  height={40}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex justify-center items-center h-full">
                                  <User className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-4 text-gray-900 text-sm whitespace-nowrap">
                            {customer.name}
                          </td>
                          <td className="px-3 py-4 text-sm whitespace-nowrap">
                            <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              isActive 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {isActive ? 'Active' : 'Expired'}
                            </span>
                          </td>
                          <td className="px-3 py-4 text-gray-900 text-sm whitespace-nowrap">
                            {new Date(customer.joiningDate).toLocaleDateString()}
                          </td>
                          <td className="px-3 py-4 text-gray-900 text-sm whitespace-nowrap">
                            {getTimeSlotText(customer)}
                          </td>
                          <td className="px-3 py-4 text-gray-900 text-sm whitespace-nowrap">
                            {customer.months}
                          </td>
                          <td className={`px-3 py-4 text-sm whitespace-nowrap ${
                            getDaysRemainingColor(isActive, daysRemaining)
                          }`}>
                            {isActive ? daysRemaining : `+${daysRemaining}`}
                          </td>
                          <td className="relative text-right py-4 pr-4 sm:pr-6 pl-3 font-medium text-sm whitespace-nowrap">
                            <button
                              onClick={() => setSelectedCustomer(customer)}
                              className="inline-flex items-center gap-1 text-nook-500 hover:text-nook-600"
                            >
                              <Edit className="w-5 h-5" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {/* No Results Message */}
                {filteredCustomers.length === 0 && (
                  <div className="py-6 text-center text-gray-500">
                    No customers found matching "{searchTerm}"
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {selectedCustomer && (
        <EditCustomerModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          onUpdate={() => {
            fetchCustomers()
            setSelectedCustomer(null)
          }}
        />
      )}
    </div>
  )
}