import React, { useEffect, useState, useRef, useCallback } from 'react'
import { getUsersPaginated, deleteUser } from '../../api/usersApi'
import { User } from '../../types/user'

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [openUserId, setOpenUserId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await getUsersPaginated(page, 10) as { users: User[] }
        setUsers(prev => [...prev, ...response.users])
        setHasMore(response.users.length === 10)
      } catch {
        setHasMore(false)
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [page])

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const query = searchQuery.toLowerCase()
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.username?.toLowerCase().includes(query)
    )
  })

  const toggleDropdown = (userId: string) => {
    setOpenUserId(openUserId === userId ? null : userId)
  }

  // Infinite scroll observer
  const lastUserRef = useCallback(
    (node: HTMLTableRowElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new window.IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        setUsers(users.filter(u => u._id !== id));
      } catch (err: any) {
        alert(err.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-blue-400 drop-shadow">Users</h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or username..."
          className="px-4 py-2 rounded-lg bg-gray-800 border border-blue-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <p className="text-sm text-gray-400 mt-2">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        )}
      </div>

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
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  {searchQuery ? 'No users match your search criteria.' : 'No users found.'}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user, idx) => (
                <React.Fragment key={user._id}>
                  <tr
                    className="border-t border-gray-700 hover:bg-gray-700 transition"
                    ref={idx === filteredUsers.length - 1 ? lastUserRef : undefined}
                  >
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
                    <td className="px-4 py-2 flex space-x-2">
                      <button
                        className={`px-4 py-2 rounded transition font-semibold shadow 
                          ${openUserId === user._id
                            ? "bg-blue-700 hover:bg-blue-800 text-white"
                            : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                        onClick={() => toggleDropdown(user._id)}
                      >
                        {openUserId === user._id ? 'Hide' : 'Details'}
                      </button>
                      <button
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
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
              ))
            )}
          </tbody>
        </table>
      </div>
      {loading && <div className="text-center py-4">Loading...</div>}
      {!hasMore && <div className="text-center py-4 text-gray-500">No more users.</div>}
    </div>
  )
}

export default UserPage