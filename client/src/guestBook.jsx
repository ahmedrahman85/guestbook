
import { useState, useEffect } from 'react'

function GuestBook() {
  const [messages, setMessages] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  })

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/messages')
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  //handle likes 
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:3000/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (response.ok) {
        setFormData({ name: '', message: '' })
        fetchMessages()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteMessage = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/messages/${id}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchMessages()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Guest Book</h1>
        
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="Write your message here"
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>

        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className="bg-gray-50 rounded-lg p-4 border border-gray-200"
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-800">{msg.name}</h3>
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Delete
                </button>
              </div>
              <p className="mt-2 text-gray-600">{msg.message}</p>
              <small className="text-gray-400 block mt-2">
                {new Date(msg.created_at).toLocaleDateString()}
              </small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GuestBook