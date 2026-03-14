import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Company {
    id: number;
    name: string;
    company_type: string;
    phone?: string;
    address?: string;
    products?: string[];
    created_at?: string;
    updated_at?: string;
    contact_person: string;
}

interface CompanyState {
    companies: Company[];
    company: Company | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: CompanyState = {
    companies: [],
    company: null,
    status: "idle",
    error: null,
};

// GET ALL COMPANIES
export const fetchCompanies = createAsyncThunk(
    "companies/fetchAll",
    async ({token, search, page}: {token: string, search?: string, page?: number}) => {
        const response = await api.get( `v1/awol/companies?search=${search || ""}&page=${page || 1}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
);

// GET SINGLE COMPANY
export const fetchCompanyDetails = createAsyncThunk(
    "companies/fetchOne",
    async ({token, id}: {token: string, id: string}) => {
        const response = await api.get( `v1/awol/companies/${id}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
);

// ADD COMPANY
export const addCompany = createAsyncThunk(
    "companies/add",
    async ({token, data}: {token: string, data: Partial<Company>}) => {
        const response = await api.post( `v1/awol/companies/register/`, data, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
);

const companySlice = createSlice({
    name: "company",
    initialState,
    reducers: {
        clearCompany: (state) => {
            state.company = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCompanies.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchCompanies.fulfilled, (state, action: PayloadAction<any>) => {
                state.status = "succeeded";
                state.companies = action.payload.results || action.payload;
            })
            .addCase(fetchCompanies.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Error fetching companies";
            })
            .addCase(fetchCompanyDetails.fulfilled, (state, action) => {
                state.company = action.payload;
            })

            .addCase(addCompany.fulfilled, (state, action) => {
                state.companies.unshift(action.payload);
            });
    },
});

export const { clearCompany } = companySlice.actions;
export default companySlice.reducer;
