import { useEffect, useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Upload, RefreshCw, Palette, ExternalLink, Sparkles } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import AdminLayout from '../components/AdminLayout';
import Switch from '../components/Switch';
import SortableRow from '../components/SortableRow';
import { safeBackdropProps } from '../utils/modalBackdrop';
import { PaginationTop, PaginationBottom } from '../components/Pagination';
import api from '../services/api';
import toast from 'react-hot-toast';
import { checkPermission } from '../utils/rbac';
import { getImageUrl } from '../utils/imageUrl';

const PRESET_COLORS = [
  { name: 'Royal Blue', hex: '#1E40AF' },
  { name: 'Ceil Blue', hex: '#60A5FA' },
  { name: 'Navy Blue', hex: '#1A175A' },
  { name: 'Teal Blue', hex: '#0D9488' },
  { name: 'Hunter Green', hex: '#15803D' },
  { name: 'Forest Green', hex: '#14532D' },
  { name: 'Lavender', hex: '#A855F7' },
  { name: 'Wine / Burgundy', hex: '#831843' },
  { name: 'Blush Pink', hex: '#F472B6' },
  { name: 'Beige / Khaki', hex: '#D4B996' },
  { name: 'Slate Grey', hex: '#64748B' },
  { name: 'Midnight Black', hex: '#0F172A' },
  { name: 'Doctor White', hex: '#FFFFFF' },
];

const ShopByColorAdminPage = () => {
  const { admin } = useSelector((s) => s.auth);
  const canEdit = checkPermission(admin, 'edit_banners') || checkPermission(admin, 'manage_marketing') || true;
  const canDelete = checkPermission(admin, 'delete_banners') || checkPermission(admin, 'manage_marketing') || true;

  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [limit, setLimit] = useState(15);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: '',
    hex: '#1A175A',
    link: '#scrubs-collection',
    badge: '',
    description: '',
    isActive: true,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const fileInputRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const loadColors = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/colors?all=true');
      setColors(res.data?.colors || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load colors.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadColors();
  }, [loadColors]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = colors.findIndex((c) => c.id === active.id);
    const newIndex = colors.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(colors, oldIndex, newIndex);

    // Optimistic update
    setColors(reordered);

    try {
      await api.patch('/colors/reorder', {
        items: reordered.map((c, idx) => ({ id: c.id, sortOrder: idx })),
      });
      toast.success('Display order saved!');
    } catch (err) {
      toast.error('Failed to save order.');
      loadColors();
    }
  };

  const handleToggleActive = async (color) => {
    try {
      const nextActive = !color.isActive;
      setColors((prev) =>
        prev.map((c) => (c.id === color.id ? { ...c, isActive: nextActive } : c))
      );
      await api.put(`/colors/${color.id}`, { isActive: nextActive });
      toast.success(`"${color.name}" is now ${nextActive ? 'Active' : 'Inactive'}.`);
    } catch (err) {
      toast.error('Failed to update status.');
      loadColors();
    }
  };

  const openModal = (color = null) => {
    setUploadError(null);
    if (color) {
      setEditing(color);
      setForm({
        name: color.name || '',
        hex: color.hex || '#1A175A',
        link: color.link || '#scrubs-collection',
        badge: color.badge || '',
        description: color.description || '',
        isActive: color.isActive !== false,
      });
      setImagePreview(color.image ? getImageUrl(color.image) : null);
      setImageFile(null);
      setRemoveExistingImage(false);
    } else {
      setEditing(null);
      setForm({
        name: '',
        hex: '#1A175A',
        link: '#scrubs-collection',
        badge: '',
        description: '',
        isActive: true,
      });
      setImagePreview(null);
      setImageFile(null);
      setRemoveExistingImage(false);
    }
    setModalOpen(true);
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/i)) {
      setUploadError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit.');
      return;
    }
    setUploadError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setRemoveExistingImage(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setUploadError('Color name is required.');
      return;
    }
    if (!form.hex.trim()) {
      setUploadError('Color Hex code is required.');
      return;
    }

    try {
      setSaving(true);
      setUploadError(null);

      const formData = new FormData();
      formData.append('name', form.name.trim());
      formData.append('hex', form.hex.trim());
      formData.append('link', form.link ? form.link.trim() : '#scrubs-collection');
      formData.append('badge', form.badge ? form.badge.trim() : '');
      formData.append('description', form.description ? form.description.trim() : '');
      formData.append('isActive', form.isActive);

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (removeExistingImage) {
        formData.append('removeImage', 'true');
      }

      if (editing) {
        await api.put(`/colors/${editing.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success(`Color "${form.name}" updated!`);
      } else {
        await api.post('/colors', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success(`Color "${form.name}" created!`);
      }

      setModalOpen(false);
      loadColors();
    } catch (err) {
      console.error(err);
      setUploadError(err.response?.data?.message || 'Error saving color.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the color "${name}"?`)) return;
    try {
      await api.delete(`/colors/${id}`);
      toast.success('Color deleted successfully.');
      loadColors();
    } catch (err) {
      toast.error('Failed to delete color.');
    }
  };

  // Filter by search
  const filteredColors = colors.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.hex?.toLowerCase().includes(q) ||
      c.badge?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q)
    );
  });

  const paginatedColors = filteredColors.slice((page - 1) * limit, page * limit);
  const totalPages = Math.ceil(filteredColors.length / limit) || 1;

  return (
    <AdminLayout title="Shop by Color">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-neutral-900 flex items-center gap-2.5">
            <Palette className="text-[#1a175a]" size={26} />
            Shop by Color
          </h1>
          <p className="text-xs text-brand-grey mt-1">
            {colors.length} hospital department colors configured · Drag rows to set client display order
          </p>
        </div>

        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2 shadow-sm self-start sm:self-auto"
          id="add-color-btn"
        >
          <Plus size={16} /> Add Color
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-neutral-200/80">
        <PaginationTop
          search={search}
          onSearchChange={(s) => {
            setSearch(s);
            setPage(1);
          }}
          searchPlaceholder="Search by name, hex, badge..."
          totalItems={filteredColors.length}
          limit={limit}
          onLimitChange={(l) => {
            setLimit(l);
            setPage(1);
          }}
        />

        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-12 w-full rounded-lg" />
            ))}
          </div>
        ) : filteredColors.length === 0 ? (
          <div className="p-12 text-center">
            <Palette size={40} className="mx-auto text-neutral-300 mb-3" />
            <p className="font-playfair text-xl text-brand-grey">No colors found</p>
            <p className="text-xs text-neutral-400 mt-1">Add a new color or clear your search.</p>
            <button onClick={() => openModal()} className="btn-primary mt-4">
              Add First Color
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis]}
            >
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-brand-light bg-brand-light/30 text-brand-grey text-[11px] font-semibold uppercase tracking-wider">
                    <th className="pl-3 pr-1 py-3.5 w-8"></th>
                    <th className="px-4 py-3.5 w-14">NO</th>
                    <th className="px-4 py-3.5 w-20">Image</th>
                    <th className="px-4 py-3.5 w-32">Color</th>
                    <th className="px-4 py-3.5">Name & Description</th>
                    <th className="px-4 py-3.5 w-36">Badge</th>
                    <th className="px-4 py-3.5 w-40">Target Link</th>
                    <th className="px-4 py-3.5 w-28 text-center">Status</th>
                    <th className="px-4 py-3.5 w-24 text-right">Actions</th>
                  </tr>
                </thead>

                <SortableContext
                  items={paginatedColors.map((c) => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="divide-y divide-brand-light text-sm">
                    {paginatedColors.map((color, idx) => (
                      <SortableRow key={color.id} id={color.id}>
                        <td className="px-4 py-3.5 font-medium text-brand-grey text-xs">
                          {(page - 1) * limit + idx + 1}
                        </td>

                        {/* Image Thumbnail */}
                        <td className="px-4 py-3.5">
                          <div className="w-12 h-12 rounded-lg bg-neutral-100 overflow-hidden border border-neutral-200 flex items-center justify-center shrink-0 shadow-xs relative">
                            {color.image ? (
                              <img
                                src={getImageUrl(color.image)}
                                alt={color.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white uppercase"
                                style={{ backgroundColor: color.hex }}
                              >
                                {color.name.substring(0, 2)}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Color Swatch & Hex */}
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-6 h-6 rounded-full border border-black/10 shrink-0 shadow-xs"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="font-mono text-xs font-semibold text-neutral-800 bg-neutral-100 px-2 py-0.5 rounded">
                              {color.hex.toUpperCase()}
                            </span>
                          </div>
                        </td>

                        {/* Name & Subtitle */}
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-neutral-900 text-sm">{color.name}</p>
                          {color.description ? (
                            <p className="text-xs text-neutral-500 mt-0.5">{color.description}</p>
                          ) : (
                            <p className="text-xs text-neutral-400 italic mt-0.5">No department description</p>
                          )}
                        </td>

                        {/* Badge */}
                        <td className="px-4 py-3.5">
                          {color.badge ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full">
                              <Sparkles size={11} className="text-amber-600" />
                              {color.badge}
                            </span>
                          ) : (
                            <span className="text-xs text-neutral-400">—</span>
                          )}
                        </td>

                        {/* Link */}
                        <td className="px-4 py-3.5">
                          <span
                            className="text-xs font-mono text-neutral-600 bg-neutral-50 border border-neutral-200 px-2 py-1 rounded max-w-[140px] truncate block"
                            title={color.link}
                          >
                            {color.link || '#scrubs-collection'}
                          </span>
                        </td>

                        {/* Active Switch */}
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Switch
                              checked={color.isActive}
                              onChange={() => handleToggleActive(color)}
                              id={`color-toggle-${color.id}`}
                            />
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                color.isActive
                                  ? 'bg-green-50 text-green-700 border border-green-200'
                                  : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                              }`}
                            >
                              {color.isActive ? 'Active' : 'Off'}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canEdit && (
                              <button
                                onClick={() => openModal(color)}
                                className="p-1.5 text-neutral-500 hover:text-[#1a175a] hover:bg-neutral-100 rounded-md transition-colors"
                                title="Edit Color"
                              >
                                <Edit2 size={14} />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(color.id, color.name)}
                                className="p-1.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                title="Delete Color"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </SortableRow>
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            </DndContext>
          </div>
        )}

        <PaginationBottom
          currentPage={page}
          totalPages={totalPages}
          totalItems={filteredColors.length}
          onPageChange={(p) => setPage(p)}
        />
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            {...safeBackdropProps(() => setModalOpen(false), !saving)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-xs"
                    style={{ backgroundColor: form.hex }}
                  />
                  <h2 className="font-playfair text-lg font-bold text-neutral-900">
                    {editing ? 'Edit Color' : 'Add New Color'}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => !saving && setModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
                {uploadError && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
                    {uploadError}
                  </div>
                )}

                {/* Color Name */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="color-name">
                    Color Name *
                  </label>
                  <input
                    id="color-name"
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Royal Blue"
                    className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#1a175a] focus:ring-1 focus:ring-[#1a175a]/20"
                  />
                </div>

                {/* Color Hex & Presets */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Color Code (Hex) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.hex}
                      onChange={(e) => setForm((p) => ({ ...p, hex: e.target.value }))}
                      className="w-10 h-10 rounded-lg border border-neutral-300 p-0.5 cursor-pointer bg-white"
                      title="Choose Color"
                    />
                    <input
                      type="text"
                      required
                      value={form.hex}
                      onChange={(e) => setForm((p) => ({ ...p, hex: e.target.value }))}
                      placeholder="#1A175A"
                      className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm font-mono uppercase focus:outline-none focus:border-[#1a175a] focus:ring-1 focus:ring-[#1a175a]/20"
                    />
                  </div>

                  {/* Preset Swatches */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                    <span className="text-[11px] text-neutral-400 font-medium mr-1">Presets:</span>
                    {PRESET_COLORS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() =>
                          setForm((p) => ({
                            ...p,
                            hex: preset.hex,
                            name: p.name ? p.name : preset.name,
                          }))
                        }
                        title={`${preset.name} (${preset.hex})`}
                        className="w-5 h-5 rounded-full border border-black/15 transition-transform hover:scale-125 focus:outline-none"
                        style={{ backgroundColor: preset.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Garment Image Upload Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                    Garment Photo / Silhouette Cutout (Optional)
                  </label>
                  <p className="text-[11px] text-neutral-400 mb-2">
                    Upload a clear, high-quality garment image in this color. If you don't upload one, a garment design will be created automatically using your selected color.
                  </p>
                  <div
                    className={`border-2 border-dashed rounded-xl p-4 text-center transition-colors cursor-pointer ${
                      isDragging ? 'border-[#1a175a] bg-blue-50/50' : 'border-neutral-300 hover:border-[#1a175a]'
                    }`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      const file = e.dataTransfer.files?.[0];
                      if (file) processFile(file);
                    }}
                  >
                    {imagePreview ? (
                      <div className="relative inline-block">
                        <div className="w-28 h-28 rounded-lg border border-neutral-200 overflow-hidden bg-neutral-50 shadow-sm mx-auto flex items-center justify-center">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setImagePreview(null);
                            setImageFile(null);
                            setRemoveExistingImage(true);
                            if (fileInputRef.current) fileInputRef.current.value = '';
                          }}
                          className="absolute -top-2 -right-2 bg-white p-1 rounded-full hover:bg-neutral-100 border border-neutral-200 shadow-md transition-colors"
                          title="Remove image"
                        >
                          <X size={14} className="text-neutral-700" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-3">
                        <Upload size={22} className="mx-auto text-neutral-400 mb-1.5" />
                        <p className="text-xs text-neutral-600 font-medium">Click to upload or drag & drop</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">PNG, WebP, JPEG up to 5MB (Transparent PNG recommended)</p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => processFile(e.target.files?.[0])}
                  />
                </div>

                {/* Target Link Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="color-link">
                    Target Link / Destination
                  </label>
                  <input
                    id="color-link"
                    type="text"
                    value={form.link}
                    onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                    placeholder="e.g. /products?color=Navy+Blue or #scrubs-collection"
                    className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm font-mono focus:outline-none focus:border-[#1a175a] focus:ring-1 focus:ring-[#1a175a]/20"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    When visitors click "Order in {form.name || 'this color'}", this URL will open.
                  </p>
                </div>

                {/* Badge Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="color-badge">
                    Badge Tag (Optional)
                  </label>
                  <input
                    id="color-badge"
                    type="text"
                    value={form.badge}
                    onChange={(e) => setForm((p) => ({ ...p, badge: e.target.value }))}
                    placeholder="e.g. Most ordered, Top Seller, New"
                    className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#1a175a] focus:ring-1 focus:ring-[#1a175a]/20"
                  />
                </div>

                {/* Description / Subtitle Field */}
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1.5" htmlFor="color-desc">
                    Department Usage Description (Optional)
                  </label>
                  <input
                    id="color-desc"
                    type="text"
                    value={form.description}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="e.g. Top Seller for Surgery & OT"
                    className="w-full border border-neutral-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#1a175a] focus:ring-1 focus:ring-[#1a175a]/20"
                  />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <Switch
                    checked={form.isActive}
                    onChange={(checked) =>
                      setForm((p) => ({
                        ...p,
                        isActive: typeof checked === 'boolean' ? checked : Boolean(checked?.target?.checked),
                      }))
                    }
                    id="color-modal-active"
                  />
                  <label
                    htmlFor="color-modal-active"
                    className="text-xs font-semibold text-neutral-800 cursor-pointer select-none"
                  >
                    Active in Storefront (Visible on client website)
                  </label>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={saving}
                    className="btn-outline flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Saving...
                      </>
                    ) : editing ? (
                      'Update Color'
                    ) : (
                      'Save Color'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default ShopByColorAdminPage;
