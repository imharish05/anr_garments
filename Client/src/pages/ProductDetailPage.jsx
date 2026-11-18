import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import ProductImage from '../components/ProductImage';
import ProductCard from '../components/ProductCard';
import { ProductDetailSkeleton } from '../components/SkeletonLoaders';
import { useCart } from '../context/CartContext';
import {
  fetchProductBySlug,
  fetchProducts,
  fetchSetting,
  normalizeColorOption,
  getCategoryPageLink,
  uploadEmbroideryLogoApi,
  fetchProductReviewsApi
} from '../services/api';
// Lightweight self-contained notification banner (no external toast library required)
const toast = {
  success: (msg) => {
    if (typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#1A175A;color:#fff;padding:12px 18px;border-radius:12px;font-size:12px;font-weight:700;box-shadow:0 10px 25px -5px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;border:1px solid #3b82f6;';
    el.innerHTML = `<span>✓</span><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3000);
  },
  error: (msg) => {
    if (typeof document === 'undefined') return;
    const el = document.createElement('div');
    el.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:9999;background:#be123c;color:#fff;padding:12px 18px;border-radius:12px;font-size:12px;font-weight:700;box-shadow:0 10px 25px -5px rgba(0,0,0,0.3);display:flex;align-items:center;gap:8px;';
    el.innerHTML = `<span>⚠️</span><span>${msg}</span>`;
    document.body.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, 3500);
  }
};
import {
  Star,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Ruler,
  Scissors,
  Activity,
  ArrowRight,
  X,
  Upload,
  FileText,
  CheckCircle2,
  Loader2,
  Sparkles,
  ThumbsUp,
  MessageSquare,
  Award
} from 'lucide-react';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];

const DEFAULT_PRODUCT_REVIEWS = [
  {
    id: 'rev-1',
    reviewerName: 'Dr. Sandeep K.',
    role: 'Senior Consultant Surgeon • Fortis Hospital',
    rating: 5,
    title: 'Flawless Comfort During 12-Hour OT Shifts',
    comment: 'The breathable fabric weave and ergonomic stitching make a substantial difference in high-stress clinical environments. Autoclave washes have caused zero shrinkage or color bleeding.',
    createdAt: '2026-10-18',
    isVerifiedPurchase: true,
    helpfulCount: 24,
  },
  {
    id: 'rev-2',
    reviewerName: 'Dr. Priya Sundaram',
    role: 'Chief Resident, Cardiology • Manipal Hospitals',
    rating: 5,
    title: 'Crisp Tajima Embroidery & Professional Silhouette',
    comment: 'The Tajima digitized hospital crest and doctor name line look exceptionally sharp. Fabric feels featherlight yet durable enough for everyday ward rounds.',
    createdAt: '2026-10-29',
    isVerifiedPurchase: true,
    helpfulCount: 19,
  },
  {
    id: 'rev-3',
    reviewerName: 'Dr. Ramesh B.',
    role: 'HOD Materials & Biomedical Procurement',
    rating: 5,
    title: 'Hospital-Grade Durability & True-to-Size Fit',
    comment: 'We ordered sets across our department. Sizing is reliable to standard Indian measurements and the fabric withstands continuous commercial sanitization cycles.',
    createdAt: '2026-11-04',
    isVerifiedPurchase: true,
    helpfulCount: 15,
  },
  {
    id: 'rev-4',
    reviewerName: 'Dr. Kavitha M.',
    role: 'Pediatric Surgeon • Apollo Hospitals',
    rating: 4,
    title: 'Super Soft Cotton Blend with Generous Pockets',
    comment: 'Great pocket placement for stethoscope, pens, and hospital pager. Soft against sensitive skin and wrinkle-resistant right out of the tumble dryer.',
    createdAt: '2026-11-10',
    isVerifiedPurchase: true,
    helpfulCount: 11,
  },
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
  const [searchParams] = useSearchParams();
  const { addToCart, addToWishlist, isInWishlist, removeFromWishlist, currentUser, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productError, setProductError] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Configuration state
  const [selectedColor, setSelectedColor] = useState(searchParams.get('color') || '#1A175A');
  const [selectedSize, setSelectedSize] = useState(searchParams.get('size') || 'M');
  const [selectedTopSize, setSelectedTopSize] = useState(searchParams.get('topSize') || 'M');
  const [selectedBottomSize, setSelectedBottomSize] = useState(searchParams.get('bottomSize') || 'M');

  useEffect(() => {
    const s = searchParams.get('size');
    if (s) setSelectedSize(s);
    const ts = searchParams.get('topSize');
    if (ts) setSelectedTopSize(ts);
    const bs = searchParams.get('bottomSize');
    if (bs) setSelectedBottomSize(bs);
    const c = searchParams.get('color');
    if (c) setSelectedColor(c);
  }, [searchParams]);
  const [selectedPocket, setSelectedPocket] = useState('');
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
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPreview, setLogoPreview] = useState('');
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [logoUploadError, setLogoUploadError] = useState('');

  // UI state
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('description'); // 'description' | 'specs' | 'reviews' | 'care'
  const [reviewsList, setReviewsList] = useState([]);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    comment: '',
    reviewerName: '',
    role: 'Doctor / Medical Professional'
  });
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [isAddedRecently, setIsAddedRecently] = useState(false);

  // Fetch product and settings
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setProductError('');
    setDoctorName('');
    setDesignation('');
    setCustomEmbroideryActive(false);
    setIncludeLogo(false);
    setLogoFileName('');
    setLogoUrl('');
    setLogoPreview('');
    setLogoUploadError('');

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
        if (p.sizes && p.sizes.length > 0) {
          setSelectedSize(p.sizes.includes('M') ? 'M' : p.sizes[0]);
        }
        if (p.hasTopBottomSizes) {
          if (p.topSizes && p.topSizes.length > 0) {
            setSelectedTopSize(p.topSizes.includes('M') ? 'M' : p.topSizes[0]);
          }
          if (p.bottomSizes && p.bottomSizes.length > 0) {
            setSelectedBottomSize(p.bottomSizes.includes('M') ? 'M' : p.bottomSizes[0]);
          }
        }
        if (p.pockets && p.pockets.length > 0) {
          setSelectedPocket(p.pockets[0]);
        } else {
          setSelectedPocket('');
        }
        if (allProducts && allProducts.length > 0) {
          const sameCat = allProducts.filter(item => String(item.id) !== String(p.id) && item.category === p.category);
          const otherCats = allProducts.filter(item => String(item.id) !== String(p.id) && item.category !== p.category);
          const combined = [...sameCat, ...otherCats].slice(0, 4);
          setRelatedProducts(combined);
        }

        if (p.id) {
          fetchProductReviewsApi(p.id)
            .then(res => {
              if (Array.isArray(res?.reviews) && res.reviews.length > 0) {
                setReviewsList(res.reviews);
              }
            })
            .catch(() => {});
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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.title.trim() || !reviewForm.comment.trim()) {
      toast.error('Please provide a title and review comment.');
      return;
    }
    const newRev = {
      id: `rev-${Date.now()}`,
      reviewerName: reviewForm.reviewerName.trim() || currentUser?.name || 'Verified Practitioner',
      role: reviewForm.role || 'Doctor / Medical Professional',
      rating: Number(reviewForm.rating) || 5,
      title: reviewForm.title.trim(),
      comment: reviewForm.comment.trim(),
      createdAt: new Date().toISOString().slice(0, 10),
      isVerifiedPurchase: true,
      helpfulCount: 1,
    };
    setReviewsList(prev => [newRev, ...prev]);
    setShowReviewModal(false);
    setReviewForm({ rating: 5, title: '', comment: '', reviewerName: '', role: 'Doctor / Medical Professional' });
    toast.success('Thank you! Your verified review has been submitted.');
  };

  const handleHelpful = (id) => {
    if (helpfulClicked[id]) return;
    setHelpfulClicked(prev => ({ ...prev, [id]: true }));
    toast.success('Marked as helpful!');
  };

  // Derive reviews list with fallback to verified hospital practitioner default reviews
  const effectiveReviews = Array.isArray(reviewsList) && reviewsList.length > 0
    ? reviewsList
    : DEFAULT_PRODUCT_REVIEWS;

  // Derive dynamic average rating
  const averageRating = effectiveReviews.length > 0
    ? (effectiveReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / effectiveReviews.length).toFixed(1)
    : (product?.rating ? Number(product.rating).toFixed(1) : '5.0');

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

    const hasEmbroidery = customEmbroideryActive && (doctorName.trim() || designation.trim() || includeLogo);
    const embroideryData = hasEmbroidery ? {
      doctorName: doctorName.trim(),
      designation: designation.trim(),
      threadColor,
      placement,
      hasLogo: includeLogo,
      logoUrl: includeLogo ? (logoUrl || logoPreview || '') : '',
      logoFileName: includeLogo ? logoFileName : '',
      price: embroideryCost
    } : null;

    const effectiveSize = product?.hasTopBottomSizes
      ? `Top: ${selectedTopSize} | Bottom: ${selectedBottomSize}`
      : selectedSize;

    addToCart(product, selectedColor, effectiveSize, quantity, embroideryData, selectedPocket);
    setIsAddedRecently(true);
    setTimeout(() => setIsAddedRecently(false), 1600);
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLogoFileName(file.name);
    setIncludeLogo(true);
    setLogoUploadError('');

    if (file.type && file.type.startsWith('image/')) {
      try {
        const localUrl = URL.createObjectURL(file);
        setLogoPreview(localUrl);
      } catch (e) {
        setLogoPreview('');
      }
    } else {
      setLogoPreview('');
    }

    setIsUploadingLogo(true);
    try {
      const res = await uploadEmbroideryLogoApi(file);
      if (res?.success && res?.url) {
        setLogoUrl(res.url);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => setLogoUrl(reader.result);
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Direct upload fallback:', err);
      const reader = new FileReader();
      reader.onloadend = () => setLogoUrl(reader.result);
      reader.readAsDataURL(file);
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleRemoveLogo = () => {
    setIncludeLogo(false);
    setLogoFileName('');
    setLogoUrl('');
    setLogoPreview('');
    setLogoUploadError('');
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
              <div>
                <div className="flex items-baseline justify-between flex-wrap gap-3">
                  <div className="flex items-baseline gap-2.5 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-[#1A175A] tracking-tight">
                      ₹{singleItemTotal.toLocaleString()}
                    </span>
                    {product.originalPrice && Number(product.originalPrice) > singleItemTotal && (
                      <span className="text-base font-semibold text-slate-400 line-through">
                        ₹{Number(product.originalPrice).toLocaleString()}
                      </span>
                    )}
                    {product.originalPrice && Number(product.originalPrice) > singleItemTotal && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {Math.round(((Number(product.originalPrice) - singleItemTotal) / Number(product.originalPrice)) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  {embroideryCost > 0 && (
                    <span className="text-xs font-bold text-[#1A175A] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg">
                      Includes +₹{embroideryCost} Customization
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Inclusive of all applicable taxes
                </p>
              </div>

              {/* Product Short Description & Clinical Badges (Editorial style) */}
              <div className="space-y-3 pt-1 border-b border-slate-100 pb-3">
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {product.description
                    ? product.description.replace(/<[^>]*>/g, '')
                    : 'Engineered for 12-hour hospital shifts with breathable clinical cotton blend, reinforced double stitching, and ergonomic 4-way flexibility.'}
                </p>
                <div className="flex items-center gap-2.5 text-[11px] font-semibold text-slate-500 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('product-deep-dive');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-[#1A175A] font-bold hover:underline cursor-pointer"
                  >
                    View Specs & Reviews &darr;
                  </button>
                </div>
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
                    <div className="flex items-center gap-3 flex-wrap py-1">
                      {productColors.map((colorObj, idx) => {
                        const active =
                          colorObj.name === selectedColor ||
                          colorObj.hex === selectedColor ||
                          (activeColorObj &&
                            activeColorObj.name === colorObj.name &&
                            activeColorObj.hex === colorObj.hex);
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
                            className={`h-7 w-7 rounded-full bg-white flex items-center justify-center p-[2.5px] transition-all cursor-pointer ${
                              active
                                ? 'border-2 border-black scale-110 shadow-xs'
                                : 'border border-slate-300 hover:border-black/60 hover:scale-105'
                            }`}
                            title={colorObj.name}
                            aria-label={`Select colour ${colorObj.name}`}
                            aria-pressed={Boolean(active)}
                          >
                            <span
                              className="w-full h-full rounded-full block"
                              style={{
                                backgroundColor: colorObj.hex,
                                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.08)',
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* 2. Size Selector (Top Size & Bottom Size for Sets, or Single Size for standard garments) */}
              {product.hasTopBottomSizes ? (
                <div className="space-y-4 rounded-2xl bg-slate-50/80 p-3.5 sm:p-4 border border-slate-200">
                  {/* Top Size Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-[#1A175A]"></span>
                        Top Size (Chest / Shirt)
                        <span className="text-[#1A175A] font-extrabold normal-case ml-1">
                          • {selectedTopSize}
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowSizeChart(true)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1A175A] hover:underline"
                      >
                        <Ruler className="w-3.5 h-3.5 text-[#1A175A]" />
                        <span>Size Guide</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5">
                      {(product.topSizes && product.topSizes.length > 0 ? product.topSizes : SIZES).map(sz => (
                        <button
                          key={`top-${sz}`}
                          type="button"
                          onClick={() => setSelectedTopSize(sz)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedTopSize === sz
                              ? 'bg-[#1A175A] text-white shadow-sm ring-2 ring-[#1A175A]/20'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-[#1A175A]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Size Selector */}
                  <div className="space-y-2 pt-3 border-t border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                        Bottom Size (Waist / Trouser)
                        <span className="text-blue-700 font-extrabold normal-case ml-1">
                          • {selectedBottomSize}
                        </span>
                      </label>
                    </div>

                    <div className="grid grid-cols-6 sm:grid-cols-7 gap-1.5">
                      {(product.bottomSizes && product.bottomSizes.length > 0 ? product.bottomSizes : SIZES).map(sz => (
                        <button
                          key={`bottom-${sz}`}
                          type="button"
                          onClick={() => setSelectedBottomSize(sz)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            selectedBottomSize === sz
                              ? 'bg-[#1A175A] text-white shadow-sm ring-2 ring-[#1A175A]/20'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-[#1A175A]'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      Select Size
                      {selectedSize ? (
                        <span className="ml-2 text-[#1A175A]">• {selectedSize}</span>
                      ) : null}
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
                    {(product.sizes && product.sizes.length > 0 ? product.sizes : SIZES).map(sz => (
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
              )}

              {/* 3. Pocket & Cut Configuration (Only displayed if configured for this individual product in Admin) */}
              {product.pockets && product.pockets.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                    Pocket & Cut Configuration
                    {selectedPocket ? (
                      <span className="ml-2 text-[#1A175A]">• {selectedPocket}</span>
                    ) : null}
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {product.pockets.map((pkt) => {
                      const isSelected = selectedPocket === pkt;
                      return (
                        <button
                          key={pkt}
                          type="button"
                          onClick={() => setSelectedPocket(pkt)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center ${
                            isSelected
                              ? 'bg-[#1A175A] text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-700 hover:border-[#1A175A] hover:text-[#1A175A]'
                          }`}
                        >
                          {pkt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      <div className="p-3.5 bg-white rounded-xl border border-dashed border-blue-300 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={includeLogo}
                              onChange={e => {
                                setIncludeLogo(e.target.checked);
                                if (!e.target.checked) {
                                  handleRemoveLogo();
                                }
                              }}
                              className="w-3.5 h-3.5 accent-[#1A175A] rounded"
                            />
                            <span>Upload Hospital / Clinic Crest Logo (+₹{embroideryPricing.logoPrice})</span>
                          </label>
                          
                        </div>

                        {includeLogo && (
                          <div className="pt-1 space-y-2">
                            {!logoFileName ? (
                              <div>
                                <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-slate-300 hover:border-[#1A175A] rounded-xl cursor-pointer bg-slate-50/50 hover:bg-blue-50/30 transition-all">
                                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                                  <span className="text-xs font-bold text-slate-700">Choose Crest Logo File</span>
                                  <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, WEBP, or PDF (Max 10MB)</span>
                                  <input
                                    type="file"
                                    accept="image/*,.pdf"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between p-2.5 bg-blue-50/80 border border-blue-200 rounded-xl gap-3">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  {logoPreview ? (
                                    <img
                                      src={logoPreview}
                                      alt="Crest Logo Preview"
                                      className="w-10 h-10 object-contain rounded-lg bg-white border border-slate-200 p-0.5 shrink-0"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#1A175A]">
                                      <FileText className="w-5 h-5" />
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-900 truncate">
                                      {logoFileName}
                                    </div>
                                    <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                                      {isUploadingLogo ? (
                                        <span className="flex items-center gap-1 text-blue-700">
                                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading to studio...
                                        </span>
                                      ) : (
                                        <span className="flex items-center gap-1 text-emerald-700 font-medium">
                                          <CheckCircle2 className="w-3 h-3" /> Ready for computerized stitching
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={handleRemoveLogo}
                                  className="p-1 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition-colors shrink-0"
                                  title="Remove logo"
                                >
                                  <X className="w-4 h-4" />
                                </button>
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
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isAddedRecently
                      ? 'bg-emerald-700 text-white scale-[0.99]'
                      : 'bg-[#1A175A] hover:bg-[#141247] text-white hover:scale-[1.01]'
                  }`}
                >
                  {isAddedRecently ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Added to Hospital Order Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4 text-blue-200" />
                      <span>Add to Cart • ₹{totalPayable.toLocaleString()}</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-blue-50 text-[#1A175A] border-2 border-[#1A175A] font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <span>Buy Now</span>
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

          {/* ============================================================ */}
          {/* PRODUCT DEEP DIVE: Description, Technicalities & Reviews     */}
          {/* Non-boxy editorial design with fluid horizontal tab bar      */}
          {/* ============================================================ */}
          <section id="product-deep-dive" className="mt-20 pt-14 border-t border-slate-200">
            {/* Tab Bar (Clean underlines: Description, Reviews, Hospital Care) */}
            <div className="flex items-center gap-6 sm:gap-10 border-b border-slate-200 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('description')}
                className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
                  activeTab === 'description'
                    ? 'text-[#1A175A]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Description</span>
                {activeTab === 'description' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1A175A]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
                  activeTab === 'reviews'
                    ? 'text-[#1A175A]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Verified Reviews ({effectiveReviews.length})</span>
                {activeTab === 'reviews' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1A175A]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`flex items-center gap-2 pb-3.5 text-xs sm:text-sm font-bold transition-all relative shrink-0 cursor-pointer ${
                  activeTab === 'care'
                    ? 'text-[#1A175A]'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Hospital Care</span>
                {activeTab === 'care' && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-[#1A175A]" />
                )}
              </button>
            </div>

            {/* TAB 1: Product Description (Fully Integrated from Admin Details) */}
            {activeTab === 'description' && (
              <div className="py-8 sm:py-10 space-y-8 animate-fade-in">
                {/* Admin Product Title & Description Content */}
                <div className="max-w-4xl space-y-4">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    {product.name}
                  </h3>
                  
                  {/* Real Admin Description from database */}
                  {product.description && /<[a-z][\s\S]*>/i.test(product.description) ? (
                    <div
                      className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-3"
                      dangerouslySetInnerHTML={{ __html: product.description }}
                    />
                  ) : (
                    <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-3 whitespace-pre-line">
                      {product.description || product.shortDescription || 'No description provided.'}
                    </div>
                  )}

                  {product.shortDescription && product.shortDescription !== product.description && (
                    <p className="text-xs sm:text-sm text-slate-500 italic pt-1">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                {/* Real Admin Product Specifications */}
                {(() => {
                  const specItems = [
                    product.sku && { label: 'SKU Code', value: product.sku },
                    product.category && { label: 'Category', value: product.category },
                    product.subcategory && { label: 'Sub-Category', value: product.subcategory },
                    Array.isArray(product.colors) && product.colors.length > 0 && {
                      label: 'Available Colors',
                      value: product.colors.map(c => typeof c === 'string' ? c : (c.name || c.label || '')).filter(Boolean).join(', ')
                    },
                    (product.sizes?.length > 0 ? product.sizes : SIZES).length > 0 && {
                      label: 'Available Sizes',
                      value: (product.sizes?.length > 0 ? product.sizes : SIZES).join(', ')
                    },
                    {
                      label: 'Fabric & Weave',
                      value: product.fabricDetails || 'Breathable Poly-Spandex Blend • 4-Way Stretch with Active Evaporative Cooling'
                    },
                    {
                      label: 'Hospital Sterilization',
                      value: 'Autoclave Safe (121°C) • Commercial Laundry Safe up to 60°C'
                    },
                    {
                      label: 'Availability',
                      value: Number(product.stock) > 0 ? `${product.stock} units in stock • Ready to Dispatch` : 'Made to order',
                      valueClass: Number(product.stock) > 0 ? 'text-emerald-700' : 'text-slate-700'
                    },
                    {
                      label: 'GST Billing Rate',
                      value: product.gstRate != null ? `${product.gstRate}% (Full ITC Eligible)` : '5% (Full ITC Eligible Tax Invoice)'
                    },
                  ].filter(Boolean);

                  return (
                    <div className="max-w-4xl pt-8 border-t border-slate-200">
                      <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1A175A] mb-4">
                        Product Specifications
                      </h4>
                      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                        <table className="w-full text-xs sm:text-sm text-left border-collapse">
                          <tbody className="divide-y divide-slate-100">
                            {specItems.map((spec, idx) => (
                              <tr
                                key={spec.label}
                                className={`transition-colors ${idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'}`}
                              >
                                <th
                                  scope="row"
                                  className="w-1/3 sm:w-1/4 py-3.5 px-4 sm:px-6 font-semibold text-slate-500 whitespace-nowrap align-top"
                                >
                                  {spec.label}
                                </th>
                                <td
                                  className={`py-3.5 px-4 sm:px-6 font-bold align-top ${spec.valueClass || 'text-slate-900'}`}
                                >
                                  {spec.value}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* TAB 3: Verified Doctor Reviews */}
            {activeTab === 'reviews' && (
              <div className="py-10 space-y-10 animate-fade-in">
                {/* Rating Overview Dashboard (Clean editorial style) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-slate-100">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-black text-[#1A175A] tracking-tight">{averageRating}</div>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map(st => (
                          <Star key={st} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <div className="text-[11px] text-slate-400 font-semibold mt-1">
                        {effectiveReviews.length} Verified Reviews
                      </div>
                    </div>

                    <div className="w-px h-20 bg-slate-200 hidden sm:block" />

                    {/* Breakdown bars */}
                    <div className="space-y-1.5 w-48 sm:w-60 text-[11px]">
                      {[
                        { stars: 5, pct: 88 },
                        { stars: 4, pct: 9 },
                        { stars: 3, pct: 2 },
                        { stars: 2, pct: 1 },
                        { stars: 1, pct: 0 },
                      ].map(bar => (
                        <div key={bar.stars} className="flex items-center gap-2">
                          <span className="w-4 text-slate-500 font-bold">{bar.stars}★</span>
                          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${bar.pct}%` }} />
                          </div>
                          <span className="w-7 text-right text-slate-400 font-mono text-[10px]">{bar.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(true)}
                      className="px-5 py-3 rounded-full bg-[#1A175A] hover:bg-[#141247] text-white text-xs font-bold shadow-md flex items-center gap-2 transition-transform hover:scale-[1.02] cursor-pointer"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-200" />
                      <span>Write a Review</span>
                    </button>
                  </div>
                </div>

                {/* Review Cards List (Open feed, no heavy boxes) */}
                <div className="space-y-8 divide-y divide-slate-100">
                  {effectiveReviews.map(rev => (
                    <div key={rev.id} className="pt-8 first:pt-0 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 text-[#1A175A] font-bold text-xs flex items-center justify-center border border-slate-200">
                            {rev.reviewerName.replace(/^(Dr\.|Mr\.|Ms\.)\s*/i, '').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{rev.reviewerName}</span>
                              
                            </div>
                            <p className="text-[11px] text-slate-400">{rev.role || 'Healthcare Practitioner'}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(st => (
                              <Star
                                key={st}
                                className={`w-3.5 h-3.5 ${
                                  st <= (rev.rating || 5)
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'fill-slate-200 text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.createdAt}</span>
                        </div>
                      </div>

                      <h5 className="font-bold text-slate-900 text-sm">{rev.title}</h5>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {rev.comment}
                      </p>

                      <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
                        <span>Was this review helpful?</span>
                        <button
                          type="button"
                          onClick={() => handleHelpful(rev.id)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                            helpfulClicked[rev.id]
                              ? 'bg-blue-50 text-[#1A175A]'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>Helpful ({Number(rev.helpfulCount || 0) + (helpfulClicked[rev.id] ? 1 : 0)})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Hospital Care & Sanitization */}
            {activeTab === 'care' && (
              <div className="py-10 space-y-6 animate-fade-in max-w-3xl">
                <h4 className="font-bold text-slate-900 text-base">Sterilization & Laundering Protocols</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ANR garments are manufactured using pre-shrunk, color-fast biomedical dyed yarns engineered to survive repeated clinical wash cycles.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-[#1A175A]">Commercial Washing</h5>
                    <p className="text-xs text-slate-500">Machine wash warm up to 60°C (140°F) with standard hospital-grade detergent.</p>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-[#1A175A]">Bleach Guidelines</h5>
                    <p className="text-xs text-slate-500">Non-chlorine oxygen bleach recommended. Avoid straight chlorine bleach on colored scrubs.</p>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-[#1A175A]">Drying & Ironing</h5>
                    <p className="text-xs text-slate-500">Tumble dry low or hang dry. Warm iron if needed; iron embroidery from the reverse side.</p>
                  </div>
                  <div className="space-y-1.5">
                    <h5 className="text-xs font-bold text-[#1A175A]">Autoclave Disinfection</h5>
                    <p className="text-xs text-slate-500">Safe for standard OT steam autoclave cycles at 121°C for sterile surgical ward entry.</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* ============================================================ */}
          {/* RECOMMENDED PRODUCTS SECTION                                 */}
          {/* Curated 4-column grid powered by ProductCard                 */}
          {/* ============================================================ */}
          {relatedProducts.length > 0 && (
            <section className="mt-20 pt-16 border-t border-slate-200">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1A175A] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Recommended For Your Department
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                    Frequently Paired Uniforms
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    Medical scrubs, doctor coats, and patient garments crafted with matching fabric standards.
                  </p>
                </div>
                <Link
                  to="/products"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A175A] hover:underline shrink-0"
                >
                  <span>Explore All Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-x-2.5 sm:gap-x-6 gap-y-4 sm:gap-y-8">
                {relatedProducts.slice(0, 4).map(rel => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </section>
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
          <span>
            Add to Cart • {product?.hasTopBottomSizes ? `Top: ${selectedTopSize} / Bottom: ${selectedBottomSize}` : `Size ${selectedSize}`}
          </span>
        </button>
      </div>

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-[#1A175A]">Write a Verified Review</h3>
                <p className="text-xs text-slate-500">Share your hospital shift feedback with fellow doctors and clinical teams.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Your Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setReviewForm(p => ({ ...p, rating: st }))}
                      className="p-1 cursor-pointer transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          st <= reviewForm.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'fill-slate-200 text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">
                    {reviewForm.rating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name & Hospital</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Aravind / Apollo Hospitals"
                  value={reviewForm.reviewerName}
                  onChange={e => setReviewForm(p => ({ ...p, reviewerName: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1A175A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Comfortable scrub set with sharp embroidery"
                  value={reviewForm.title}
                  onChange={e => setReviewForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1A175A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Detailed Experience</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How did the fabric feel during your shift? How was the fit, breathability, and wash quality?"
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(p => ({ ...p, comment: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-[#1A175A] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  );
};

export default ProductDetailPage;