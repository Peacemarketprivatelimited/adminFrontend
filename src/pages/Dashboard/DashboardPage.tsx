import { useState } from "react"

const DashboardPage = () => {
  const [image, setImage] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  const handleImageUpload = async () => {
    if (!image) return

    try {
      setUploading(true)
      
      // Create FormData for proper file upload
      const formData = new FormData()
      formData.append('image', image)
      
      const response = await fetch('https://fakestoreapi.com/products', {
        method: "POST",
        body: formData // Using formData instead of direct object
      })
      
      if (response.ok) {
        setUploadSuccess(true)
        // Reset the image state after successful upload
        setImage(null)
      }
    } catch (error) {
      console.error("Upload failed:", error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 rounded-lg shadow-lg dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-gray-100 dark:text-gray-100">Dashboard</h1>

      <div className="mb-4">
        <input 
          type="file" 
          name="image"
          className="border-2 border-gray-700 rounded-md p-2 w-full mb-4 bg-gray-800 text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImage(e.target.files[0])
              setUploadSuccess(false) // Reset success state when new file selected
            }
          }}
        />
        
        {/* Simple image preview */}
        {image && (
          <div className="mb-4">
            <p className="mb-2 text-gray-300 dark:text-gray-300">Selected file: {image.name}</p>
            <img 
              src={URL.createObjectURL(image)} 
              alt="Preview" 
              className="max-h-40 rounded border border-gray-700"
            />
          </div>
        )}

        <button 
          onClick={handleImageUpload} 
          disabled={!image || uploading}
          className={`w-full py-2 rounded-md font-medium transition-colors duration-200 shadow-lg ${
            !image || uploading
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-blue-700 hover:bg-blue-800 text-white'
          }`}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        
        {uploadSuccess && (
          <p className="mt-2 text-green-400 dark:text-green-400">Image uploaded successfully!</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage