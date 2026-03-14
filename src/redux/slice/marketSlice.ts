import api from "@/src/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types ---
export interface HeadlinesResponse {
  headlines: string[];
  count: number;
  timestamp: string;
}

interface HeadlinesState {
  data: HeadlinesResponse | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Initial States ---
const headlinesInitialState: HeadlinesState = {
  data: null,
  status: "idle",
  error: null,
};
// --- Generic Types ---
interface MarketDataState<T> {
  data: T | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

// --- Types ---
export interface FxRates {
  fx_rates: Record<string, number>;
  crypto_rates_usd: Record<string, number>;
  crypto_rates_ngn: Record<string, number>;
  base_usd_rate: number;
}

// --- Initial States ---
const fxInitialState: MarketDataState<FxRates> = {
  data: null,
  status: "idle",
  error: null,
};

const snapshotInitialState: MarketDataState<any> = {
  data: null,
  status: "idle",
  error: null,
};

const equityInitialState: MarketDataState<any> = {
  data: null,
  status: "idle",
  error: null,
};

const bondInitialState: MarketDataState<any> = {
  data: null,
  status: "idle",
  error: null,
};

const etfInitialState: MarketDataState<any> = {
  data: null,
  status: "idle",
  error: null,
};

// --- Thunks ---
export const fetchFxRates = createAsyncThunk("market/fetchFxRates", async () => {
  const response = await api.get("v1/market/crawl-rates/");
  return response.data as FxRates;
});

export const fetchMarketSnapshot = createAsyncThunk("market/fetchMarketSnapshot", async () => {
  const response = await api.get("v1/market/ngx/");
  return response.data;
});

export const fetchMarketEquity = createAsyncThunk("market/fetchMarketEquity", async () => {
  const response = await api.get("v1/market/equity/");
  return response.data;
});

export const fetchMarketBond = createAsyncThunk("market/fetchMarketBond", async () => {
  const response = await api.get("v1/market/bond/");
  return response.data;
});

export const fetchMarketETF = createAsyncThunk("market/fetchMarketETF", async () => {
  const response = await api.get("v1/market/etf/");
  return response.data;
});

export const fetchHeadlines = createAsyncThunk(
  "market/fetchHeadlines", 
  async () => {
    const response = await api.get("v1/market-monitoring/headlines/");
    return response.data as HeadlinesResponse;
  }
);

// --- FX Slice ---
const fxSlice = createSlice({
  name: "fxRates",
  initialState: fxInitialState,
  reducers: {
    setFxRates: (state, action: PayloadAction<FxRates>) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFxRates.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFxRates.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchFxRates.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch FX rates.";
      });
  },
});

// --- Snapshot Slice ---
const snapshotSlice = createSlice({
  name: "marketSnapshot",
  initialState: snapshotInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketSnapshot.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketSnapshot.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMarketSnapshot.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch snapshot.";
      });
  },
});

// --- Equity Slice ---
const equitySlice = createSlice({
  name: "marketEquity",
  initialState: equityInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketEquity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketEquity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMarketEquity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch equity.";
      });
  },
});

// --- Bond Slice ---
const bondSlice = createSlice({
  name: "marketBond",
  initialState: bondInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketBond.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketBond.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMarketBond.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch bond.";
      });
  },
});

// --- ETF Slice ---
const etfSlice = createSlice({
  name: "marketETF",
  initialState: etfInitialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMarketETF.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMarketETF.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchMarketETF.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch ETF.";
      });
  },
});

// --- Headlines Slice ---
const headlinesSlice = createSlice({
  name: "headlines",
  initialState: headlinesInitialState,
  reducers: {
    clearHeadlines: (state) => {
      state.data = null;
      state.status = "idle";
      state.error = null;
    },
    addHeadline: (state, action: PayloadAction<string>) => {
      if (state.data) {
        state.data.headlines = [action.payload, ...state.data.headlines].slice(0, 7);
        state.data.count = state.data.headlines.length;
        state.data.timestamp = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeadlines.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHeadlines.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchHeadlines.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch headlines.";
      });
  },
});


export const { clearHeadlines, addHeadline } = headlinesSlice.actions;
// --- Export Reducers ---
export const fxReducer = fxSlice.reducer;
export const snapshotReducer = snapshotSlice.reducer;
export const equityReducer = equitySlice.reducer;
export const bondReducer = bondSlice.reducer;
export const etfReducer = etfSlice.reducer;
export const headlinesReducer = headlinesSlice.reducer;
