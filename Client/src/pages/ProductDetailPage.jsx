import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductImage from '../components/ProductImage';
import { ProductDetailSkeleton } from '../components/SkeletonLoaders';
import { useCart } from '../context/CartContext';
import { fetchProductBySlug, fetchProducts, fetchSetting, normalizeColorOption, getCategoryPageLink } from '../services/api';
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Ruler,
  Scissors,
  Activity,
  ArrowRight,
  X
} from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const STYLES = [
  { id: '2-pocket', label: '2-Pocket Classic', desc: 'Minimal clinical chest & pen slots' },
  { id: '6-pocket', label: '6-Pocket Executive Cargo', desc: 'Maximum utility with scissors & tablet pockets' },
];

const THREAD_COLORS = [
  { name: 'Clinical White', hex: '#FFFFFF', border: true },
  { name: 'Medical Gold', hex: '#D4AF37' },
  { name: 'Navy Blue', hex: '#1A175A' },
  { name: 'Silver Gray', hex: '#94A3B8' },
];

const PLACEMENTS = [
  { id: 'left-chest', label: 'Left Chest (Above Pocket)' },
  { id: 'right-chest', label: 'Right Chest' },
  { id: 'right-sleeve', label: 'Right Sleeve' },
];

const SIZE_CHART_DATA = [
  { size: 'XS', chestIn: '34-36', chestCm: '86-91', waistIn: '26-28', lengthIn: '27' },
  { size: 'S', chestIn: '36-38', chestCm: '91-96', waistIn: '28-30', lengthIn: '28' },
  { size: 'M', chestIn: '38-40', chestCm: '96-102', waistIn: '31-33', lengthIn: '29' },
  { size: 'L', chestIn: '41-43', chestCm: '104-109', waistIn: '34-36', lengthIn: '30' },
  { size: 'XL', chestIn: '44-46', chestCm: '112-117', waistIn: '37-39', lengthIn: '31' },
  { size: '2XL', chestIn: '47-49', chestCm: '119-124', waistIn: '40-42', lengthIn: '32' },
  { size: '3XL', chestIn: '50-52', chestCm: '127-132', waistIn: '43-45', lengthIn: '33' },
];

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, currentUser, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Configuration state
  const [selectedColor, setSelectedColor] = useState('#1A175A');
  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedStyle, setSelectedStyle] = useState('2-pocket');
  const [quantity, setQuantity] = useState(1);

  // Size chart modal
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [measurementUnit, setMeasurementUnit] = useState('in'); // 'in' | 'cm'

  // Custom Embroidery Studio State (Fetched from Admin /settings/embroidery)
  const [embroideryPricing, setEmbroideryPricing] = useState({
    enabled: false,
    namePrice: 0,
    logoPrice: 0,
    maxNameLength: 30,
    maxDeptLength: 35
  });

  const [customEmbroideryActive, setCustomEmbroideryActive] = useState(false);
  const [doctorName, setDoctorName] = useState('');
  const [designation, setDesignation] = useState('');
  const [threadColor, setThreadColor] = useState('Clinical White');
  const [placement, setPlacement] = useState('left-chest');
  const [includeLogo, setIncludeLogo] = useState(false);
  const [logoFileName, setLogoFileName] = useState('');

  // UI state
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product and settings
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setProductError('');

    Promise.all([
      fetchProductBySlug(slug),
      fetchSetting('embroidery').catch(() => null),
      fetchProducts().catch(() => [])
    ]).then(([p, embSettings, allProducts]) => {
      if (!isMounted) return;

      if (p) {
        setProduct(p);
        const firstColor = normalizeColorOption(p.colors?.[0]);
        setSelectedColor(firstColor?.name || 'Navy Blue');
        if (allProducts && allProducts.length > 0) {
          const related = allProducts
            .filter(item => String(item.id) !== String(p.id) && item.category === p.category)
            .slice(0, 4);
          setRelatedProducts(related.length ? related : allProducts.filter(item => String(item.id) !== String(p.id)).slice(0, 4));
        }
      }

      if (embSettings) {
        setEmbroideryPricing(embSettings);
      }
      setLoading(false);
    }).catch(err => {
      if (!isMounted) return;
      setProductError(err?.message || 'Unable to load product details right now.');
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Calculate dynamic embroidery add-on price
  const calculateEmbroideryTotal = () => {
    if (!customEmbroideryActive) return 0;
    let sum = 0;
    if (doctorName.trim() || designation.trim()) {
      sum += Number(embroideryPricing?.namePrice) || 0;
    }
    if (includeLogo) {
      sum += Number(embroideryPricing?.logoPrice) || 0;
    }
    return sum;
  };

  const embroideryCost = calculateEmbroideryTotal();
  const baseUnitPrice = product ? Number(product.price || 0) : 0;
  const singleItemTotal = baseUnitPrice + embroideryCost;
  const totalPayable = singleItemTotal * quantity;

  const handleAddToCart = () => {
    if (!product) return;

    const embroideryData = customEmbroideryActive && (doctorName.trim() || includeLogo) ? {
      doctorName: doctorName.trim(),
      designation: designation.trim(),
      threadColor,
      placement,
      hasLogo: includeLogo,
      price: embroideryCost
    } : null;

    addToCart(product, selectedColor, selectedSize, quantity, embroideryData);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    setIsCartOpen(false);
    // Requirement #2: Mandatory login check
    const loggedIn = currentUser || localStorage.getItem('anr_user');
    if (loggedIn) {
      navigate('/checkout');
    } else {
      navigate('/login?redirect=/checkout');
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFileName(file.name);
      setIncludeLogo(true);
    }
  };

  if (loading) {
    return (
      <Layout>
        <ProductDetailSkeleton />
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="py-24 text-center space-y-4 max-w-md mx-auto px-4">
          <h2 className="text-2xl font-black text-slate-900">
            {productError ? 'Unable to Load Product' : 'Product Not Found'}
          </h2>
          <p className="text-sm text-slate-600">
            {productError || 'The requested medical garment may have been updated or moved.'}
          </p>
          <Link to="/products" className="inline-block px-6 py-3 rounded-xl bg-[#1A175A] text-white text-xs font-bold">
            Browse All Scrub Suits & Coats
          </Link>
        </div>
      </Layout>
    );
  }

  const isLiked = isInWishlist(product.id);

  return (
    <Layout>
      <Breadcrumbs
        items={[
          { label: product.category, to: getCategoryPageLink(product.categorySlug) },
          { label: product.name }
        ]}
      />

      <div className="bg-white py-8 sm:py-12 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main 2-Col Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            
            {/* Left 6-7 Cols: Sticky Image Gallery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200/90 shadow-sm group">
                <ProductImage
                  src={product.images?.[activeImageIndex] || product.image}
                  alt={product.name}
                  eager
                  fallbackLabel="No product image"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#1A175A] font-bold text-[11px] uppercase tracking-wider shadow-sm">
                    {product.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                    Autoclave Tested
                  </span>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => isLiked ? removeFromWishlist(product.id) : addToWishlist(product)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full shadow-md backdrop-blur-md transition-all ${
                    isLiked
                      ? 'bg-rose-50 text-rose-600 scale-105'
                      : 'bg-white/90 text-slate-600 hover:scale-110 hover:text-rose-500'
                  }`}
                  aria-label="Save to Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails Strip */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#1A175A] ring-2 ring-[#1A175A]/20 scale-105'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Clinical Trust Points */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Activity className="w-5 h-5 text-[#1A175A] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">4-Way Stretch</div>
                  <div className="text-[10px] text-slate-500">Unrestricted clinical reach</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Antimicrobial</div>
                  <div className="text-[10px] text-slate-500">Fluid-repellent shield</div>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <Scissors className="w-5 h-5 text-[#1A175A] mx-auto mb-1" />
                  <div className="text-xs font-bold text-slate-900">Custom Embroidery</div>
                  <div className="text-[10px] text-slate-500">Bangalore factory crest</div>
                </div>
              </div>
            </div>

            {/* Right 5-6 Cols: Configuration & Purchase */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Title & Rating */}
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1A175A]">
                    ANR Hospital Uniforms
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-slate-500">SKU: {product.sku}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-3">
                  {Number(product.rating) > 0 && (
                    <div className="flex items-center gap-1 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 text-xs font-bold text-[#1A175A]">
                      <Star className="w-3.5 h-3.5 fill-[#1A175A] text-[#1A175A]" />
                      <span>{Number(product.rating).toFixed(1)}</span>
                      {Number(product.reviews) > 0 && (
                        <span className="text-blue-700/70 font-medium">({product.reviews} reviews)</span>
                      )}
                    </div>
                  )}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      Number(product.stock) > 0
                        ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                        : 'text-rose-700 bg-rose-50 border-rose-200'
                    }`}
                  >
                    {Number(product.stock) > 0 ? 'In Stock • Ready to Dispatch' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-baseline justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#1A175A]">
                      ₹{singleItemTotal.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm font-semibold text-slate-400 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Inclusive of all applicable taxes • Official GST ITC Invoice
                  </span>
                </div>
                {embroideryCost > 0 && (
                  <span className="text-xs font-bold text-[#1A175A] bg-blue-100/70 px-2.5 py-1 rounded-lg">
                    Includes +₹{embroideryCost} Customization
                  </span>
                )}
              </div>

              {/* 1. Color Selector */}
              {(() => {
                const productColors = (product.colors || []).map(normalizeColorOption).filter(Boolean);
                const activeColorObj =
                  productColors.find((c) => c.name === selectedColor || c.hex === selectedColor) ||
                  productColors[0] ||
                  null;

                if (productColors.length === 0) return null;

                return (
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                      Select Garment Colour
                      {activeColorObj?.name ? (
                        <span className="ml-2 text-[#1A175A]">• {activeColorObj.name}</span>
                      ) : null}
                    </label>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {productColors.map((colorObj, idx) => {
                        const active =
                          activeColorObj &&
                          activeColorObj.name === colorObj.name &&
                          activeColorObj.hex === colorObj.hex;
                        return (
                          <button
                            key={`${colorObj.name}-${colorObj.hex}-${idx}`}
                            type="button"
                            onClick={() => {
                              setSelectedColor(colorObj.name);
                              if (colorObj.image && Array.isArray(product.images)) {
                                const imgIdx = product.images.indexOf(colorObj.image);
                                if (imgIdx >= 0) setActiveImageIndex(imgIdx);
                              }
                            }}
                            className={`h-7 w-7 rounded-full border border-slate-300 transition-all ${
                              active
                                ? 'ring-3 ring-[#1A175A] ring-offset-2 scale-110 shadow-sm'
                                : 'hover:scale-105 opacity-90 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: colorObj.hex,
                              boxShadow: active ? undefined : 'inset 0 0 0 1px rgba(15,23,42,0.18)',
                            }}
                            title={colorObj.name}
                            aria-label={`Select colour ${colorObj.name}`}
                            aria-pressed={Boolean(active)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* 2. Size Selector + Size Chart Modal Link */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Select Size
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeChart(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#1A175A] hover:underline"
                  >
                    <Ruler className="w-3.5 h-3.5 text-[#1A175A]" />
                    <span>View Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {SIZES.map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedSize === sz
                          ? 'bg-[#1A175A] text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:border-[#1A175A]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Garment Style Configuration */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Pocket & Cut Configuration
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {STYLES.map(st => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStyle(st.id)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        selectedStyle === st.id
                          ? 'border-[#1A175A] bg-[#1A175A]/5 ring-1 ring-[#1A175A]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{st.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{st.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Custom Embroidery Studio (Proposal Page 5, Sec E) */}
              {embroideryPricing.enabled && (
                <div className="rounded-2xl border border-blue-300/80 bg-gradient-to-b from-blue-50/60 to-white p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scissors className="w-4 h-4 text-[#1A175A]" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">
                        Custom Embroidery Studio
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customEmbroideryActive}
                        onChange={e => setCustomEmbroideryActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#1A175A]" />
                      <span className="ml-2 text-xs font-bold text-slate-700">
                        {customEmbroideryActive ? 'Added' : 'Add Custom'}
                      </span>
                    </label>
                  </div>

                  {customEmbroideryActive ? (
                    <div className="space-y-3 pt-2 border-t border-blue-200/80">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <label className="font-bold text-slate-700">Doctor Name (Line 1)</label>
                          <span className="text-[11px] text-[#1A175A] font-bold">+₹{embroideryPricing.namePrice}</span>
                        </div>
                        <input
                          type="text"
                          maxLength={embroideryPricing.maxNameLength || 30}
                          value={doctorName}
                          onChange={e => setDoctorName(e.target.value)}
                          placeholder="e.g. Dr. Arjun Mehta, MD"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <label className="font-bold text-slate-700">Department / Specialty (Line 2)</label>
                          <span className="text-[11px] text-slate-400">Included with Name</span>
                        </div>
                        <input
                          type="text"
                          maxLength={embroideryPricing.maxDeptLength || 35}
                          value={designation}
                          onChange={e => setDesignation(e.target.value)}
                          placeholder="e.g. Dept. of Cardiology"
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1A175A]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Thread Color</label>
                          <select
                            value={threadColor}
                            onChange={e => setThreadColor(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          >
                            {THREAD_COLORS.map(tc => (
                              <option key={tc.name} value={tc.name}>{tc.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">Placement</label>
                          <select
                            value={placement}
                            onChange={e => setPlacement(e.target.value)}
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                          >
                            {PLACEMENTS.map(pl => (
                              <option key={pl.id} value={pl.id}>{pl.label}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Hospital Crest Logo Upload */}
                      <div className="p-3 bg-white rounded-xl border border-dashed border-blue-300 space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeLogo}
                              onChange={e => setIncludeLogo(e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#1A175A] rounded"
                            />
                            <span>Upload Hospital / Clinic Crest Logo (+₹{embroideryPricing.logoPrice})</span>
                          </label>
                        </div>
                        {includeLogo && (
                          <div className="pt-1">
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              onChange={handleLogoUpload}
                              className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#1A175A] file:text-white hover:file:bg-[#141247]"
                            />
                            {logoFileName && (
                              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                                ✓ Uploaded: {logoFileName}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Personalize with your doctor name, department line, and hospital crest logo (+₹{embroideryPricing.namePrice} – +₹{embroideryPricing.logoPrice}).
                    </p>
                  )}
                </div>
              )}

              {/* Quantity Counter */}
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Quantity
                </span>
                <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-l-xl"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200 rounded-r-xl"
                  >
                    +
                  </button>
                </div>
                {quantity >= 5 && (
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Bulk discount eligible at checkout!
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full py-4 px-6 rounded-2xl bg-[#1A175A] hover:bg-[#141247] text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                >
                  <ShoppingBag className="w-4 h-4 text-blue-200" />
                  <span>Add to Hospital Apparel Bag • ₹{totalPayable.toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-blue-50 text-[#1A175A] border-2 border-[#1A175A] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Instant Doctor Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Institutional Bulk CTA Strip */}
              <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-700">
                  Need 25+ sets for your hospital or clinical department?
                </div>
                <Link
                  to="/bulk-order"
                  className="px-3 py-1.5 rounded-lg bg-[#1A175A] text-white text-[11px] font-bold hover:bg-[#141247] shrink-0"
                >
                  Bulk Inquiry
                </Link>
              </div>

            </div>

          </div>

          {/* Fabric Technology & Specs */}
          {(product.fabricDetails || (Array.isArray(product.specifications) && product.specifications.length > 0)) && (
            <div className="mt-16 pt-12 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-black text-slate-900">
                Fabric Engineering & Specifications
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.fabricDetails && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-sm font-bold text-[#1A175A] flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#1A175A]" />
                      <span>Clinical Fabric Details</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                      {product.fabricDetails}
                    </p>
                  </div>
                )}

                {Array.isArray(product.specifications) && product.specifications.length > 0 && (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <h4 className="text-sm font-bold text-[#1A175A] flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Garment Specifications</span>
                    </h4>
                    <ul className="text-xs text-slate-600 space-y-2">
                      {product.specifications.map((spec, idx) => (
                        <li key={idx}>
                          • {typeof spec === 'string'
                            ? spec
                            : spec && (spec.label || spec.key)
                              ? <><strong>{spec.label || spec.key}:</strong> {spec.value}</>
                              : JSON.stringify(spec)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Related Products Carousel */}
          {relatedProducts.length > 0 && (
            <div className="mt-16 pt-12 border-t border-slate-200 space-y-6">
              <h3 className="text-xl font-black text-slate-900">
                Frequently Paired Uniforms
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(rel => (
                  <Link
                    key={rel.id}
                    to={`/product/${rel.slug || rel.id}`}
                    className="p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-lg transition-all space-y-3 group"
                  >
                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-slate-100">
                      <ProductImage
                        src={rel.image}
                        alt={rel.name}
                        fallbackLabel="No image"
                        containerClassName="w-full h-full"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {rel.category}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5 group-hover:text-[#1A175A]">
                        {rel.name}
                      </h4>
                      <div className="text-sm font-black text-[#1A175A] mt-1">
                        ₹{rel.price.toLocaleString()}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Interactive Size Chart Modal */}
      {showSizeChart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#1A175A]">
                  ANR Medical Uniform Size Guide
                </h3>
                <p className="text-xs text-slate-500">
                  Standard Indian clinical measurements for scrub suits and coats.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeChart(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* In / Cm toggle */}
            <div className="flex items-center justify-end gap-2 text-xs font-bold">
              <span className="text-slate-500">Units:</span>
              <button
                type="button"
                onClick={() => setMeasurementUnit('in')}
                className={`px-3 py-1 rounded-lg ${measurementUnit === 'in' ? 'bg-[#1A175A] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Inches
              </button>
              <button
                type="button"
                onClick={() => setMeasurementUnit('cm')}
                className={`px-3 py-1 rounded-lg ${measurementUnit === 'cm' ? 'bg-[#1A175A] text-white' : 'bg-slate-100 text-slate-700'}`}
              >
                Centimeters
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#1A175A] text-white uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3">Size</th>
                    <th className="p-3">Chest</th>
                    <th className="p-3">Waist</th>
                    <th className="p-3">Top Length</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {SIZE_CHART_DATA.map(row => (
                    <tr key={row.size} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-[#1A175A]">{row.size}</td>
                      <td className="p-3 text-slate-700">
                        {measurementUnit === 'in' ? `${row.chestIn}"` : `${row.chestCm} cm`}
                      </td>
                      <td className="p-3 text-slate-700">
                        {measurementUnit === 'in' ? `${row.waistIn}"` : `${Math.round(parseInt(row.waistIn) * 2.54)} cm`}
                      </td>
                      <td className="p-3 text-slate-700">
                        {measurementUnit === 'in' ? `${row.lengthIn}"` : `${Math.round(parseInt(row.lengthIn) * 2.54)} cm`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              💡 <strong>Fitting Tip:</strong> If your measurements fall between two sizes, choose the larger size for a relaxed shift fit, or the smaller size for a tailored athletic cut.
            </div>
          </div>
        </div>
      )}

      {/* Persistent Mobile Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-slate-200 p-3 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Total</div>
          <div className="text-lg font-black text-[#1A175A]">₹{totalPayable.toLocaleString()}</div>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 py-3 px-4 rounded-xl bg-[#1A175A] text-white font-bold text-xs flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4 text-blue-200" />
          <span>Add to Bag • Size {selectedSize}</span>
        </button>
      </div>

    </Layout>
  );
};

export default ProductDetailPage;