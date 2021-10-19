
import productsProvider from "./celebrations";
import { Resolvers } from './types';


const resolvers: Resolvers = {
  Query: {
   
    getAllProducts() {
      return productsProvider.products;
    },
   getSearchedProducts(obj, {searchString,date}) {
   const result =  productsProvider.products.filter((r) => r.searchString.toLowerCase()
          .indexOf(searchString.toLowerCase()) !== -1 && r.date == date);
          return result;
  },
  getFilteredProducts(obj, {searchString,date,maxPrice,minPrice}){
    return  productsProvider.products.filter((r) => r.searchString.toLowerCase()
    .indexOf(searchString.toLowerCase()) !== -1 && r.date == date && r.price>=minPrice && r.price <= maxPrice);
  }
  },
};

export default resolvers;
