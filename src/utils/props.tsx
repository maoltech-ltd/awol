


export interface CategoryProps  {
  className?: string;
  name?: string;
  link: string
}

export type CategoriesProp = {
  categories: string[],
  currentSlug: string
}

export type CategoryProp = {
  link: string,
  name: string,
  active: boolean,
  className?: string  
}
