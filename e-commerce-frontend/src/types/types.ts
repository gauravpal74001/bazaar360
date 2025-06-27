export interface User {
     name:string,
     photo:string,
     email:string,
     dob:string,
     role:string,
     gender:string,
     _id:string
};

export interface UserResponse{
     success:boolean,
     user:User
};

export interface Product{
     name:string,
     price:number,
     photo:string,
     category:string,
     stock:number,
     _id:string
};

export interface ProductResponse{
     success:boolean,
     products:Product[]
};

export interface CategoryResponse{
     success:boolean,
     categories:string[]
};

export interface SearchProductResponse{
     success:boolean,
     products:Product[], 
     totalPage:number
};

export interface SearchProductQuery{
     page:number,
     sort:string,
     category:string,
     search:string,
     price:number,
}

export interface CustomError{
      data:{
          success:boolean,
          message:string
      }
      status:number
};

export interface newProductRequest{
    id:string,
    formData:FormData
};

export type ProductDetailsResponse ={ 
     success:boolean,
     product:Product,
};

export type updateProductRequest ={
     user_id:string,
     product_id:string,
     formData:FormData
};

export type deleteProductRequest ={
    user_id:string,
    product_id:string
};

export type cartItems ={
     name:string,
     price:number ,
     quantity:number,
     stock:number,
     photo:string,
     productId:string
};

export type shippingInfo= {
     address:string,
     city:string,
     state:string,
     country:string,
     pinCode:string
};

export type orderItems ={
     name:string,
     price:number,
     quantity:number,
     photo:string,
     productId:string
}

export type newOrderRequestType ={
     shippingInfo:shippingInfo,
     user:string,
     subTotal:number,
     tax:number,
     shippingCharges:number,
     discount:number,
     totalAmount:number,
     status:string,
     orderItems:orderItems[]
};

export type orderitems ={
     name:string,
     price:number,
     quantity:number,
     photo:string,
     productId:string,
     _id:string
}

export type Order = {
   shippingInfo : shippingInfo,
   _id:string,
   user:{
     name:string,
     _id:string,
   },
   subTotal:number,
   tax:number,
   shippingCharges:number,
   discount:number,
   totalAmount:number,
   status:string,
   orderItems: orderitems[]
};

export type OrderDetailsResponse ={
     success:boolean,
     order:Order
};

export type AllOrdersResponse ={
   success:boolean,    
   orders:Order[]
};

export type updateOrderRequest ={
     order_id:string,
     user_id:string
};

export type PayButtonProps = {
     cartItems: cartItems[];
     subTotal: number;
     tax: number;
     shippingCharges: number;
     discount: number;
     total: number;
};

export type newPaymnetResponse = {
  success:boolean,
  order:{
     amount:number,
     amount_due:number,
     amount_paid:number,
     attempts:number,
     created_at:number,
     currency:string,
     entity:string,
     id:string,
     notes:string[],
     offer_id:string,
     receipt:string,
     status:string
  }
};

export type deleteUserRequestType ={
     user_id:string,
     admin_id:string
};

export type AllUserResponse ={
     success:boolean,
     users:User[]
};

export type LatestTransaction ={
     _id:string,
     discount:number,
     status:string,
     quantity:number,
     amount:number
}

export type Stats ={
    Revenue:number,
    changePercentage:{
        revenuePercentage:number,
        UserPercentage:number,
        OrderPercentage:number,
        ProductPercentage:number
    },
    count:{
        users:number,
        orders:number,
        products:number
    },
    sixMonthOrderCount:number[],
    sixMonthOrderRevenue:number[],
    categoriesCount:Record<string,number>[],
    ratio:{
        male:number,
        female:number
    },
    modifiedLatestTransaction:LatestTransaction[]
};

export type dashboardResponse ={
     success:boolean,
     stats:Stats
}


type Charts={
    fullfillment:{
        processOrder:number,
        shippedOrder:number,
        deliveredOrder:number
    },
    categoryCount:Record<string,number>[],
    stockAvailablity:{
        inStock:number,
        outOfStock:number
    },
    RevenueDistribution:{
        NetMargin:number,
        discount:number,
        productionCost:number,
        burnt:number,
        marketingCost:number
    },
    AdminsAndCustomers:{
        admins:number,
        customers:number
    },
    UserAgeGroup:{
        teen:number,
        adult:number,
        senior:number
    }
};

export type PieChartResponse ={
    success:boolean,
    charts:Charts
};

export type barChartResponse ={
    success:boolean,
    charts:{
     productsCount:number[],
     usersCount:number[],
     ordersCount:number[]
    }
};

export type lineChartResponse ={
     success:boolean,
     charts:{
        productsCount:number[],
        usersCount:number[],
        revenue:number[],
        discount:number[]
     }
};
