"use client"

import { useState } from "react"

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // Basic form validation
    if (!name || !email) {
      alert("Please fill in all fields.")
      return
    }

    // Simulate adding a user (replace with actual API call)
    const newUser = {
      id: users.length + 1,
      name,
      email,
    }

    setUsers([...users, newUser])
    setName("")
    setEmail("")
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* User List */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">User List</h2>
        {users.length === 0 ? (
          <p>No users yet.</p>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Name</th>
                <th className="px-4 py-2 border-b">Email</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.name}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add User Form */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Add User</h2>
        <form onSubmit={handleSubmit} className="max-w-sm">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
              Name:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">
              Role:
            </label>
            <select
              name="role"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="hotel_manager">Hotel Manager</option>
              <option value="transfer_manager">Transfer Manager</option>
              <option value="trip_manager">Trip Manager</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add User
          </button>
        </form>
      </div>
    </div>
  )
}
