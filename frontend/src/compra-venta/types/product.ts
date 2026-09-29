export interface ProductImage {
  url: string
}

export interface ProductSeller {
  _id?: string
  id?: string
  name: string
  phone?: string
  email?: string
  location?: string
  isVerified?: boolean
}

export interface Product {
  _id: string
  id?: string
  title: string
  description?: string
  price: number
  category?: string
  location: string
  images?: ProductImage[]
  image?: string
  createdAt?: string
  date?: string
  user?: ProductSeller
}
