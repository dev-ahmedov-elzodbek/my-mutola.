import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_URL = 'https://json-api.uz/api/project/chizmachilik/materials';

const STORAGE_KEY = 'chizmachilik_materials_local';

function readLocal() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { added: [], updatedById: {} };
    const parsed = JSON.parse(raw);
    return {
      added: Array.isArray(parsed.added) ? parsed.added : [],
      updatedById:
        parsed.updatedById && typeof parsed.updatedById === 'object' ? parsed.updatedById : {},
    };
  } catch {
    return { added: [], updatedById: {} };
  }
}

function writeLocal(next) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    
  }
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === 'string') {
    return value
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function applyFilter(items, query) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return items;

  return items.filter((item) => {
    const authors = normalizeList(item?.authors);
    const keywords = normalizeList(item?.keywords);

    return (
      item.title?.toLowerCase().includes(q) ||
      item.summary?.toLowerCase().includes(q) ||
      item.resourceType?.toLowerCase().includes(q) ||
      authors.some((author) => author.toLowerCase().includes(q)) ||
      keywords.some((keyword) => keyword.toLowerCase().includes(q))
    );
  });
}


export const fetchMaterials = createAsyncThunk(
  'materials/fetchMaterials',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch materials');
      }
      const data = await response.json();
      return data.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

function mergeRemoteWithLocal(remoteItems) {
  const local = readLocal();
  const updatedById = local.updatedById || {};

  const mergedRemote = (Array.isArray(remoteItems) ? remoteItems : []).map((it) => {
    const patch = updatedById[it?.id];
    return patch ? { ...it, ...patch } : it;
  });

  const added = Array.isArray(local.added) ? local.added : [];
  return [...mergedRemote, ...added];
}

const materialsSlice = createSlice({
  name: 'materials',
  initialState: {
    items: [],
    filteredItems: [],
    loading: false,
    error: null,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredItems = applyFilter(state.items, state.searchQuery);
    },

    addMaterial: (state, action) => {
      const material = action.payload;
      if (!material) return;

      state.items = [material, ...state.items];
      state.filteredItems = applyFilter(state.items, state.searchQuery);

      const local = readLocal();
      local.added = [material, ...(local.added || [])];
      writeLocal(local);
    },

    updateMaterial: (state, action) => {
      const { id, changes } = action.payload || {};
      if (!id || !changes) return;

      state.items = state.items.map((it) => (it.id === id ? { ...it, ...changes } : it));
      state.filteredItems = applyFilter(state.items, state.searchQuery);

      const local = readLocal();
      local.updatedById = {
        ...(local.updatedById || {}),
        [id]: { ...(local.updatedById?.[id] || {}), ...changes },
      };
      writeLocal(local);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        const merged = mergeRemoteWithLocal(action.payload);
        state.items = merged;
        state.filteredItems = applyFilter(merged, state.searchQuery);
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, addMaterial, updateMaterial } = materialsSlice.actions;
export default materialsSlice.reducer;
