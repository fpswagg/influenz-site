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
  image?: string
  description: {
    fr: string
    en: string
  }
}

export interface Value {
  id: string
  title: string
  description: string
  icon?: string
}

