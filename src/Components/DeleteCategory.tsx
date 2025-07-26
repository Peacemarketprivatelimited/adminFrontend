import { useEffect, useState } from 'react'
import { getCategories, deleteCategory } from '../api/categoryApi'

type ApiResponse = {
  id: string;
  name: string;
  description?: string;
};

const DeleteCategory = () => {
  const [data, setData] = useState<ApiResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  console.log(data)
  const fetchCategories = async () => {
    setLoading(true);
    setError('');
    try {
      const categories = await getCategories();
      setData(categories);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
  if (!id) {
    alert('Invalid category id');
    return;
  }
  if (window.confirm('Are you sure you want to delete this category?')) {
    try {
      await deleteCategory(id);
      setData(data.filter(cat => cat.id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  }
};

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Categories</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full bg-gray-900 text-gray-100 rounded">
          <thead>
            <tr>
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map(cat => (
              <tr key={cat.id}>
                <td className="py-2 px-4">{cat.name}</td>
                <td className="py-2 px-4">{cat.description || '-'}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="bg-red-700 hover:bg-red-800 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={3} className="py-4 text-center text-gray-400">
                  No categories found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeleteCategory;