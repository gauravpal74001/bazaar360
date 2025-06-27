import { createApi , fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { CategoryResponse, ProductResponse, SearchProductQuery, SearchProductResponse  , newProductRequest , ProductDetailsResponse , updateProductRequest , deleteProductRequest} from "../../types/types";
import type { messageResponse } from "../../types/api-types";

export const productApi = createApi({
    reducerPath:"productApi",
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER_URL}/api/v1/product`}),
    tagTypes:["product"],
     endpoints:(builder)=>({
        latestProducts : builder.query<ProductResponse , string >({query: ()=> "/latest" , providesTags:["product"] }),
        allProducts : builder.query<ProductResponse , string>({query:(id)=>`/admin/?id=${id}` , providesTags:["product"]}),
        categories : builder.query<CategoryResponse , string>({query: ()=> "/categories" , providesTags:["product"] }) , 
        searchProducts : builder.query<SearchProductResponse , SearchProductQuery>({query: ({page , sort ,category ,price , search})=> {
           let base=`/all?search=${search}&page=${page}`;
           if(sort) base+=`&sort=${sort}`;
           if(price) base+=`&price=${price}`;
           if(category) base+=`&category=${category}`;

            return base;
        } , providesTags:["product"]}),
        productdetails :builder.query<ProductDetailsResponse, string>({query:(id)=> id , providesTags:["product"]}),
        newProducts: builder.mutation<messageResponse, newProductRequest>({
            query: ({id, formData}) => ({
                url: `/new?id=${id}`,
                method: "POST",
                body: formData,
                invalidatesTags:["product"]
            })
        }),
        updadteProducts: builder.mutation<messageResponse, updateProductRequest>({
            query: ({user_id , product_id, formData}) => ({
                url: `${product_id}/?id=${user_id}`,
                method: "PUT",
                body: formData,
                invalidatesTags:["product"]
            })
        }),
        deleteProducts: builder.mutation<messageResponse, deleteProductRequest>({
            query: ({user_id , product_id}) => ({
                url: `${product_id}/?id=${user_id}`,
                method: "DELETE",
                invalidatesTags:["product"]
            })
        })
    })
});

export const {useLatestProductsQuery, useAllProductsQuery , useCategoriesQuery , useSearchProductsQuery ,
     useNewProductsMutation, useProductdetailsQuery , useUpdadteProductsMutation , useDeleteProductsMutation}=productApi;