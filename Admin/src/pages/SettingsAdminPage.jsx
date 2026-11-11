import { useState, useEffect } from 'react';
import {
  Save,
  RefreshCw,
  Check,
  CreditCard,
  Scissors,
  Layers,
  Warehouse,
  Plus,
  Trash2,
  ShieldCheck,
  Info
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import api from '../services/api';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'Custom Embroidery', label: 'Custom Embroidery', icon: Scissors },
  { id: 'Payment & COD', label: 'Payment & COD', icon: CreditCard },
  { id: 'Bulk Order Tiers', label: 'Bulk Order Tiers', icon: Layers },
  { id: 'Inventory Alerts', label: 'Inventory Alerts', icon: Warehouse },
];

const SettingsAdminPage = () => {
  const [tab, setTab] = useState('Custom Embroidery');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 1. Custom Embroidery State
  const [embroiderySettings, setEmbroiderySettings] = useState({
    enabled: true,
    namePrice: 150,
    logoPrice: 250,
    maxNameLength: 30,
    maxDeptLength: 35,
    allowLogoUpload: true,
  });

  // 2. Payment & COD State
  const [paymentSettings, setPaymentSettings] = useState({
    enableCod: true,
    enableOnline: true,
    razorpayKeyId: 'rzp_test_TBPx9EL1T1aqhC',
    codMinimumOrder: 0,
    codMaximumOrder: 50000,
  });

  // 3. Bulk Order Discount Tiers State
  const [bulkTiers, setBulkTiers] = useState([
    { id: 'tier-1', minQty: 25, maxQty: 99, discountPercent: 10, label: 'Tier 1 (Clinics & Small Teams)' },
    { id: 'tier-2', minQty: 100, maxQty: 499, discountPercent: 15, label: 'Tier 2 (Hospitals & Nursing Homes)' },
    { id: 'tier-3', minQty: 500, maxQty: '', discountPercent: 20, label: 'Tier 3 (Enterprise Hospital Chains)' },
  ]);

  // 4. Global Inventory Low Stock Alert Threshold State
  const [inventorySettings, setInventorySettings] = useState({
    globalLowStockThreshold: 10,
  });

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const [embRes, payRes, tiersRes, invRes] = await Promise.all([
        api.get('/settings/embroidery').catch(() => null),
        api.get('/settings/payment').catch(() => null),
        api.get('/settings/bulk_tiers').catch(() => null),
        api.get('/settings/inventory').catch(() => null),
      ]);

      if (embRes?.data?.success && embRes?.data?.data) {
        setEmbroiderySettings(s => ({ ...s, ...embRes.data.data }));
      }

      if (payRes?.data?.success && payRes?.data?.data) {
        setPaymentSettings(s => ({ ...s, ...payRes.data.data }));
      }

      if (tiersRes?.data?.success && tiersRes?.data?.data?.tiers) {
        setBulkTiers(tiersRes.data.data.tiers);
      }

      if (invRes?.data?.success && invRes?.data?.data) {
        setInventorySettings({
          globalLowStockThreshold: invRes.data.data.globalLowStockThreshold ?? 10,
        });
      }
    } catch (err) {
      console.warn('Failed to load settings:', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Save Embroidery Settings
  const handleSaveEmbroidery = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/embroidery', {
        enabled: Boolean(embroiderySettings.enabled),
        namePrice: Number(embroiderySettings.namePrice),
        logoPrice: Number(embroiderySettings.logoPrice),
        maxNameLength: Number(embroiderySettings.maxNameLength || 30),
        maxDeptLength: Number(embroiderySettings.maxDeptLength || 35),
        allowLogoUpload: Boolean(embroiderySettings.allowLogoUpload),
      });
      setSaved(true);
      toast.success('Custom Embroidery pricing & rules saved live!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save embroidery settings');
    } finally {
      setSaving(false);
    }
  };

  // Save Payment & COD Settings
  const handleSavePayment = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/payment', {
        enableCod: Boolean(paymentSettings.enableCod),
        enableOnline: Boolean(paymentSettings.enableOnline),
        razorpayKeyId: String(paymentSettings.razorpayKeyId || 'rzp_test_TBPx9EL1T1aqhC'),
        codMinimumOrder: Number(paymentSettings.codMinimumOrder || 0),
        codMaximumOrder: Number(paymentSettings.codMaximumOrder || 50000),
      });
      setSaved(true);
      toast.success('Payment options & COD toggle saved live!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  // Save Bulk Tiers
  const handleSaveBulkTiers = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/bulk_tiers', {
        tiers: bulkTiers.map(t => ({
          ...t,
          minQty: Number(t.minQty),
          maxQty: t.maxQty ? Number(t.maxQty) : null,
          discountPercent: Number(t.discountPercent),
        }))
      });
      setSaved(true);
      toast.success('Bulk Order discount tiers saved live!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bulk discount tiers');
    } finally {
      setSaving(false);
    }
  };

  // Save Inventory Settings
  const handleSaveInventorySettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings/inventory', {
        globalLowStockThreshold: Number(inventorySettings.globalLowStockThreshold)
      });
      setSaved(true);
      toast.success('Global Inventory Stock Alert Threshold saved!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save inventory settings');
    } finally {
      setSaving(false);
    }
  };

  const addTier = () => {
    setBulkTiers([
      ...bulkTiers,
      {
        id: `tier-${Date.now()}`,
        minQty: 10,
        maxQty: 50,
        discountPercent: 5,
        label: 'New Institutional Tier'
      }
    ]);
  };

  const removeTier = (index) => {
    if (bulkTiers.length <= 1) {
      toast.error('At least one bulk discount tier is required');
      return;
    }
    setBulkTiers(bulkTiers.filter((_, i) => i !== index));
  };

  const updateTierField = (index, field, value) => {
    const updated = [...bulkTiers];
    updated[index] = { ...updated[index], [field]: value };
    setBulkTiers(updated);
  };

  const Field = ({ label, helpText, ...props }) => (
    <div>
      <label className="block text-xs font-semibold text-neutral-800 mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full border border-neutral-300 rounded-lg p-2.5 text-xs text-neutral-900 focus:border-[#1a175a] focus:outline-none bg-white transition-colors"
      />
      {helpText && <p className="text-[11px] text-neutral-400 mt-1">{helpText}</p>}
    </div>
  );

  return (
    <AdminLayout title="System Settings">
      {/* Tabs Bar */}
      <div className="flex gap-2 mb-6 border-b border-brand-light flex-wrap" role="tablist">
        {TABS.map(t => {
          const Icon = t.icon;
          const isActive = tab === t.id;
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActive
                  ? 'border-[#1a175a] text-[#1a175a] font-bold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl border border-neutral-100">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-6 h-6 rounded bg-neutral-200" />
              <div className="space-y-1.5">
                <div className="h-5 bg-neutral-200 rounded w-48" />
                <div className="h-3 bg-neutral-200 rounded w-64" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/60 space-y-2">
                  <div className="h-3.5 bg-neutral-200 rounded w-28" />
                  <div className="h-9 bg-neutral-200 rounded-lg w-full" />
                </div>
              ))}
            </div>
            <div className="h-10 bg-neutral-200 rounded-xl w-36" />
          </div>
        ) : (
          <>
            {/* 1. CUSTOM EMBROIDERY TAB */}
            {tab === 'Custom Embroidery' && (
              <form onSubmit={handleSaveEmbroidery} className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <Scissors className="text-[#1a175a]" size={20} />
                  <div>
                    <h2 className="font-playfair text-lg sm:text-xl font-semibold text-neutral-900">
                      Custom Embroidery Pricing & Controls
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Configure doctor name & hospital crest embroidery charges applied during storefront customization.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={embroiderySettings.enabled}
                      onChange={e => setEmbroiderySettings(s => ({ ...s, enabled: e.target.checked }))}
                      className="w-4 h-4 accent-[#1a175a] rounded cursor-pointer"
                    />
                    <span>Enable Custom Embroidery Module in Storefront</span>
                  </label>
                  <p className="text-xs text-neutral-600 pl-6.5">
                    When enabled, shoppers can personalize scrub suits and doctor aprons with custom name tags and crest logos.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Field
                    label="Doctor Name / Line Embroidery Price (₹)"
                    type="number"
                    min="0"
                    step="1"
                    value={embroiderySettings.namePrice}
                    onChange={e => setEmbroiderySettings(s => ({ ...s, namePrice: e.target.value }))}
                    helpText="Standard charge per line of doctor name or designation embroidery (e.g. ₹150)."
                  />

                  <Field
                    label="Hospital Crest Logo Upload Price (₹)"
                    type="number"
                    min="0"
                    step="1"
                    value={embroiderySettings.logoPrice}
                    onChange={e => setEmbroiderySettings(s => ({ ...s, logoPrice: e.target.value }))}
                    helpText="Digitization and embroidery charge for hospital/clinic vector logo upload (e.g. ₹250)."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    label="Maximum Doctor Name Length (Characters)"
                    type="number"
                    min="10"
                    max="60"
                    value={embroiderySettings.maxNameLength}
                    onChange={e => setEmbroiderySettings(s => ({ ...s, maxNameLength: e.target.value }))}
                    helpText="Character limit for the primary doctor name embroidery line."
                  />

                  <Field
                    label="Maximum Department Length (Characters)"
                    type="number"
                    min="10"
                    max="60"
                    value={embroiderySettings.maxDeptLength}
                    onChange={e => setEmbroiderySettings(s => ({ ...s, maxDeptLength: e.target.value }))}
                    helpText="Character limit for the secondary specialty/department line."
                  />
                </div>

                <div className="pt-4 border-t border-brand-light flex items-center gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Embroidery Settings'}
                  </button>
                  {saved && (
                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                      <Check size={14} /> Embroidery settings updated live!
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* 2. PAYMENT & COD TAB */}
            {tab === 'Payment & COD' && (
              <form onSubmit={handleSavePayment} className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <CreditCard className="text-[#1a175a]" size={20} />
                  <div>
                    <h2 className="font-playfair text-lg sm:text-xl font-semibold text-neutral-900">
                      Payment Options & Cash on Delivery (COD)
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Toggle Cash on Delivery visibility on checkout and manage Razorpay online gateway settings.
                    </p>
                  </div>
                </div>

                {/* Dynamic COD Toggle Box */}
                <div className={`p-4 rounded-xl border transition-all ${
                  paymentSettings.enableCod
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-neutral-50 border-neutral-200'
                }`}>
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableCod}
                      onChange={e => setPaymentSettings(s => ({ ...s, enableCod: e.target.checked }))}
                      className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                    />
                    <span>Enable Cash on Delivery (COD) at Checkout</span>
                  </label>
                  <p className="text-xs text-neutral-600 pl-6.5 mt-1 leading-relaxed">
                    {paymentSettings.enableCod ? (
                      <span className="text-emerald-700 font-medium">
                        ✓ <strong>Active:</strong> Cash on Delivery is enabled and will be offered as a payment option on the customer checkout page.
                      </span>
                    ) : (
                      <span className="text-neutral-500">
                        ✕ <strong>Disabled:</strong> Cash on Delivery will NOT be shown at checkout. Customers must pay online via Razorpay.
                      </span>
                    )}
                  </p>
                </div>

                {/* Online Payment (Razorpay) Toggle Box */}
                <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl space-y-3">
                  <label className="flex items-center gap-2.5 text-sm font-semibold text-neutral-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableOnline}
                      onChange={e => setPaymentSettings(s => ({ ...s, enableOnline: e.target.checked }))}
                      className="w-4 h-4 accent-[#1a175a] rounded cursor-pointer"
                    />
                    <span>Enable Online Payments (Razorpay: UPI, Cards, Net Banking)</span>
                  </label>

                  <div className="pl-6.5">
                    <div className="bg-white p-3 rounded-lg border border-blue-200 text-xs">
                      <div className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
                        Active Razorpay Key ID (Test Mode)
                      </div>
                      <div className="font-mono text-xs text-[#1a175a] font-bold">
                        {paymentSettings.razorpayKeyId || 'rzp_test_TBPx9EL1T1aqhC'}
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-1">
                        Loaded from environment configuration. Online transactions use the verified sandbox credentials.
                      </p>
                    </div>
                  </div>
                </div>

                {/* COD Order Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <Field
                    label="Minimum COD Order (₹)"
                    type="number"
                    min="0"
                    value={paymentSettings.codMinimumOrder}
                    onChange={e => setPaymentSettings(s => ({ ...s, codMinimumOrder: e.target.value }))}
                    helpText="Minimum cart subtotal required to use Cash on Delivery."
                  />

                  <Field
                    label="Maximum COD Order (₹)"
                    type="number"
                    min="0"
                    value={paymentSettings.codMaximumOrder}
                    onChange={e => setPaymentSettings(s => ({ ...s, codMaximumOrder: e.target.value }))}
                    helpText="Maximum order value allowed for COD (large orders require online payment)."
                  />
                </div>

                <div className="pt-4 border-t border-brand-light flex items-center gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Payment Settings'}
                  </button>
                  {saved && (
                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                      <Check size={14} /> Payment settings updated live!
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* 3. BULK ORDER TIERS TAB */}
            {tab === 'Bulk Order Tiers' && (
              <form onSubmit={handleSaveBulkTiers} className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Layers className="text-[#1a175a]" size={20} />
                    <div>
                      <h2 className="font-playfair text-lg sm:text-xl font-semibold text-neutral-900">
                        Bulk Institutional Quantity Discount Tiers
                      </h2>
                      <p className="text-xs text-neutral-500">
                        Manage quantity brackets and discounts shown on the Bulk Order enquiry page and offers section.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addTier}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a175a] text-white text-xs font-semibold hover:bg-[#141247] transition-all"
                  >
                    <Plus size={14} /> Add Tier
                  </button>
                </div>

                <div className="space-y-4">
                  {bulkTiers.map((tier, idx) => (
                    <div
                      key={tier.id || idx}
                      className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-white transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-[#1a175a] uppercase tracking-wider">
                          Tier #{idx + 1}
                        </span>
                        {bulkTiers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeTier(idx)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                            title="Remove tier"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Tier Title / Target
                          </label>
                          <input
                            type="text"
                            value={tier.label}
                            onChange={e => updateTierField(idx, 'label', e.target.value)}
                            placeholder="e.g. Clinics & Small Teams"
                            className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-[#1a175a] focus:outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Min Qty
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tier.minQty}
                            onChange={e => updateTierField(idx, 'minQty', e.target.value)}
                            className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-[#1a175a] focus:outline-none bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Max Qty (leave blank for +)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={tier.maxQty || ''}
                            onChange={e => updateTierField(idx, 'maxQty', e.target.value)}
                            placeholder="Unlimited"
                            className="w-full border border-neutral-300 rounded-lg p-2 text-xs focus:border-[#1a175a] focus:outline-none bg-white"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-40">
                          <label className="block text-[11px] font-semibold text-neutral-700 mb-1">
                            Discount (%)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              min="1"
                              max="90"
                              value={tier.discountPercent}
                              onChange={e => updateTierField(idx, 'discountPercent', e.target.value)}
                              className="w-full border border-neutral-300 rounded-lg p-2 pr-7 text-xs focus:border-[#1a175a] focus:outline-none bg-white font-bold"
                            />
                            <span className="absolute right-2.5 top-2 text-xs text-neutral-400 font-bold">%</span>
                          </div>
                        </div>

                        <div className="flex-1 text-xs text-neutral-500 pt-5">
                          Applies to orders of {tier.minQty} {tier.maxQty ? `to ${tier.maxQty}` : '+'} units.
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-brand-light flex items-center gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Bulk Discount Tiers'}
                  </button>
                  {saved && (
                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                      <Check size={14} /> Bulk tiers updated live!
                    </span>
                  )}
                </div>
              </form>
            )}

            {/* 4. INVENTORY ALERTS TAB */}
            {tab === 'Inventory Alerts' && (
              <form onSubmit={handleSaveInventorySettings} className="space-y-6">
                <div className="flex items-center gap-2 pb-3 border-b border-neutral-100">
                  <Warehouse className="text-[#1a175a]" size={20} />
                  <div>
                    <h2 className="font-playfair text-lg sm:text-xl font-semibold text-neutral-900">
                      Global Inventory Stock Alert Threshold
                    </h2>
                    <p className="text-xs text-neutral-500">
                      Global default limit to trigger low stock warnings in the top notification bell.
                    </p>
                  </div>
                </div>

                <Field
                  label="Global Low Stock Threshold (units)"
                  id="inv-global-threshold"
                  type="number"
                  value={inventorySettings.globalLowStockThreshold}
                  onChange={e => setInventorySettings(s => ({ ...s, globalLowStockThreshold: e.target.value }))}
                  helpText="When stock falls to or below this unit limit, an alert triggers in the admin header notification bell."
                />

                <div className="pt-4 border-t border-brand-light flex items-center gap-3">
                  <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5">
                    {saving ? <RefreshCw size={15} className="animate-spin" /> : <Save size={15} />}
                    {saving ? 'Saving...' : 'Save Inventory Threshold'}
                  </button>
                  {saved && (
                    <span className="text-green-600 text-sm font-semibold flex items-center gap-1">
                      <Check size={14} /> Threshold updated!
                    </span>
                  )}
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default SettingsAdminPage;