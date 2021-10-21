
import productsProvider from "./celebrations";
import { Resolvers,QueryGetAllProductsArgs } from './types';
import { UserInputError } from "apollo-server-express";
async function getAllProducts( obj:any,QueryGetAllProductsArgs : QueryGetAllProductsArgs) {
  // artificial delay
  await new Promise((resolve) => setTimeout(resolve, 105))
  // init limit
  let first = 5;
  if (QueryGetAllProductsArgs.first !== undefined) {
    const min = 1;
    const max = 25;
    if (QueryGetAllProductsArgs.first < min || QueryGetAllProductsArgs.first > max) {
      throw new UserInputError(
        `Invalid limit value (min: ${min}, max: ${max})`
      );
    }
    first = QueryGetAllProductsArgs.first;
  }
  // init offset
  let after = 0;
  if (QueryGetAllProductsArgs.after !== undefined) {
    const index = productsProvider.products.findIndex((item) => item.name === QueryGetAllProductsArgs.after);
    if (index === -1) {
      throw new UserInputError(`Invalid after value: cursor not found.`);
    }
    after = index + 1;
    if (after === productsProvider.products.length) {
      throw new UserInputError(
        `Invalid after value: no items after provided cursor.`
      );
    }
  }

  const productNames = productsProvider.products.slice(after, after + first);
  const lastStreetName = productNames[productNames.length - 1];

  return {
    pageInfo: {
      endCursor: lastStreetName.name,
      hasNextPage: after + first < productsProvider.products.length,
    },
    edges: productNames.map((streetName) => ({
      cursor: streetName.name,
      node: streetName,
    })),
  };
}


const resolvers: Resolvers = {
  Query: {

    getAllProducts : getAllProducts,
    getSearchedProducts(obj, { searchString, date, after, first }) {
      const result = productsProvider.products.filter((r) => r.searchString.toLowerCase()
        .indexOf(searchString.toLowerCase()) !== -1 && r.date == date);
      const index = productsProvider.products.findIndex((item) => item.name === after);
      const offset = index + 1;

      const products = result.slice(offset, offset + first);
      const lastBook = products[products.length - 1];

      return {
        pageInfo: {
          endCursor: lastBook.name,
          hasNextPage: offset + first < productsProvider.products.length,
        },
        edges: products.map((product) => ({
          cursor: product.name,
          node: product,
        })),
      };
    },
    getFilteredProducts(obj, { searchString, date, maxPrice, minPrice, after, first}) {
      const result=  productsProvider.products.filter((r) => r.searchString.toLowerCase()
        .indexOf(searchString.toLowerCase()) !== -1 && r.date == date && r.price >= minPrice && r.price <= maxPrice);
        const index = productsProvider.products.findIndex((item) => item.name === after);
        const offset = index + 1;
  
        const products = result.slice(offset, offset + first);
        const lastBook = products[products.length - 1];
  
        return {
          pageInfo: {
            endCursor: lastBook.name,
            hasNextPage: offset + first < productsProvider.products.length,
          },
          edges: products.map((product) => ({
            cursor: product.name,
            node: product,
          })),
        };
    }
  },
};

export default resolvers;
