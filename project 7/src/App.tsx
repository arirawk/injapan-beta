import React, { useState, useEffect } from "react";
import { ShoppingCart, Plus, Minus, Phone, MapPin, Clock, X, Leaf, Menu, ExternalLink, Package, ArrowLeft, Star, Heart, User, LogOut, Settings } from "lucide-react";
import LoginModal from "./components/LoginModal";
import AdminDashboard from "./components/AdminDashboard";
import { supabase } from "./lib/supabase";

// ===== KONFIGURASI YANG BISA DIUBAH =====
const STORE_NAME = "injapan.food";
const WHATSAPP_NUMBER = "6285155452259";

// URL Google Apps Script untuk mengirim data ke Google Sheets
// Ganti dengan URL Apps Script yang sudah di-deploy
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Email admin yang memiliki akses penuh
const ADMIN_EMAILS = [
  "admin@injapan.food",
  "wahyuari29@gmail.com",
  "owner@injapan.food"
];

// Data produk - bisa diubah sesuai kebutuhan
const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Cabe Rawit Merah",
    price: 600,
    img: "https://images.pexels.com/photos/1328964/pexels-photo-1328964.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Bumbu Segar",
    description: "Cabe rawit merah pilihan untuk masakan pedas",
    longDescription: "Cabe rawit merah berkualitas premium yang dipetik langsung dari kebun terpilih. Dengan tingkat kepedasan yang pas, cabe rawit ini cocok untuk berbagai masakan Indonesia seperti sambal, tumisan, dan rendang. Dikemas dalam kondisi segar dan higienis.",
    stock: 25, // Ubah ke 0 untuk menampilkan "Stok Habis"
    weight: "100g",
    origin: "Jawa Barat",
    images: [
      "https://images.pexels.com/photos/1328964/pexels-photo-1328964.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1328964/pexels-photo-1328964.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1328964/pexels-photo-1328964.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 2,
    name: "Daun Jeruk Purut",
    price: 500,
    img: "https://images.pexels.com/photos/6057/plate-food-salad-colorful.jpg?auto=compress&cs=tinysrgb&w=400",
    category: "Bumbu Segar",
    description: "Daun jeruk segar untuk aroma masakan Indonesia",
    longDescription: "Daun jeruk purut segar yang memberikan aroma khas dan menyegarkan pada masakan Indonesia. Daun jeruk ini dipetik dalam kondisi muda dan segar, kemudian dikeringkan dengan teknik khusus untuk mempertahankan aroma dan khasiatnya.",
    stock: 30,
    weight: "50g",
    origin: "Sumatera Utara",
    images: [
      "https://images.pexels.com/photos/6057/plate-food-salad-colorful.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6057/plate-food-salad-colorful.jpg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6057/plate-food-salad-colorful.jpg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 3,
    name: "Bawang Merah Brebes",
    price: 700,
    img: "https://images.pexels.com/photos/1359533/pexels-photo-1359533.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Bumbu Dasar",
    description: "Bawang merah berkualitas untuk bumbu dasar",
    longDescription: "Bawang merah pilihan dari Brebes dengan ukuran sedang hingga besar, memiliki rasa yang tajam dan aroma yang kuat. Bawang merah ini adalah bahan dasar yang wajib ada di dapur Indonesia untuk berbagai masakan tradisional.",
    stock: 0, // Contoh stok habis
    weight: "250g",
    origin: "Brebes",
    images: [
      "https://images.pexels.com/photos/1359533/pexels-photo-1359533.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1359533/pexels-photo-1359533.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/1359533/pexels-photo-1359533.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 4,
    name: "Bumbu Instan Rendang",
    price: 800,
    img: "https://images.pexels.com/photos/8679516/pexels-photo-8679516.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Bumbu Instant",
    description: "Bumbu rendang instan rasa autentik Padang",
    longDescription: "Bumbu rendang instan dengan resep autentik dari Padang, Sumatera Barat. Dibuat dari campuran rempah-rempah pilihan seperti cabai merah, bawang merah, bawang putih, jahe, lengkuas, kunyit, dan santan kental. Cukup tambahkan daging dan masak sesuai petunjuk.",
    stock: 15,
    weight: "200g",
    origin: "Padang",
    images: [
      "https://images.pexels.com/photos/8679516/pexels-photo-8679516.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8679516/pexels-photo-8679516.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/8679516/pexels-photo-8679516.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 5,
    name: "Sambal Terasi Homemade",
    price: 450,
    img: "https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Sambal",
    description: "Sambal terasi siap saji dengan rasa pedas gurih",
    longDescription: "Sambal terasi homemade dengan cita rasa pedas gurih yang menggugah selera. Dibuat dari cabai rawit merah, terasi udang berkualitas, bawang merah, garam, dan gula aren. Cocok sebagai pelengkap nasi hangat atau lalapan.",
    stock: 40,
    weight: "150g",
    origin: "Jakarta",
    images: [
      "https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/6802983/pexels-photo-6802983.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 6,
    name: "Kerupuk Udang Sidoarjo",
    price: 550,
    img: "https://images.pexels.com/photos/7625047/pexels-photo-7625047.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Snack",
    description: "Kerupuk udang renyah untuk pelengkap makan",
    longDescription: "Kerupuk udang premium yang dibuat dari udang segar pilihan dan tepung tapioka berkualitas tinggi. Proses pembuatan menggunakan metode tradisional dengan penjemuran alami. Menghasilkan kerupuk yang renyah dan gurih.",
    stock: 35,
    weight: "200g",
    origin: "Sidoarjo",
    images: [
      "https://images.pexels.com/photos/7625047/pexels-photo-7625047.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/7625047/pexels-photo-7625047.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/7625047/pexels-photo-7625047.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 7,
    name: "Tempe Segar",
    price: 350,
    img: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Frozen Food",
    description: "Tempe segar berkualitas tinggi",
    longDescription: "Tempe segar yang dibuat dari kedelai pilihan dengan proses fermentasi tradisional. Kaya akan protein nabati dan probiotik yang baik untuk kesehatan. Cocok untuk berbagai olahan seperti tempe goreng, bacem, atau tumisan.",
    stock: 20,
    weight: "300g",
    origin: "Yogyakarta",
    images: [
      "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  },
  {
    id: 8,
    name: "Tahu Putih",
    price: 300,
    img: "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400",
    category: "Frozen Food",
    description: "Tahu putih lembut dan segar",
    longDescription: "Tahu putih yang dibuat dari kedelai berkualitas tinggi dengan tekstur yang lembut dan rasa yang gurih. Sumber protein nabati yang baik dan cocok untuk berbagai masakan seperti mapo tahu, tahu goreng, atau sup.",
    stock: 25,
    weight: "250g",
    origin: "Bandung",
    images: [
      "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800",
      "https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=800"
    ]
  }
];
// ===== AKHIR KONFIGURASI =====

function App() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isAdminAccess, setIsAdminAccess] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

  // Form checkout states
  const [nama, setNama] = useState("");
  const [prefektur, setPrefektur] = useState("");
  const [kodepos, setKodepos] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");

  // Check if user is admin
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  // Check for existing session and set admin access
  useEffect(() => {
    // Check for existing user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Set admin access based on email
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdminAccess(true);
      } else {
        setIsAdminAccess(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      
      // Set admin access based on email
      if (currentUser && ADMIN_EMAILS.includes(currentUser.email)) {
        setIsAdminAccess(true);
      } else {
        setIsAdminAccess(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    
    // Check if the logged-in user is admin
    if (ADMIN_EMAILS.includes(userData.email)) {
      setIsAdminAccess(true);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdminAccess(false);
    setShowAdminDashboard(false);
  };

  const addToCart = (product) => {
    if (product.stock === 0) return; // Tidak bisa tambah jika stok habis
    
    setCart((curr) => {
      const exist = curr.find((item) => item.id === product.id);
      if (exist) {
        return curr.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...curr, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((curr) =>
      curr
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((curr) =>
      curr.map((item) =>
        item.id === id ? { ...item, qty: newQty } : item
      )
    );
  };

  const getTotal = () =>
    cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const getTotalItems = () =>
    cart.reduce((sum, item) => sum + item.qty, 0);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsNavOpen(false);
  };

  // Product detail functions
  const openProductDetail = (product) => {
    setSelectedProduct(product);
    setSelectedImageIndex(0);
    setShowProductDetail(true);
  };

  const closeProductDetail = () => {
    setShowProductDetail(false);
    setSelectedProduct(null);
    setSelectedImageIndex(0);
  };

  // Favorites functions
  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Fungsi untuk mengirim data ke Google Sheets
  const sendToGoogleSheets = async (orderData) => {
    try {
      const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
        mode: 'no-cors' // Diperlukan untuk Google Apps Script
      });
      
      console.log('Data berhasil dikirim ke Google Sheets');
      return true;
    } catch (error) {
      console.error('Error mengirim data ke Google Sheets:', error);
      return false;
    }
  };

  // Generate WhatsApp message dan handle checkout
  const handleCheckout = async (e) => {
    e.preventDefault();
    
    if (!isFormValid()) return;

    // Prepare order data
    const orderData = {
      timestamp: new Date().toISOString(),
      nama,
      prefektur,
      kodepos,
      alamat,
      catatan,
      adminAccess: isAdminAccess ? "YES" : "NO",
      userEmail: user?.email || "Guest",
      userRole: isAdmin ? "ADMIN" : "CUSTOMER",
      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        qty: item.qty,
        subtotal: item.price * item.qty
      })),
      total: getTotal(),
      totalItems: getTotalItems()
    };

    // Kirim ke Google Sheets
    await sendToGoogleSheets(orderData);

    // Generate WhatsApp message
    const pesan = [
      `🛒 *Order dari ${STORE_NAME}*`,
      "",
      ...cart.map(
        (item) =>
          `• ${item.name} x${item.qty} = ¥${(item.price * item.qty).toLocaleString()}`
      ),
      "",
      `💰 *Total: ¥${getTotal().toLocaleString()}*`,
      "",
      "📋 *Data Penerima*",
      `👤 Nama: ${nama}`,
      `🏙️ Prefektur: ${prefektur}`,
      `📮 Kode Pos: ${kodepos}`,
      `🏠 Alamat: ${alamat}`,
      `💬 Catatan: ${catatan || "-"}`,
      user ? `📧 Email: ${user.email}` : "",
      isAdmin ? `👑 Role: ADMIN` : "",
      isAdminAccess ? `🔑 Admin Access: Aktif` : "",
      "",
      "Terima kasih telah berbelanja di injapan.food! 🙏"
    ].filter(Boolean).join("\n");

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(pesan)}`;
    
    // Redirect ke WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Reset form dan tutup modal
    setShowCheckout(false);
    setCart([]);
    setNama("");
    setPrefektur("");
    setKodepos("");
    setAlamat("");
    setCatatan("");
  };

  const isFormValid = () =>
    nama && prefektur && kodepos && alamat && cart.length > 0;

  // Show admin dashboard if requested
  if (showAdminDashboard && isAdmin) {
    return (
      <AdminDashboard 
        products={products}
        onUpdateProducts={setProducts}
        onClose={() => setShowAdminDashboard(false)}
      />
    );
  }

  return (
    <div className="font-sans bg-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md shadow-sm z-50 border-b border-red-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                {STORE_NAME}
              </span>
              {isAdmin && (
                <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold">
                  ADMIN
                </span>
              )}
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button 
                onClick={() => scrollToSection("home")}
                className="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection("produk")}
                className="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                Produk
              </button>
              <button 
                onClick={() => scrollToSection("cara-order")}
                className="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                Cara Order
              </button>
              <button 
                onClick={() => scrollToSection("kontak")}
                className="text-gray-600 hover:text-red-600 font-medium transition-colors"
              >
                Kontak
              </button>
              
              {/* Admin Dashboard Button */}
              {isAdmin && (
                <button
                  onClick={() => setShowAdminDashboard(true)}
                  className="flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
              )}
              
              {/* User Menu */}
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-gray-700">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </span>
                    {isAdmin && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                        👑
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              )}
              
              <button
                className="relative bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors flex items-center space-x-2"
                onClick={() => setShowCheckout(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{getTotalItems()}</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                className="relative bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                onClick={() => setShowCheckout(true)}
              >
                <ShoppingCart className="h-4 w-4" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-800 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsNavOpen(!isNavOpen)}
              >
                <Menu className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isNavOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <button 
                  onClick={() => scrollToSection("home")}
                  className="text-left text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Home
                </button>
                <button 
                  onClick={() => scrollToSection("produk")}
                  className="text-left text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Produk
                </button>
                <button 
                  onClick={() => scrollToSection("cara-order")}
                  className="text-left text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Cara Order
                </button>
                <button 
                  onClick={() => scrollToSection("kontak")}
                  className="text-left text-gray-600 hover:text-red-600 font-medium transition-colors"
                >
                  Kontak
                </button>
                
                {/* Admin Dashboard Button - Mobile */}
                {isAdmin && (
                  <button
                    onClick={() => {
                      setShowAdminDashboard(true);
                      setIsNavOpen(false);
                    }}
                    className="text-left flex items-center space-x-2 text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard Admin</span>
                  </button>
                )}
                
                {/* Mobile User Menu */}
                <div className="border-t border-gray-100 pt-4">
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-700">
                        <User className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {user.user_metadata?.name || user.email?.split('@')[0]}
                        </span>
                        {isAdmin && (
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            👑
                          </span>
                        )}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setShowLoginModal(true);
                        setIsNavOpen(false);
                      }}
                      className="flex items-center space-x-2 text-gray-600 hover:text-red-600 font-medium transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>Login</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-24 pb-20 px-4 bg-gradient-to-br from-red-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="text-red-600">{STORE_NAME}</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Frozenfood & Sembako Indonesia Terlengkap di Jepang
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Nikmati cita rasa Indonesia autentik dengan kualitas terjamin
          </p>
          
          <button
            className="bg-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-red-700 transition-colors shadow-lg"
            onClick={() => scrollToSection("produk")}
          >
            Lihat Produk
          </button>

          {user && (
            <div className="mt-8 space-y-2">
              <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
                👋 Selamat datang, {user.user_metadata?.name || user.email?.split('@')[0]}!
              </div>
              {isAdmin && (
                <div className="block">
                  <div className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                    👑 Mode Admin Aktif - Akses Penuh Tersedia
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section id="produk" className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Produk Terlaris
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Pilihan terbaik bumbu dan bahan makanan Indonesia untuk keluarga di Jepang
            </p>
          </div>
          
          {/* 2 kolom per baris - responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {products.map((product) => (
              <div 
                key={product.id} 
                className="group bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 relative cursor-pointer"
                onClick={() => openProductDetail(product)}
              >
                {/* Badge Stok Habis */}
                {product.stock === 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold z-10">
                    Stok Habis
                  </div>
                )}
                
                {/* Admin Badge */}
                {isAdmin && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">
                    ID: {product.id}
                  </div>
                )}
                
                {/* Favorite Button */}
                <button
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all z-10 ${
                    favorites.includes(product.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                >
                  <Heart className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-current' : ''}`} />
                </button>
                
                <div className="relative overflow-hidden">
                  <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-red-600 uppercase tracking-wide font-semibold">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      Stok: {product.stock}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                  <p className="text-xs text-gray-500 mb-4">{product.weight}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-600">
                      ¥{product.price.toLocaleString()}
                    </span>
                    <button
                      className={`px-4 py-2 rounded-full font-semibold transition-all flex items-center space-x-2 ${
                        product.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700 hover:shadow-lg"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      disabled={product.stock === 0}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Detail Modal */}
      {showProductDetail && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <button
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={closeProductDetail}
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Kembali</span>
              </button>
              <div className="flex items-center space-x-2">
                {isAdmin && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                    ID: {selectedProduct.id}
                  </span>
                )}
                <button
                  className={`p-2 rounded-full transition-all ${
                    favorites.includes(selectedProduct.id)
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-red-500 hover:text-white'
                  }`}
                  onClick={() => toggleFavorite(selectedProduct.id)}
                >
                  <Heart className={`h-5 w-5 ${favorites.includes(selectedProduct.id) ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Images */}
                <div className="space-y-4">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img 
                      src={selectedProduct.images[selectedImageIndex]} 
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {selectedProduct.images.map((image, index) => (
                      <button
                        key={index}
                        className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-red-600' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedImageIndex(index)}
                      >
                        <img 
                          src={image} 
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="space-y-6">
                  <div>
                    <span className="text-xs text-red-600 uppercase tracking-wide font-semibold">
                      {selectedProduct.category}
                    </span>
                    <h1 className="text-2xl font-bold text-gray-900 mt-2 mb-4">{selectedProduct.name}</h1>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-red-600">¥{selectedProduct.price.toLocaleString()}</span>
                    <span className="text-sm text-gray-500">Stok: {selectedProduct.stock}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Berat</span>
                      <p className="font-medium text-gray-900">{selectedProduct.weight}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Asal</span>
                      <p className="font-medium text-gray-900">{selectedProduct.origin}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Deskripsi</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.longDescription}</p>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      className={`flex-1 py-3 rounded-full font-semibold transition-colors flex items-center justify-center space-x-2 ${
                        selectedProduct.stock === 0
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductDetail();
                      }}
                      disabled={selectedProduct.stock === 0}
                    >
                      <Plus className="h-4 w-4" />
                      <span>Tambah ke Keranjang</span>
                    </button>
                    <button
                      className={`px-6 py-3 border rounded-full font-semibold transition-colors ${
                        selectedProduct.stock === 0
                          ? "border-gray-300 text-gray-500 cursor-not-allowed"
                          : "border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                      }`}
                      onClick={() => {
                        if (selectedProduct.stock > 0) {
                          addToCart(selectedProduct);
                          closeProductDetail();
                          setShowCheckout(true);
                        }
                      }}
                      disabled={selectedProduct.stock === 0}
                    >
                      Beli Sekarang
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cara Order Section */}
      <section id="cara-order" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Cara Order
            </h2>
            <p className="text-gray-600">
              Mudah dan cepat, hanya 3 langkah!
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Pilih Produk</h3>
              <p className="text-gray-600">
                Pilih produk favorit Anda dan tambahkan ke keranjang belanja
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Isi Data</h3>
              <p className="text-gray-600">
                Lengkapi data pengiriman: nama, prefektur, kode pos, dan alamat
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Konfirmasi</h3>
              <p className="text-gray-600">
                Konfirmasi pesanan melalui WhatsApp dan lakukan pembayaran
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-16">
            Kontak Kami
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">WhatsApp</h3>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                className="text-red-600 hover:text-red-700 transition-colors font-semibold"
                target="_blank"
                rel="noopener noreferrer"
              >
                +62 851-5545-2259
              </a>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Lokasi</h3>
              <p className="text-gray-600">Nagano, Jepang</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Jam Operasional</h3>
              <p className="text-gray-600">09.00 – 21.00 JST</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-600 text-white py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-red-600" />
            </div>
            <span className="text-xl font-bold">{STORE_NAME}</span>
          </div>
          <p className="text-red-100 mb-4">
            Menghadirkan cita rasa Indonesia terbaik untuk keluarga di Jepang
          </p>
          <p className="text-sm text-red-200">
            © 2025 injapan.food. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => setShowCheckout(false)}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Keranjang belanja masih kosong</p>
                  <button
                    className="text-red-600 font-semibold hover:text-red-700 transition-colors"
                    onClick={() => {
                      setShowCheckout(false);
                      scrollToSection("produk");
                    }}
                  >
                    Mulai Belanja →
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-4">Pesanan Anda</h3>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                          <img 
                            src={item.img} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-red-600 font-semibold">¥{item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              className="p-1 hover:bg-white rounded-full transition-colors"
                              onClick={() => updateQuantity(item.id, item.qty - 1)}
                            >
                              <Minus className="h-4 w-4 text-gray-600" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.qty}</span>
                            <button
                              className="p-1 hover:bg-white rounded-full transition-colors"
                              onClick={() => updateQuantity(item.id, item.qty + 1)}
                            >
                              <Plus className="h-4 w-4 text-gray-600" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ¥{(item.price * item.qty).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                      <span className="text-xl font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-red-600">
                        ¥{getTotal().toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Form */}
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-4">Data Pengiriman</h3>
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Nama Penerima *"
                        value={nama}
                        onChange={e => setNama(e.target.value)}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Prefektur *"
                          value={prefektur}
                          onChange={e => setPrefektur(e.target.value)}
                        />
                        
                        <input
                          type="text"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                          placeholder="Kode Pos *"
                          value={kodepos}
                          onChange={e => setKodepos(e.target.value)}
                        />
                      </div>
                      
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Alamat Apartemen/Apato *"
                        value={alamat}
                        onChange={e => setAlamat(e.target.value)}
                      />
                      
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                        placeholder="Catatan (Opsional)"
                        rows="3"
                        value={catatan}
                        onChange={e => setCatatan(e.target.value)}
                      />

                      {/* User Info Display */}
                      {user && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-blue-700 font-medium">
                              Login sebagai:
                            </span>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-blue-800">
                                {user.email}
                              </span>
                              {isAdmin && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                  👑 ADMIN
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Admin Access Display */}
                      {isAdmin && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-green-700 font-medium">
                              Status Admin:
                            </span>
                            <span className="text-sm font-bold text-green-800 bg-green-100 px-3 py-1 rounded-full">
                              AKTIF ✓
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={!isFormValid()}
                        className={`w-full rounded-xl py-4 font-bold text-center transition-all flex items-center justify-center space-x-2 ${
                          isFormValid()
                            ? "bg-red-600 text-white hover:bg-red-700 shadow-lg hover:shadow-xl"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        <Phone className="h-5 w-5" />
                        <span>Checkout via WhatsApp</span>
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;