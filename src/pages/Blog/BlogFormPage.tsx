import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blogApi, CreateBlogData } from '../../api/blogApi';
import { ArrowLeft, Save,  X } from 'lucide-react';

const BlogFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    tags: [],
    status: 'draft',
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit && id) {
      fetchBlog(id);
    }
  }, [id, isEdit]);

  const fetchBlog = async (blogId: string) => {
    try {
      setInitialLoading(true);
      const blog = await blogApi.getBlogById(blogId);
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        featuredImage: blog.featuredImage?.url || '',
        tags: blog.tags || [],
        status: blog.status,
      });
    } catch (error) {
      console.error('Failed to fetch blog:', error);
      alert('Failed to load blog');
      navigate('/blogs');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      if (isEdit && id) {
        await blogApi.updateBlog(id, formData);
        alert('Blog updated successfully');
      } else {
        await blogApi.createBlog(formData);
        alert('Blog created successfully');
      }
      navigate('/blogs');
    } catch (error: any) {
      console.error('Save failed:', error);
      alert(error?.response?.data?.message || 'Failed to save blog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen ">
        <div className="w-16 h-16 bg-gradient-to-r from-[#FD4F01] to-orange-600 rounded-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className=" rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-4 md:p-8 mb-6 md:mb-8">
          <div className="flex items-center gap-3 md:gap-4">
            <button
              onClick={() => navigate('/blogs')}
              className="p-2 md:p-3 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-gray-600" />
            </button>
            <h1 className="text-2xl md:text-4xl font-bold ">
              {isEdit ? 'Edit Blog' : 'Create New Blog'}
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className=" rounded-2xl md:rounded-3xl shadow-xl border border-gray-100 p-4 md:p-8">
            {/* Title */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg"
                placeholder="Enter blog title"
                required
              />
            </div>

            {/* Excerpt */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg"
                placeholder="Brief summary of the blog post"
                rows={3}
                required
              />
            </div>

            {/* Content */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg font-mono"
                placeholder="Blog content (supports HTML)"
                rows={12}
                required
              />
              <p className="text-xs md:text-sm text-gray-500 mt-2">
                Tip: You can use HTML tags for formatting
              </p>
            </div>

            {/* Featured Image */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featuredImage}
                onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                className="w-full p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg"
                placeholder="https://example.com/image.jpg"
              />
              {formData.featuredImage && (
                <img
                  src={formData.featuredImage}
                  alt="Preview"
                  className="mt-4 rounded-xl max-h-48 md:max-h-64 w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
              )}
            </div>

            {/* Tags */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  className="flex-grow p-3 md:p-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 md:px-6 py-3 md:py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold transition-all duration-200 text-sm md:text-base"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-[#FD4F01] text-white px-3 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:/20 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="mb-4 md:mb-6">
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                className="w-full p-3 md:p-4 border-2 bg-transparent border-gray-200 rounded-xl focus:ring-4 focus:ring-[#FD4F01]/20 focus:border-[#FD4F01] transition-all duration-200 text-base md:text-lg"
              >
                <option className='bg-[#181C24]' value="draft">Draft</option>
                <option className='bg-[#181C24]' value="published">Published</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => navigate('/blogs')}
              className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-gray-500 hover:bg-gray-600 text-white rounded-xl font-bold text-base md:text-lg transition-all duration-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#FD4F01] to-orange-600 hover:from-orange-600 hover:to-[#FD4F01] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEdit ? 'Update Blog' : 'Create Blog'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogFormPage;