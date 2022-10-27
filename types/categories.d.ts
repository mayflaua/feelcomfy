export enum ProductCategory {
  MOUSE = 1,
  KEYBOARDS = 2,
  CHAIRS = 3,
  TABLES = 4,
  MONITORS = 5,
  MERCH = 6,
  ACCESSORIES = 7
}

export enum Filter {
  POPULAR = 'orders',
  BEST_RATING = 'score',
}

export interface CategoryObject {
  categoryID?: ProductCategory
  filter?: Filter
  name: string
  title: string
  link: string
}
