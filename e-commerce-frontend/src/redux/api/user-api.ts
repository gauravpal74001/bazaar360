import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type { AllUserResponse, deleteUserRequestType, User, UserResponse } from "../../types/types";
import type { messageResponse } from "../../types/api-types";
import axios, { AxiosError } from "axios";


export const userApi = createApi ({
    reducerPath:"userApi", 
    baseQuery:fetchBaseQuery({baseUrl:`${import.meta.env.VITE_SERVER_URL}/api/v1/user`}), 
    tagTypes:["users"],
    endpoints: (builder) => ({
        login: builder.mutation<messageResponse , User>({
            query: (user) => ({
                url: "/new",
                method: "POST",
                body: user
            }), 
            invalidatesTags:["users"]
        }),
        getAllUsers: builder.query<AllUserResponse,string>({
             query : (id)=>(`/all?id=${id}` ), 
             providesTags:["users"]
        }),
        deleteUser:builder.mutation<messageResponse, deleteUserRequestType>({
            query: ({user_id, admin_id})=>({
                url: `/${user_id}?id=${admin_id}`,
                method: "DELETE"
            }),
            invalidatesTags:["users"]
        })
    })

});

export const getUser = async (id : string) => {
 try {
    const {data}:{data:UserResponse} = await axios.get( `${import.meta.env.VITE_SERVER_URL}/api/v1/user/${id}`);
    return data;
 } catch (error) {
    if (error instanceof AxiosError) {
        // Handle axios specific errors
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data.message || `Server error: ${error.response.status}`);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error("No response received from server");
        } else {
            // Error in request setup
            throw new Error(`Request error: ${error.message}`);
        }
    }
    // Handle non-axios errors
    throw new Error("An unexpected error occurred");
 }
};

export const {useLoginMutation , useGetAllUsersQuery , useDeleteUserMutation } = userApi;