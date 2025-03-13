import React from "react"
import { XCircle } from "lucide-react"
import { Link } from "react-router-dom"

const AccessDenied = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full text-center">
        <XCircle className="mx-auto text-blue-400 w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-2">Access Denied</h1>
        <p className="text-gray-300 mb-6">You don't have permission to access this page.</p>
        <div className="bg-gray-700 p-4 rounded-md">
          <p className="text-blue-300 font-medium">Login with your APSIT ID</p>
        </div>
        <Link to='/'>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300">
          Go to Login
        </button>
        </Link>
      </div>
    </div>
  )
}

export default AccessDenied