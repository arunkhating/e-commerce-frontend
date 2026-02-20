import React, { useEffect, useState } from "react";
import axios from "axios";

// ─── API Setup with JWT interceptor ──────────────────────────────────────────
const API = axios.create({ baseURL: "http://127.0.0.1:8000" });

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const DEMO_PRODUCTS = [
  { id: 1, name: "Wireless Headphones", description: "Premium noise-cancelling sound", price: 2499, rating: 4.5, reviews: 1284, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop", badge: "Best Seller" },
  { id: 2, name: "Smart Watch Pro", description: "Health & fitness tracking, AMOLED", price: 4999, rating: 4.3, reviews: 876, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop", badge: "New" },
  { id: 3, name: "Running Shoes", description: "Ultra-comfort foam sole, breathable", price: 1799, rating: 4.7, reviews: 3421, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", badge: "Top Rated" },
  { id: 4, name: "Laptop Backpack", description: "15.6\" waterproof, USB charging port", price: 899, rating: 4.2, reviews: 654, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop", badge: "" },
  { id: 5, name: "Bluetooth Speaker", description: "360° surround, IPX7 waterproof", price: 1299, rating: 4.6, reviews: 2109, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=300&h=300&fit=crop", badge: "Deal" },
  { id: 6, name: "Mechanical Keyboard", description: "RGB backlit, tactile switches", price: 3499, rating: 4.4, reviews: 987, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=300&h=300&fit=crop", badge: "" },
  { id: 7, name: "Sunglasses UV400", description: "Polarized lens, acetate frame", price: 599, rating: 4.1, reviews: 432, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&h=300&fit=crop", badge: "Sale" },
  { id: 8, name: "Ceramic Coffee Mug", description: "Double-wall insulated, 350ml", price: 349, rating: 4.8, reviews: 5632, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=300&h=300&fit=crop", badge: "Popular" },
];

const CATEGORIES = ["All", "Electronics", "Fashion", "Home", "Sports", "Books"];

function Stars({ rating }) {
  return (
    <span style={{ color: "#f59e0b", fontSize: 14 }}>
      {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      <span style={{ color: "#6b7280", marginLeft: 4, fontSize: 12 }}>{rating}</span>
    </span>
  );
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
      background: "#111827", color: "#fff", padding: "12px 24px", borderRadius: 50,
      fontWeight: 600, fontSize: 14, zIndex: 9999, boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
      display: "flex", alignItems: "center", gap: 8, animation: "slideUp 0.3s ease"
    }}>
      <span style={{ color: "#22c55e" }}>✓</span> {msg}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "12px 14px", border: "2px solid #e5e7eb",
  borderRadius: 10, fontSize: 14, marginBottom: 12, outline: "none",
  boxSizing: "border-box", transition: "border-color 0.2s", fontFamily: "inherit"
};

// ─── Login Modal — real API calls ─────────────────────────────────────────────
function LoginModal({ onClose, onLoginSuccess }) {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setErr("");
    if (!form.email || !form.password) { setErr("Please fill all fields."); return; }
    if (tab === "signup" && !form.full_name) { setErr("Please enter your name."); return; }
    setLoading(true);
    try {
      if (tab === "signup") {
        await API.post("/auth/register", { email: form.email, password: form.password, full_name: form.full_name });
      }
      const res = await API.post("/auth/login", { email: form.email, password: form.password });
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      onLoginSuccess(res.data.user);
      onClose();
    } catch (error) {
      const msg = error.response?.data?.detail;
      setErr(typeof msg === "string" ? msg : "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 20, padding: 40, width: 380, boxShadow: "0 24px 60px rgba(0,0,0,0.2)", position: "relative", animation: "popIn 0.25s ease" }} onClick={e => e.stopPropagation()}>
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "#f3f4f6", border: "none", borderRadius: 50, width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 6 }}>🛒</div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111" }}>ShopZone</h2>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 14 }}>India's Favourite Shopping Destination</p>
        </div>
        <div style={{ display: "flex", background: "#f3f4f6", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(""); }} style={{
              flex: 1, padding: "10px 0", border: "none", borderRadius: 10,
              background: tab === t ? "#fff" : "transparent",
              boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
              fontWeight: 700, cursor: "pointer", fontSize: 14,
              color: tab === t ? "#111" : "#6b7280", transition: "all 0.2s", textTransform: "capitalize"
            }}>{t === "login" ? "Login" : "Sign Up"}</button>
          ))}
        </div>
        <form onSubmit={handle}>
          {tab === "signup" && <input placeholder="Full Name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} style={inputStyle} />}
          <input placeholder="Email address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
          <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} style={inputStyle} />
          {err && <p style={{ color: "#ef4444", fontSize: 13, margin: "-4px 0 12px", background: "#fef2f2", padding: "8px 12px", borderRadius: 8 }}>⚠️ {err}</p>}
          <button type="submit" disabled={loading} style={{
            width: "100%", padding: "14px 0",
            background: loading ? "#9ca3af" : "linear-gradient(135deg,#f97316,#ef4444)",
            color: "#fff", border: "none", borderRadius: 12, fontWeight: 800,
            fontSize: 16, cursor: loading ? "not-allowed" : "pointer", marginTop: 4,
            boxShadow: "0 4px 20px rgba(239,68,68,0.4)"
          }}>
            {loading ? "Please wait..." : tab === "login" ? "Login →" : "Create Account →"}
          </button>
        </form>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9ca3af", marginTop: 20 }}>By continuing, you agree to our Terms & Privacy Policy</p>
      </div>
    </div>
  );
}

// ─── Cart Drawer ──────────────────────────────────────────────────────────────
const qtyBtn = { width: 28, height: 28, border: "2px solid #e5e7eb", background: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" };

function CartDrawer({ cart, onClose, onRemove, onQtyChange, user, onCheckout }) {
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const [ordered, setOrdered] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) { alert("Please login to place an order!"); return; }
    setLoading(true);
    try { await onCheckout(); setOrdered(true); }
    catch (err) { alert(err.response?.data?.detail || "Checkout failed. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 900, display: "flex", justifyContent: "flex-end", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div style={{ width: 400, height: "100%", background: "#fff", overflowY: "auto", animation: "slideRight 0.3s ease", display: "flex", flexDirection: "column" }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: "20px 24px", background: "linear-gradient(135deg,#1e3a5f,#2563eb)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>🛒 My Cart</h2>
            <p style={{ margin: "2px 0 0", fontSize: 13, opacity: 0.8 }}>{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: "#fff", borderRadius: 50, width: 36, height: 36, cursor: "pointer", fontSize: 18 }}>×</button>
        </div>
        <div style={{ flex: 1, padding: 20, overflowY: "auto" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60, color: "#9ca3af" }}>
              <div style={{ fontSize: 64, marginBottom: 16 }}>🛒</div>
              <p style={{ fontWeight: 600, fontSize: 16 }}>Your cart is empty</p>
              <p style={{ fontSize: 14 }}>Add items to get started!</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ display: "flex", gap: 14, marginBottom: 16, background: "#f9fafb", borderRadius: 14, padding: 14, alignItems: "center" }}>
              <img src={item.image} alt={item.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111" }}>{item.name}</p>
                <p style={{ margin: "2px 0 8px", color: "#22c55e", fontWeight: 800, fontSize: 15 }}>₹{item.price}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => onQtyChange(item.id, item.qty - 1)} style={qtyBtn}>−</button>
                  <span style={{ fontWeight: 700, minWidth: 20, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onQtyChange(item.id, item.qty + 1)} style={qtyBtn}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: "0 0 8px", fontWeight: 800, fontSize: 16 }}>₹{item.price * item.qty}</p>
                <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 20 }}>🗑</button>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "2px solid #f3f4f6" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><span style={{ color: "#6b7280" }}>Subtotal</span><span style={{ fontWeight: 700 }}>₹{total}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}><span style={{ color: "#6b7280" }}>Delivery</span><span style={{ color: "#22c55e", fontWeight: 700 }}>FREE</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20, fontWeight: 800, marginBottom: 20 }}><span>Total</span><span style={{ color: "#1e3a5f" }}>₹{total}</span></div>
            {ordered ? (
              <div style={{ background: "#dcfce7", borderRadius: 14, padding: 20, textAlign: "center" }}>
                <div style={{ fontSize: 36 }}>🎉</div>
                <p style={{ fontWeight: 800, color: "#16a34a", margin: "8px 0 4px" }}>Order Placed!</p>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>Estimated delivery: 2-3 days</p>
              </div>
            ) : (
              <button onClick={handleCheckout} disabled={loading} style={{
                width: "100%", padding: "16px 0",
                background: loading ? "#9ca3af" : "linear-gradient(135deg,#f97316,#ef4444)",
                color: "#fff", border: "none", borderRadius: 14, fontWeight: 800, fontSize: 16,
                cursor: loading ? "not-allowed" : "pointer", boxShadow: "0 6px 24px rgba(239,68,68,0.35)"
              }}>{loading ? "Placing Order..." : "Place Order →"}</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product, onAdd, inCart }) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const handleAdd = () => { onAdd(product); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  const discount = Math.floor(Math.random() * 30) + 10;
  const original = Math.round(product.price * (1 + discount / 100));

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: "#fff", borderRadius: 18, overflow: "hidden",
      boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.12)" : "0 4px 20px rgba(0,0,0,0.06)",
      transition: "all 0.3s ease", transform: hovered ? "translateY(-4px)" : "none",
      cursor: "pointer", display: "flex", flexDirection: "column"
    }}>
      <div style={{ position: "relative", background: "#f8fafc", overflow: "hidden" }}>
        <img src={product.image} alt={product.name} style={{ width: "100%", height: 220, objectFit: "cover", transition: "transform 0.4s ease", transform: hovered ? "scale(1.06)" : "scale(1)" }} />
        {product.badge && <span style={{ position: "absolute", top: 12, left: 12, background: product.badge === "Sale" ? "#ef4444" : product.badge === "New" ? "#8b5cf6" : "#f97316", color: "#fff", padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800 }}>{product.badge}</span>}
        <span style={{ position: "absolute", top: 12, right: 12, background: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: 50, fontSize: 11, fontWeight: 800 }}>{discount}% OFF</span>
      </div>
      <div style={{ padding: "16px 18px 20px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#111" }}>{product.name}</h3>
        <p style={{ margin: "0 0 10px", fontSize: 13, color: "#6b7280" }}>{product.description}</p>
        <div style={{ marginBottom: 10 }}>
          <Stars rating={product.rating || 4.0} />
          <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 4 }}>({(product.reviews || 0).toLocaleString()})</span>
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 16 }}>
          <span style={{ fontSize: 22, fontWeight: 900, color: "#111" }}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize: 14, color: "#9ca3af", textDecoration: "line-through" }}>₹{original.toLocaleString()}</span>
        </div>
        <button onClick={handleAdd} style={{
          marginTop: "auto", width: "100%", padding: "12px 0",
          background: added ? "#22c55e" : inCart ? "#1e3a5f" : "linear-gradient(135deg,#2563eb,#1e40af)",
          color: "#fff", border: "none", borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: "pointer", transition: "all 0.3s ease"
        }}>{added ? "✓ Added!" : inCart ? "➕ Add More" : "🛒 Add to Cart"}</button>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    // Restore session on refresh
    const savedUser = localStorage.getItem("user");
    if (savedUser) { try { setUser(JSON.parse(savedUser)); } catch {} }

    // Try real backend, fall back to demo products silently
    API.get("/products")
      .then(res => { if (res.data?.length) setProducts(res.data); })
      .catch(() => {});
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setToast(`Welcome, ${userData.full_name || userData.email}! 👋`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null); setCart([]); setUserMenuOpen(false);
    setToast("Logged out successfully");
  };

  const addToCart = (product) => {
    // Redirect to login if not logged in
    if (!user) { setShowLogin(true); setToast("Please login to add items!"); return; }
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setToast(`${product.name} added to cart!`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const changeQty = (id, qty) => {
    if (qty < 1) { removeFromCart(id); return; }
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  // Push local cart to backend, then place order
  const handleCheckout = async () => {
    for (const item of cart) {
      await API.post(`/cart/add?product_id=${item.id}&quantity=${item.qty}`);
    }
    await API.post("/orders/checkout");
    setCart([]);
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(search.toLowerCase())
  );
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      <style>{`
        @keyframes slideUp { from { opacity:0; transform: translateX(-50%) translateY(20px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
        @keyframes slideRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes popIn { from { opacity:0; transform: scale(0.92); } to { opacity:1; transform: scale(1); } }
        * { box-sizing: border-box; }
        input:focus { border-color: #2563eb !important; outline: none; }
        ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
      `}</style>

      {/* Navbar */}
      <nav style={{ background: "linear-gradient(135deg,#1e3a5f 0%,#1e40af 100%)", padding: "0 32px", display: "flex", alignItems: "center", gap: 20, height: 70, position: "sticky", top: 0, zIndex: 500, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 140 }}>
          <span style={{ fontSize: 28 }}>🛒</span>
          <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>Shop<span style={{ color: "#fbbf24" }}>Zone</span></span>
        </div>
        <div style={{ flex: 1, position: "relative", maxWidth: 600 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 18 }}>🔍</span>
          <input placeholder="Search products, brands and more..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "12px 16px 12px 42px", borderRadius: 12, border: "none", fontSize: 14, background: "#fff" }} />
        </div>
        <button onClick={() => setShowCart(true)} style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 12, padding: "10px 18px", cursor: "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
          🛒 Cart
          {cartCount > 0 && <span style={{ background: "#ef4444", color: "#fff", borderRadius: 50, width: 20, height: 20, fontSize: 11, fontWeight: 900, display: "flex", alignItems: "center", justifyContent: "center" }}>{cartCount}</span>}
        </button>
        <div style={{ position: "relative" }}>
          {user ? (
            <>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{ background: "rgba(255,255,255,0.15)", border: "2px solid rgba(255,255,255,0.3)", color: "#fff", borderRadius: 12, padding: "10px 18px", cursor: "pointer", fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 28, height: 28, background: "#fbbf24", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: 900, fontSize: 13 }}>
                  {(user.full_name || user.email || "U")[0].toUpperCase()}
                </span>
                {(user.full_name || user.email || "").split(" ")[0]}
              </button>
              {userMenuOpen && (
                <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 14, padding: 8, boxShadow: "0 12px 40px rgba(0,0,0,0.15)", minWidth: 180, zIndex: 600 }}>
                  <div style={{ padding: "10px 16px", fontSize: 12, color: "#9ca3af", borderBottom: "1px solid #f3f4f6", marginBottom: 4 }}>{user.email}</div>
                  {["My Orders", "Settings"].map(item => (
                    <div key={item} style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#374151" }}
                      onMouseEnter={e => e.target.style.background = "#f3f4f6"}
                      onMouseLeave={e => e.target.style.background = "transparent"}>{item}</div>
                  ))}
                  <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid #f3f4f6" }} />
                  <div onClick={handleLogout} style={{ padding: "10px 16px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#ef4444" }}
                    onMouseEnter={e => e.target.style.background = "#fef2f2"}
                    onMouseLeave={e => e.target.style.background = "transparent"}>Logout</div>
                </div>
              )}
            </>
          ) : (
            <button onClick={() => setShowLogin(true)} style={{ background: "#fff", border: "none", color: "#1e3a5f", borderRadius: 12, padding: "10px 22px", cursor: "pointer", fontWeight: 800, fontSize: 14, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              Login / Sign Up
            </button>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg,#1e3a5f,#2563eb,#7c3aed)", padding: "40px 32px", textAlign: "center", color: "#fff" }}>
        <h1 style={{ margin: "0 0 8px", fontSize: 36, fontWeight: 900, letterSpacing: -1 }}>🎉 Mega Sale is Live!</h1>
        <p style={{ margin: 0, fontSize: 16, opacity: 0.85 }}>Up to 70% off on top brands • Free delivery on all orders • Easy returns</p>
      </div>

      {/* Categories */}
      <div style={{ background: "#fff", padding: "16px 32px", display: "flex", gap: 10, overflowX: "auto", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        {CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)} style={{
            padding: "8px 20px", borderRadius: 50, border: "2px solid",
            borderColor: activeCategory === cat ? "#2563eb" : "#e5e7eb",
            background: activeCategory === cat ? "#2563eb" : "#fff",
            color: activeCategory === cat ? "#fff" : "#374151",
            fontWeight: 700, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s"
          }}>{cat}</button>
        ))}
      </div>

      {/* Products */}
      <div style={{ padding: "32px", maxWidth: 1400, margin: "0 auto" }}>
        <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#111" }}>
          {search ? `Results for "${search}"` : "Featured Products"}
          <span style={{ fontSize: 14, color: "#6b7280", fontWeight: 500, marginLeft: 8 }}>({filtered.length} items)</span>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} inCart={cart.some(i => i.id === product.id)} />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#111827", color: "#9ca3af", textAlign: "center", padding: "32px", fontSize: 14, marginTop: 32 }}>
        <div style={{ fontSize: 28, marginBottom: 8 }}>🛒</div>
        <p style={{ margin: 0, fontWeight: 700, color: "#fff", fontSize: 18 }}>ShopZone</p>
        <p style={{ margin: "8px 0 0" }}>© 2024 ShopZone. India's Favourite Shopping Destination.</p>
      </footer>

      {showCart && <CartDrawer cart={cart} onClose={() => setShowCart(false)} onRemove={removeFromCart} onQtyChange={changeQty} user={user} onCheckout={handleCheckout} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLoginSuccess={handleLoginSuccess} />}
      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </div>
  );
}