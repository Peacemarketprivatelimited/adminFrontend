// filepath: d:\PEACEMARKETFOLDER\adminpannelpeace\src\api\productApi.ts
import { api } from '../data/api';
import axios from 'axios';

const API_URL =  'http://localhost:5000/api';


export const addProduct = async (productData: FormData, token: string) => {
  try {
    const response = await api.post('/products', productData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add product');
  }
};

// Get all products with pagination
export const getproducts = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${API_URL}/products`, {
      params: { page, limit },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Get product by ID
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images?: string[];
  [key: string]: any; // For additional fields
}

export const getProductById = async (id: string): Promise<Product> => {
  try {
    const response = await api.get<{ success: boolean; product: Product }>(`${API_URL}/products/id/${id}`, {
      withCredentials: true,
    });
    // Return only the product object
    return response.data.product;
  } catch (error: any) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};
// Create new product
interface ProductData {
  name: string;
  description: string;
  price: number;
  category?: string;
  images?: File[];
  [key: string]: any; // For additional fields
}

interface CreateProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  images?: string[];
  [key: string]: any; // For additional fields
}

export const createProduct = async (productData: ProductData): Promise<CreateProductResponse> => {
  try {
    // If productData contains file uploads, use FormData
    let formData: FormData | undefined;
    if (productData.images && productData.images.length > 0) {
      formData = new FormData();
      
      // Append all normal fields
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          if (typeof productData[key] === 'object' && productData[key] !== null) {
            if (formData) {
              if (formData) {
                if (formData) {
                  if (formData) {
                    if (formData) {
                      if (formData) {
                        if (formData) {
                          if (formData) {
                            formData.append(key, JSON.stringify(productData[key]));
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          } else {
            if (formData) {
              formData.append(key, productData[key]);
            }
          }
        }
      });
      
      // Append all image files
      productData.images.forEach(image => {
        if (formData) {
          formData.append('images', image);
        }
      });
    }

    const response = await axios.post<CreateProductResponse>(
      `${API_URL}/products`,
      formData || productData,
      {
        withCredentials: true,
        headers: formData ? {
          'Content-Type': 'multipart/form-data',
        } : {
          'Content-Type': 'application/json',
        },
      }
    );
    
    return response.data;
  } catch (error: any) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update product
interface UpdateProductData {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  images?: File[];
  [key: string]: any; // For additional fields
}

interface UpdateProductResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string;
  images?: string[];
  [key: string]: any; // For additional fields
}

export const updateProduct = async (
  id: string,
  productData: UpdateProductData,
  token: string
): Promise<UpdateProductResponse> => {
  try {
    let formData: FormData | undefined;
    if (productData.images && productData.images.length > 0) {
      formData = new FormData();
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          // Only stringify objects for FormData
          if (typeof productData[key] === 'object' && productData[key] !== null) {
            if (formData) {
              formData.append(key, JSON.stringify(productData[key]));
            }  } else {
            if (formData) {
              formData.append(key, productData[key] as string | Blob);
            }
          }
        }
      });
      if (formData) {
        productData.images.forEach(image => {
          if (formData) {
            formData.append('images', image);
          }
        });
      }
    }

    // If not using FormData, make sure NOT to stringify objects
    const dataToSend = formData || productData;

    const response = await axios.put<UpdateProductResponse>(
      `${API_URL}/products/${id}`,
      dataToSend,
      {
        withCredentials: true,
        headers: {
          ...(formData
            ? { 'Content-Type': 'multipart/form-data' }
            : { 'Content-Type': 'application/json' }),
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};
// Delete product
// Update the deleteProduct function
// Update the deleteProduct function
// Delete product
export const deleteProduct = async (id: string) => {
  try {
    // Fix the URL format - use forward slash instead of colon
    const response = await api.delete(`/products/${id}`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};

export const updateProductStatus = async (
  id: string,
  statusData: { active?: boolean; featured?: boolean }
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `${API_URL}/products/${id}/status`,
      statusData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating product status ${id}:`, error);
    throw error;
  }
};

// Toggle featured status
export const toggleFeatureProduct = async (
  id: string,
  featured: boolean
): Promise<Product> => {
  try {
    const response = await axios.put<Product>(
      `${API_URL}/products/${id}/feature`,
      { featured },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error toggling feature status for product ${id}:`, error);
    throw error;
  }
};

// Add product images
export const addProductImages = async (
  id: string,
  imageFiles: File[]
): Promise<Product> => {
  try {
    const formData = new FormData();
    imageFiles.forEach((file) => {
      formData.append('images', file);
    });

    const response = await axios.post<Product>(
      `${API_URL}/products/${id}/images`,
      formData,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding images to product ${id}:`, error);
    throw error;
  }
};

// Remove product image
export const removeProductImage = async (
  productId: string,
  imageId: string
): Promise<Product> => {
  try {
    const response = await axios.delete<Product>(
      `${API_URL}/products/${productId}/images/${imageId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error removing image ${imageId} from product ${productId}:`, error);
    throw error;
  }
};

// Get featured products
export const getFeaturedProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const response = await axios.get<{ products: Product[] }>(`${API_URL}/products/featured`, {
      params: { limit },
    });
    return response.data.products;
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// Get discounted products
export const getDiscountedProducts = async (limit = 10): Promise<Product[]> => {
  try {
    const response = await axios.get<{ products: Product[] }>(`${API_URL}/products/discounted`, {
      params: { limit },
    });
    return response.data.products;
  } catch (error) {
    console.error('Error fetching discounted products:', error);
    throw error;
  }
};

// Get products by category
export const getProductsByCategory = async (
  categoryId: string,
  page = 1,
  limit = 10
): Promise<{ products: Product[]; pagination: { total: number } }> => {
  try {
    const response = await axios.get<{ products: Product[]; pagination: { total: number } }>(
      `${API_URL}/products/category/${categoryId}`,
      {
        params: { page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
};

// Search products
export const searchProducts = async (
  query: string,
  page = 1,
  limit = 10
): Promise<{ products: Product[]; pagination: { total: number } }> => {
  try {
    const response = await axios.get<{ products: Product[]; pagination: { total: number } }>(
      `${API_URL}/products/search`,
      {
        params: { q: query, page, limit },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    throw error;
  }
};

// Get product by slug
export const getProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await axios.get<Product>(`${API_URL}/products/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    throw error;
  }
};