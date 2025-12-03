export interface Project {
  id: string
  title: string
  description: string
  category: string
  image: string
  link?: string
}

export interface Client {
  id: string
  name: string
  logo: string
}

export interface Value {
  id: string
  title: string
  description: string
  icon?: string
}

