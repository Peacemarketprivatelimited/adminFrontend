export interface Category {
    _id?: string;
    '*id'?: string;
    name: string;
    slug?: string;
    description?: string;
    featured?: boolean;
    active?: boolean;
  }
  
  export interface FormState {
    name: string;
    description: string;
    shortDescription: string;
    price: string;
    quantity: string;
    categoryId: string;
    subcategoryId: string;
    discount: {
      regular: {
        percentage: number;
        active: boolean;
      };
      subscription: {
        percentage: number;
        active: boolean;
      };
    },
    seo: {
      title: string;
      description: string;
      keywords: string[];
    };
    attributes: {
      color: string;
      size: string;
      material: string;
    };
    shipping: {
      weight: string;
      dimensions: {
        length: string;
        width: string;
        height: string;
      };
    };
    status: {
      active: boolean;
      featured: boolean;
      inStock: boolean;
    };
  }