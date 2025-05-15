export interface Category {
    _id: string;
    name: string;
    slug: string;
  }
  
  export interface ProductFormValues {
    name: string;
    description: string;
    shortDescription: string;
    price: number;
    quantity: number;
    categoryId: string;
    discount?: string;
    seo?: string;
    attributes?: string;
    shipping?: string;
    status?: string;
    images: FileList;
  }


  // filepath: d:\PEACEMARKETFOLDER\adminpannelpeace\src\types\Product.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  status: {
    active: boolean;
    inStock: boolean;
    featured: boolean;
  };
}