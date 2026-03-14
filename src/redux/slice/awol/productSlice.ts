import api from "@/src/api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { stat } from "fs";

export interface Product {
    id: number;
    name: string;
    company: number;

}

export interface ProductModel {
    id: number;
    product: number;
    model_name: string;
    cash_price: string;
    installment_price: string;
    down_payment: string;
    installment_months: number;
    installment_allowed: boolean;
    default_image: string;
    other_images: string[];
    features: Record<string, string>;
    stock_quantity: number;
}

interface ProductState {
    products: Product[];
    product: Product | null;
    models: ProductModel[];
    status: string;
    error: string | null;
}

const initialState: ProductState = {
    products: [],
    product: null,
    models: [],
    status: "idle",
    error: null,
};

// ALL PRODUCTS
export const fetchProducts = createAsyncThunk("products/all", async ({token, page = 1}: {token: string, page?: number}) => {
    const res = await api.get( `v1/awol/products/?page=${page}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data.results || res.data;
});

// ADD PRODUCT
export const addProduct = createAsyncThunk("products/add", async ({token, data}: {token: string, data: any}) => {
    const res = await api.post( "v1/awol/products/add/", data, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return res.data;
});


// SINGLE PRODUCT (details + models)
export const fetchProductDetails = createAsyncThunk(
    "products/details",
    async ({token, id}: {token: string, id: string}) => {
        const res = await api.get( `v1/awol/products/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

// ADD PRODUCT MODEL
export const addProductModel = createAsyncThunk(
    "products/addModel",
    async ({token, data}: {token: string, data: any}) => {
        const res = await api.post( "v1/awol/products/model/add/", data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return res.data;
    }
);

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state) => {
                state.status = "failed";
            })
            // .addCase(addProduct.pending, (state) =>{
            //     state.status = "loading";
            // })
            .addCase(addProduct.fulfilled, (state, action) => {
                state.products.push(action.payload);
            })
            .addCase(addProduct.rejected, (state) => {
                state.status = "failed";
            })
            // .addCase(fetchProductDetails.pending, (state) => {
            //     state.status = "loading";
            // })
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.product = action.payload;
                state.models = action.payload.models || [];
            })
            .addCase(fetchProductDetails.rejected, (state) => {
                state.status = "failed";
            })
            // .addCase(addProductModel.pending, (state) => {
            //     state.status = "loading";
            // })
            .addCase(addProductModel.fulfilled, (state, action) => {
                state.models.push(action.payload);
            })
            .addCase(addProductModel.rejected, (state) => {
                state.status = "failed";
            });
    },
});

export default productSlice.reducer;
