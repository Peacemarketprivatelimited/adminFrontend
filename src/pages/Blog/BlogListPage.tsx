import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blogApi, Blog } from '../../api/blogApi';
import { Plus, Edit, Trash2,  Search, FileText } from 'lucide-react';

const BlogListPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'published'>('all');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogApi.getAllBlogs();
      setBlogs(data.blogs || data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      alert('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      setDeleting(id);
      await blogApi.deleteBlog(id);
      setBlogs(blogs.filter(b => b._id !== id));
      alert('Blog deleted successfully');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete blog');
    } finally {
      setDeleting(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = search === '' ||
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FD4F01] to-orange-600 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="  rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            <div>
              <div className="flex items-center mb-2">
                <FileText className="w-8 h-8 text-[#FD4F01] mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">Blog Management</h1>
              </div>
              <p className="text-white text-base md:text-lg">Create and manage blog posts</p>
            </div>
            <button
              onClick={() => navigate('/blogs/create')}
              className="w-full md:w-auto bg-gradient-to-r from-[#FD4F01] to-orange-600 hover:from-orange-600 hover:to-[#FD4F01] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Blog
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className=" rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search blogs..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="md:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="w-full px-4 py-3 md:py-4 border-2 border-gray-200 rounded-xl appearance-none bg-black focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg font-medium"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blog List */}
        {filteredBlogs.length === 0 ? (
          <div className=" rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-8 md:p-12 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-700 mb-3 md:mb-4">No Blogs Found</h3>
            <p className="text-gray-500 text-base md:text-lg mb-4 md:mb-6">
              {search || filterStatus !== 'all'
                ? 'No blogs match your search criteria.'
                : "Start by creating your first blog post."
              }
            </p>
            {!search && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/blogs/create')}
                className="bg-gradient-to-r from-[#FD4F01] to-orange-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                Create First Blog
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                <div className="p-4 md:p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 md:gap-6">
                    {/* Blog Info */}
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-start gap-3 md:gap-4 mb-3 md:mb-4">
                        {/* Featured Image Thumbnail */}
                        {blog.featuredImage?.url && (
                          <img
                            src={blog.featuredImage.url}
                            alt={blog.featuredImage.alt || blog.title}
                            className="w-full sm:w-24 md:w-32 h-32 sm:h-24 md:h-32 object-cover rounded-xl"
                          />
                        )}
                        
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
                            <h3 className="text-lg md:text-2xl font-bold text-gray-900">{blog.title}</h3>
                            <span
                              className={`px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold ${
                                blog.status === 'published'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {blog.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm md:text-base mb-2 md:mb-3 line-clamp-2">{blog.excerpt}</p>
                          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-500">
                            <span>By {blog.author?.name || 'Admin'}</span>
                            <span>•</span>
                            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                          </div>
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 md:mt-3">
                              {blog.tags.slice(0, 3).map((tag, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gray-100 text-gray-700 px-2 md:px-3 py-1 rounded-full text-xs font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                              {blog.tags.length > 3 && (
                                <span className="text-gray-500 text-xs">+{blog.tags.length - 3} more</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row lg:flex-col gap-2 md:gap-3">
                      <button
                        onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-[#FD4F01] hover:bg-orange-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all duration-200"
                      >
                        <Edit className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => handleDelete(blog._id)}
                        disabled={deleting === blog._id}
                        className="flex-1 lg:flex-initial flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg md:rounded-xl font-bold text-sm md:text-base transition-all duration-200 disabled:opacity-50"
                      >
                        {deleting === blog._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogListPage;