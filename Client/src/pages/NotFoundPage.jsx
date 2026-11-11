import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import Breadcrumbs from '../components/Breadcrumbs';
import { fetchCategoriesTree, getCategoryPageLink } from '../services/api';
import {
  Search,
  Home,
  ShoppingBag,
  Building2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategoriesTree()
      .then((tree) => setCategories(Array.isArray(tree) ? tree.slice(0, 6) : []))
      .catch(() => setCategories([]));
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    navigate(trimmed ? `/products?q=${encodeURIComponent(trimmed)}` : '/products');
  };

  return (
    <Layout>
      <Breadcrumbs items={[{ label: '404 • Page Not Found' }]} />

      <section className="py-14 sm:py-20 bg-slate-50 min-h-[72vh] flex items-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-widest">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Error 404</span>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-black text-[#1A175A] tracking-tight">
                Page Not Found
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                We couldn't find <code className="px-1.5 py-0.5 rounded bg-slate-100 text-[#1A175A] font-mono text-[11px]">{location.pathname}</code>. The garment link may have moved or been updated in our catalog.
              </p>
            </div>

            {/* Catalog Search */}
            <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search scrub suits, lab coats, gowns..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1A175A] focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs font-bold transition-colors"
              >
                Search
              </button>
            </form>

            {/* Primary Navigation Links */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A175A] hover:bg-[#141247] text-white text-xs sm:text-sm font-bold shadow-md transition-colors"
              >
                <span>Browse All Apparel</span>
                <ArrowRight className="w-4 h-4 text-blue-200" />
              </Link>

              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-[#1A175A] text-slate-800 hover:text-[#1A175A] text-xs sm:text-sm font-bold transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </Link>

              <Link
                to="/cart"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-[#1A175A] text-slate-800 hover:text-[#1A175A] text-xs sm:text-sm font-bold transition-colors"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Shopping Bag</span>
              </Link>

              <Link
                to="/bulk-order"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 hover:border-[#1A175A] text-slate-800 hover:text-[#1A175A] text-xs sm:text-sm font-bold transition-colors"
              >
                <Building2 className="w-4 h-4" />
                <span>Bulk Orders</span>
              </Link>
            </div>

            {/* Category Shortcuts */}
            {categories.length > 0 && (
              <div className="pt-6 border-t border-slate-100 space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                  Popular Apparel Collections
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id || cat.slug}
                      to={getCategoryPageLink(cat.slug)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-[#1A175A] text-slate-700 hover:text-white text-xs font-semibold transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default NotFoundPage;
