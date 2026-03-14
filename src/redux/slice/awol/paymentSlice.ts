// import api from "@/src/api";
// import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// interface PaymentState {
//     payments: any[];
//     status: string;
// }

// const initialState: PaymentState = {
//     payments: [],
//     status: "idle",
// };

// // ADD PAYMENT
// export const addPayment = createAsyncThunk(
//     "payments/add",
//     async ({token, data}: {token: string, data: any}) => {
//         const res = await api.post( "v1/awol/payments/add/", data, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         });
//         return res.data;
//     }
// );

// const paymentSlice = createSlice({
//     name: "payment",
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder.addCase(addPayment.fulfilled, (state, action) => {
//         state.payments.push(action.payload);
//         });
//     },
// });

// export default paymentSlice.reducer;
import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "./customerSlice";
import { ProductModel } from "./productSlice";



export interface Sale {
  id: number;
  customer: Customer;
  product_model: ProductModel;
  balance: number;
  status: string;
}

export interface Payment {
  id: number;
  sale_details: Sale;

  amount_paid: number;
  payment_date: string;

  method: "cash" | "transfer" | "pos";
  reference?: string | null;

  received_by?: string | null;
  notes?: string | null;

  created_at: string;

  // optional serializer extras
  customer_name?: string;
  product_name?: string;
  model_name?: string;
}
interface PaymentState {
  payments: Payment[];
  count: number;
  next: string | null;
  previous: string | null;
  selectedPayment: Payment | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PaymentState = {
  payments: [],
  selectedPayment: null,
  status: "idle",
  error: null,
  next: null,
  previous: null,
  count: 0,
};

//
// FETCH ALL PAYMENTS
//
// export const fetchPayments = createAsyncThunk(
//   "payments/fetchAll",
//   async (token: string, { rejectWithValue }) => {
//     try {
//       console.log("Fetching payments with token:", token);
//       const res = await api.get("v1/awol/payments/", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       console.log("API response:", res.data);
//       return res.data;
//     } catch (err: any) {
//       return rejectWithValue(err.response?.data || "Failed to fetch payments");
//     }
//   }
// );
export const fetchPayments = createAsyncThunk(
  "payments/fetchAll",
  async (
    {
      token,
      params,
    }: {
      token: string;
      params?: Record<string, any>;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get("v1/awol/payments/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params, // 🔥 THIS sends filters to backend
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch payments"
      );
    }
  }
);
//
// FETCH SINGLE PAYMENT
//
export const fetchSinglePayment = createAsyncThunk(
  "payments/fetchSingle",
  async (
    { token, id }: { token: string; id: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get(`v1/awol/payments/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Failed to fetch payment");
    }
  }
);

//
// ADD PAYMENT
//
export const addPayment = createAsyncThunk(
  "payments/add",
  async (
    { token, data }: { token: string; data: any },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post("v1/awol/payments/add/", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || "Payment failed");
    }
  }
);

//
// SLICE
//
const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearSelectedPayment: (state) => {
      state.selectedPayment = null;
    },
    resetPaymentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      //
      // FETCH ALL
      //
      .addCase(fetchPayments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.payments = action.payload.results || action.payload; // support both paginated and non-paginated responses
        state.count = action.payload.count || state.payments.length;
        state.next = action.payload.next || null;
        state.previous = action.payload.previous || null;
      })
      .addCase(fetchPayments.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      //
      // FETCH SINGLE
      //
      .addCase(fetchSinglePayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSinglePayment.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.status = "succeeded";
        state.selectedPayment = action.payload;
      })
      .addCase(fetchSinglePayment.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      })

      //
      // ADD PAYMENT
      //
      .addCase(addPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.status = "succeeded";
        state.payments.unshift(action.payload); // add to top
      })
      .addCase(addPayment.rejected, (state, action: any) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearSelectedPayment, resetPaymentState } =
  paymentSlice.actions;

export default paymentSlice.reducer;