import React, { useEffect, useState } from 'react'
import {  getAllUsers } from '../../api/usersApi'
import { User } from '../../types/user'


const UserPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [openUserId, setOpenUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await getAllUsers() as { users: User[] }
      setUsers(response.users)
    }
    fetchUsers()
  }, [])
  
  const toggleDropdown = (userId: string) => {
    setOpenUserId(openUserId === userId ? null : userId)
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 drop-shadow">Users</h1>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-900">
              <th className="px-4 py-3 text-blue-300 font-semibold">Name</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Email</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Username</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Role</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Subscription</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Created At</th>
              <th className="px-4 py-3 text-blue-300 font-semibold">Actions</th>
            </tr>
          </thead>
       
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user._id}>
                <tr className="border-t border-gray-700 hover:bg-gray-700 transition">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.username}</td>
                  <td className="px-4 py-2 capitalize">{user.role}</td>
                  <td className="px-4 py-2">
                    <span className={user.subscription.isActive ? "text-green-400 font-semibold" : "text-red-400 font-semibold"}>
                      {user.subscription.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      className={`px-4 py-2 rounded transition font-semibold shadow 
                        ${openUserId === user._id 
                          ? "bg-blue-700 hover:bg-blue-800 text-white" 
                          : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                      onClick={() => toggleDropdown(user._id)}
                    >
                      {openUserId === user._id ? 'Hide' : 'Details'}
                    </button>
                  </td>
                </tr>
                {openUserId === user._id && (
                  <tr>
                    <td colSpan={7} className="bg-gray-900 px-4 py-4 border-t border-gray-700">
                      <div className="space-y-2">
                        <div><b className="text-blue-300">Referral Earnings:</b> <span className="text-green-400">PKR {user.referral.totalEarnings}</span></div>
                        <div><b className="text-blue-300">Total Withdrawn:</b> <span className="text-yellow-400">PKR {user.withdrawals.totalWithdrawn}</span></div>
                        <div>
                          <b className="text-blue-300">Referral Levels:</b>
                          <ul className="list-disc ml-6 text-sm">
                            {[...Array(10)].map((_, idx) => (
                              <li key={idx}>
                                <span className="text-blue-200">Level {idx + 1}:</span> 
                                <span className="text-gray-200"> {Array.isArray(user.referral[`level${idx + 1}`]) ? user.referral[`level${idx + 1}`].length : 0} users</span>, 
                                <span className="text-green-400"> Earnings: PKR {user.referral.earningsByLevel[`level${idx + 1}`] || 0}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div><b className="text-blue-300">Subscription Amount Paid:</b> <span className="text-purple-400">PKR {user.subscription.amountPaid}</span></div>
                        <div>
                          <b className="text-blue-300">Permissions:</b> 
                          <span className="text-gray-300"> {Object.entries(user.permissions).map(([key, value]) => `${key}: ${value ? 'Yes' : 'No'}`).join(', ')}</span>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default UserPage