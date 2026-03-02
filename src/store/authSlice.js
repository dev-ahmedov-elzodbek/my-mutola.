import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const AUTH_BASE = 'https://json-api.uz/api/project/chizmachilik/auth';


export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${AUTH_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Ro'yxatdan o'tishda xatolik");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      // Local admin fallback for guaranteed access from login page.
      if (String(username).trim() === 'admin' && String(password) === 'admin123') {
        const now = Date.now();
        return {
          user: { username: 'admin', type: 'admin', id: 'local-admin' },
          access_token: `local-admin-access-${now}`,
          refresh_token: `local-admin-refresh-${now}`,
        };
      }

      const res = await fetch(`${AUTH_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Login yoki parol noto'g'ri");
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refresh-token',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { refresh_token } = getState().auth;

      if (!refresh_token) throw new Error('Refresh token yo‘q');

      const res = await fetch(`${AUTH_BASE}/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || 'Token yangilashda xatolik');
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getUser = createAsyncThunk(
  'auth/get-user',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { access_token } = getState().auth;

      if (!access_token) throw new Error('Access token yo‘q');

      const res = await fetch(`${AUTH_BASE}/get-user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message || "Foydalanuvchi ma'lumotlarini olishda xatolik"
        );
      }

      return data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);



function loadAuthFromStorage() {
  try {
    const raw = localStorage.getItem('auth_state');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveAuthToStorage(state) {
  try {
    localStorage.setItem(
      'auth_state',
      JSON.stringify({
        access_token: state.access_token,
        refresh_token: state.refresh_token,
        user: state.user,
      })
    );
  } catch {}
}

function clearAuthStorage() {
  try {
    localStorage.removeItem('auth_state');
  } catch {}
}



const stored = loadAuthFromStorage();

const initialState = {
  user: stored?.user || null,
  access_token: stored?.access_token || null,
  refresh_token: stored?.refresh_token || null,
  loading: false,
  error: null,
  isAuthenticated: Boolean(stored?.access_token),
  authMode: 'login',
};


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      state.error = null;
      clearAuthStorage();
    },
    setAuthMode(state, action) {
      state.authMode = action.payload;
      state.error = null;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        const d = action.payload || {};
        state.access_token = d.access_token || d.accessToken || null;
        state.refresh_token = d.refresh_token || d.refreshToken || null;
        state.user = d.user || d.data || null;
        state.isAuthenticated = Boolean(state.access_token);
        saveAuthToStorage(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Xatolik yuz berdi';
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const d = action.payload || {};
        state.access_token = d.access_token || d.accessToken || null;
        state.refresh_token = d.refresh_token || d.refreshToken || null;
        state.user = d.user || d.data || null;
        state.isAuthenticated = Boolean(state.access_token);
        saveAuthToStorage(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Xatolik yuz berdi';
      });

    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        const d = action.payload || {};
        state.access_token = d.access_token || d.accessToken || state.access_token;
        state.refresh_token = d.refresh_token || d.refreshToken || state.refresh_token;
        saveAuthToStorage(state);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.user = null;
        state.access_token = null;
        state.refresh_token = null;
        state.isAuthenticated = false;
        clearAuthStorage();
      });

    builder.addCase(getUser.fulfilled, (state, action) => {
      state.user = action.payload?.user || action.payload?.data || action.payload;
      saveAuthToStorage(state);
    });
  },
});

export const { logout, setAuthMode, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
