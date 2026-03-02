import React, { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SplashScreen from "./components/SplashScreen";
import Navbar from "./components/Navbar";
import MaterialsCarousel from "./components/MaterialsCarousel";
import { addMaterial, fetchMaterials, updateMaterial } from "./store/materialsSlice";
import { setTheme } from "./store/themeSlice";
import { logout } from "./store/authSlice";
import { Loader2 } from "lucide-react";
import { HackerBackground } from "@/components/ui/hacker-background";
import MaterialFormModal from "./components/MaterialFormModal";
import AuthorStories from "./components/AuthorStories";
import StoryModal from "./components/StoryModal";
import LoginPage from "./components/LoginPage";

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") {
    return value
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [showSplash, setShowSplash] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editingMaterial, setEditingMaterial] = useState(null);

  
  const [activeAuthor, setActiveAuthor] = useState(null);
  const [viewedAuthors, setViewedAuthors] = useState(() => {
    try {
      const raw = localStorage.getItem("viewedAuthors");
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  });

  const { loading, error, items } = useSelector((state) => state.materials);
  const themeMode = useSelector((state) => state.theme.mode);

  const totalMaterials = items.length;

  const totalAuthors = useMemo(() => {
    const authors = new Set();
    for (const m of items) {
      const list = normalizeList(m?.authors);
      for (const a of list) authors.add(a);
    }
    return authors.size;
  }, [items]);

  const totalResourceTypes = useMemo(() => {
    const types = new Set();
    for (const m of items) {
      if (m?.resourceType) types.add(m.resourceType);
    }
    return types.size;
  }, [items]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    dispatch(setTheme(savedTheme));
  }, [dispatch]);

  
  useEffect(() => {
    try {
      localStorage.setItem(
        "viewedAuthors",
        JSON.stringify(Array.from(viewedAuthors))
      );
    } catch {
      
    }
  }, [viewedAuthors]);

  useEffect(() => {
    dispatch(fetchMaterials());
  }, [dispatch]);

  const handleLoadingComplete = () => {
    setShowSplash(false);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const openEditModal = (material) => {
    setModalMode("edit");
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmitModal = (payload) => {
    if (modalMode === "edit" && editingMaterial?.id) {
      dispatch(updateMaterial({ id: editingMaterial.id, changes: payload }));
      closeModal();
      return;
    }

    const newMaterial = {
      id: `local-${Date.now()}`,
      ...payload,
    };
    dispatch(addMaterial(newMaterial));
    closeModal();
  };

  const openAuthorStory = (author) => {
    setActiveAuthor(author);
  };

  const closeStory = () => {
    setActiveAuthor(null);
  };

  const markAuthorViewed = (authorName) => {
    setViewedAuthors((prev) => {
      const next = new Set(prev);
      next.add(authorName);
      return next;
    });
  };

  // ── Not authenticated → show login ──────────────────────────────────────
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      
      <HackerBackground
        color={themeMode === "dark" ? "#22d3ee" : "#0ea5e9"}
        fontSize={8}
        speed={1.2}
        className="opacity-25"
      />

      
      <div className="relative z-10 min-h-screen">
        {showSplash ? (
          <SplashScreen onLoadingComplete={handleLoadingComplete} />
        ) : (
          <>
            <Navbar onAddClick={openAddModal} onLogout={() => dispatch(logout())} user={user} />

          
            <div className="container mx-auto px-4">
              <AuthorStories onAuthorClick={openAuthorStory} viewedAuthors={viewedAuthors} />
            </div>

            <main className="container mx-auto px-4 py-8">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  Chizmachilik Materiallari
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                  O&apos;zbekiston bo&apos;yicha chizmachilik fani bo&apos;yicha eng
                  to&apos;liq materiallar to&apos;plami. Darsliklar, qo&apos;llanmalar,
                  taqdimotlar va ko&apos;proq.
                </p>
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                  <Loader2 size={48} className="text-primary animate-spin mb-4" />
                  <p className="text-lg text-muted-foreground">
                    Materiallar yuklanmoqda...
                  </p>
                </div>
              )}

              {error && (
                <div className="flex flex-col items-center justify-center min-h-[400px] animate-fade-in">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                      <span className="text-4xl">⚠️</span>
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">
                      Xatolik yuz berdi
                    </h3>
                    <p className="text-muted-foreground max-w-md">{error}</p>
                    <button
                      onClick={() => dispatch(fetchMaterials())}
                      className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300"
                    >
                      Qayta urinish
                    </button>
                  </div>
                </div>
              )}

              {!loading && !error && (
                <div className="animate-fade-in">
                  <MaterialsCarousel onEdit={openEditModal} />
                </div>
              )}

              {!loading && !error && (
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-slide-up">
                  <div className="p-6 rounded-2xl bg-secondary/50 border border-border text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {totalMaterials}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Jami materiallar
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-secondary/50 border border-border text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {totalAuthors}
                    </div>
                    <div className="text-sm text-muted-foreground">Mualliflar</div>
                  </div>
                  <div className="p-6 rounded-2xl bg-secondary/50 border border-border text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {totalResourceTypes}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Resurs turlari
                    </div>
                  </div>
                </div>
              )}
            </main>

            <footer className="mt-20 py-8 border-t border-border">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-muted-foreground">
                  © 2024 Chizmachilik Materiallari. Barcha huquqlar himoyalangan.
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Ma&apos;lumotlar manbai:{" "}
                  <a
                    href="https://json-api.uz"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    json-api.uz
                  </a>
                </p>
              </div>
            </footer>
          </>
        )}
      </div>

   
      <StoryModal
        author={activeAuthor}
        onClose={closeStory}
        onMarkViewed={markAuthorViewed}
      />

      <MaterialFormModal
        open={isModalOpen}
        mode={modalMode}
        initialMaterial={editingMaterial}
        onClose={closeModal}
        onSubmit={handleSubmitModal}
      />
    </div>
  );
}

export default App;
