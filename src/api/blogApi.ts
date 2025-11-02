import { api } from "../data/api";

export interface BlogImage {
  url: string;
  public_id?: string;
  alt?: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author?: {
    _id: string;
    name: string;
  };
  featuredImage?: BlogImage;
  tags: string[];
  status: 'draft' | 'published';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
  tags: string[];
  status: 'draft' | 'published';
}

export const blogApi = {
  // Get all blogs (admin)
  getAllBlogs: async (): Promise<{ blogs: Blog[]; pagination: any }> => {
    const response = await api.get<{ blogs: Blog[]; pagination: any }>('/admin/blogs');
    return response.data;
  },

  // Get single blog by ID
  getBlogById: async (id: string): Promise<Blog> => {
    const response = await api.get<{ blog: Blog }>(`/admin/blogs/${id}`);
    return response.data.blog || response.data;
  },

  // Create blog
  createBlog: async (data: CreateBlogData): Promise<Blog> => {
    const response = await api.post<{ blog: Blog }>('/admin/blogs', data);
    return response.data.blog || response.data;
  },

  // Update blog
  updateBlog: async (id: string, data: Partial<CreateBlogData>): Promise<Blog> => {
    const response = await api.put<{ blog: Blog }>(`/admin/blogs/${id}`, data);
    return response?.data.blog || response.data;
  },

  // Delete blog
  deleteBlog: async (id: string): Promise<void> => {
    await api.delete(`/admin/blogs/${id}`);
  },

  // Upload featured image
  uploadFeaturedImage: async (file: File): Promise<BlogImage> => {
    const formData = new FormData();
    formData.append('featuredImage', file);
    
    const response = await api.post<{ image: BlogImage }>('/admin/blogs/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.image;
  },
};