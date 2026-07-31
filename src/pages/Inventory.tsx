import React, { useState } from 'react';
import { useGymData } from '../context/GymDataContext';
import { StatusBadge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Package, Plus, AlertTriangle, RefreshCw, ShoppingCart } from 'lucide-react';

export const Inventory: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryStock } = useGymData();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [sku, setSku] = useState('PRO-SHIRT-01');
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'supplements' | 'apparel' | 'equipment' | 'beverages' | 'accessories'>('supplements');
  const [quantity, setQuantity] = useState(25);
  const [minThreshold, setMinThreshold] = useState(10);
  const [unitPrice, setUnitPrice] = useState(35);
  const [costPrice, setCostPrice] = useState(18);
  const [supplier, setSupplier] = useState('Global NutriCorp');

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    await addInventoryItem({
      sku,
      name,
      category,
      quantity,
      minThreshold,
      unitPrice,
      costPrice,
      supplier,
    });
    setShowAddModal(false);
    resetForm();
  };

  const resetForm = () => {
    setName('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Package className="w-5 h-5 text-cyan-400" />
            Pro Shop & Gym Inventory
          </h1>
          <p className="text-xs text-slate-400">Track workout supplements, apparel, beverages, lifting gear, and stock alert thresholds.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>Add SKU Item</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800/80 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">SKU Code</th>
                <th className="py-3.5 px-4">Item Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">In Stock</th>
                <th className="py-3.5 px-4">Retail Price</th>
                <th className="py-3.5 px-4">Supplier</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Adjust Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">{item.sku}</td>
                  <td className="py-3 px-4 font-semibold text-slate-100">{item.name}</td>
                  <td className="py-3 px-4 capitalize text-slate-300">{item.category}</td>
                  <td className="py-3 px-4 font-bold text-slate-100">
                    {item.quantity} <span className="text-[10px] text-slate-500 font-normal">(Min: {item.minThreshold})</span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400">${item.unitPrice}</td>
                  <td className="py-3 px-4 text-slate-400">{item.supplier}</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-3 px-4 text-right space-x-1">
                    <button
                      onClick={() => updateInventoryStock(item.id, item.quantity + 5)}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-400"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => updateInventoryStock(item.id, Math.max(0, item.quantity - 1))}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs font-bold text-amber-400"
                    >
                      -1
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add SKU Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add Inventory SKU Item">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Item Title</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Optimum BCAA Energy Drink 500ml"
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Code</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                <option value="supplements">Supplements</option>
                <option value="beverages">Beverages</option>
                <option value="apparel">Apparel</option>
                <option value="accessories">Accessories</option>
                <option value="equipment">Equipment</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Quantity in Stock</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Min Threshold Alert</label>
              <input
                type="number"
                value={minThreshold}
                onChange={(e) => setMinThreshold(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Retail Price ($)</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Supplier Name</label>
              <input
                type="text"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            Add Pro Shop Product
          </button>
        </form>
      </Modal>
    </div>
  );
};
