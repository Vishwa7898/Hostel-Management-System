import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LogOut, LayoutDashboard, User, Home, MessageSquare, CreditCard, Calendar,
  UtensilsCrossed, Plus, Pencil, Trash2
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';
const MEAL_LABELS = { breakfast: '🌅 Breakfast', lunch: '☀️ Lunch', dinner: '🌙 Dinner', tea: '🍵 Tea' };

function FoodIcon({ imageUrl }) {
  if (!imageUrl) return <span className="text-2xl">🍽️</span>;
  if (imageUrl.startsWith('/')) {
    return (
      <img src={`${API_BASE}${imageUrl}`} alt="" className="w-10 h-10 rounded-lg object-cover" />
    );
  }
  return <span className="text-2xl">{imageUrl}</span>;
}
const STATUS_COLORS = {
  pending: 'bg-amber-100 text-amber-700',
  confirmed: 'bg-blue-100 text-blue-700',
  served: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};
const PAYMENT_COLORS = {
  paid: 'bg-emerald-100 text-emerald-700',
  unpaid: 'bg-amber-100 text-amber-700',
};

export default function AdminFoodOrder() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'menu'
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMealTime, setFilterMealTime] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', mealTime: 'breakfast', imageUrl: '', isVegetarian: false });
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token || user.role === 'Student') return navigate('/admin-login');
    if (activeTab === 'orders') fetchOrders();
    else fetchItems();
  }, [token, user.role, activeTab, filterStatus, filterMealTime, filterDate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.set('status', filterStatus);
      if (filterMealTime) params.set('mealTime', filterMealTime);
      if (filterDate) params.set('date', filterDate);
      const url = `http://localhost:5000/api/food/orders?${params}`;
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/food/items', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`http://localhost:5000/api/food/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const openAddItem = () => {
    setEditingItem(null);
    setFormData({ name: '', description: '', price: '', mealTime: 'breakfast', imageUrl: '', isVegetarian: false });
    setImageFile(null);
    setShowItemModal(true);
  };

  const openEditItem = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      price: item.price,
      mealTime: item.mealTime,
      imageUrl: item.imageUrl || '',
      isVegetarian: !!item.isVegetarian,
    });
    setImageFile(null);
    setShowItemModal(true);
  };

  const saveItem = async () => {
    if (!formData.name || !formData.price || !formData.mealTime) return;
    try {
      const url = editingItem
        ? `http://localhost:5000/api/food/items/${editingItem._id}`
        : 'http://localhost:5000/api/food/items';
      const method = editingItem ? 'PUT' : 'POST';

      let body;
      let headers = { Authorization: `Bearer ${token}` };
      if (imageFile) {
        const fd = new FormData();
        fd.append('name', formData.name);
        fd.append('description', formData.description);
        fd.append('price', formData.price);
        fd.append('mealTime', formData.mealTime);
        fd.append('isVegetarian', formData.isVegetarian);
        fd.append('image', imageFile);
        body = fd;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({
          ...formData,
          imageUrl: formData.imageUrl || '🍽️',
        });
      }

      const res = await fetch(url, { method, headers, body });
      if (res.ok) {
        setShowItemModal(false);
        setImageFile(null);
        fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/food/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex h-screen sticky top-0 py-6 px-4 shadow-sm z-10">
        <div className="flex items-center space-x-2 font-bold text-2xl mb-10 px-2 text-slate-800">
          <div className="w-8 h-8 bg-orange-500 rounded flex justify-center items-center text-white">
            <Home size={18} />
          </div>
          <span><span className="text-gray-500">Stay</span><span className="text-[#4BB580]">Sphere</span></span>
        </div>
        <div className="flex-1 space-y-2">
          <div onClick={() => navigate('/admin-dashboard')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </div>
          <div onClick={() => navigate('/admin-profile')} className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <User size={20} />
            <span>Profile</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Calendar size={20} />
            <span>Attendance</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <Home size={20} />
            <span>Room Details</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <MessageSquare size={20} />
            <span>Complaints</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 hover:bg-slate-50 text-black rounded-lg cursor-pointer transition-colors font-medium">
            <CreditCard size={20} />
            <span>Payments</span>
          </div>
          <div className="flex items-center space-x-3 px-4 py-3 bg-orange-50 text-black rounded-lg font-medium">
            <UtensilsCrossed size={20} />
            <span>Food Order</span>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-100 pt-4">
          <div onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer transition-colors font-medium">
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 p-4 shadow-sm flex justify-between items-center z-0">
          <h1 className="text-xl font-bold tracking-tight text-slate-800 hidden sm:block">
            Food Order <span className="text-orange-500">Management</span>
          </h1>
          <div className="flex items-center space-x-4 ml-auto">
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-bold text-sm text-slate-800 leading-none">{user.name}</span>
              <span className="text-xs text-slate-500">{user.role || 'Admin'}</span>
            </div>
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-x-hidden">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'orders' ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Orders
            </button>
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'menu' ? 'bg-orange-500 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              Menu Items
            </button>
          </div>

          {activeTab === 'orders' && (
            <>
              <div className="flex flex-wrap gap-3 mb-6">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="served">Served</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <select
                  value={filterMealTime}
                  onChange={(e) => setFilterMealTime(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500"
                >
                  <option value="">All Meal Times</option>
                  {Object.entries(MEAL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-slate-300 rounded px-3 py-2 text-sm outline-none focus:border-orange-500"
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-slate-500">Loading orders...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                          <th className="p-4 border-b font-semibold">Order ID</th>
                          <th className="p-4 border-b font-semibold">Student</th>
                          <th className="p-4 border-b font-semibold">Room</th>
                          <th className="p-4 border-b font-semibold">Meal</th>
                          <th className="p-4 border-b font-semibold">Items</th>
                          <th className="p-4 border-b font-semibold">Amount</th>
                          <th className="p-4 border-b font-semibold">Payment</th>
                          <th className="p-4 border-b font-semibold">Status</th>
                          <th className="p-4 border-b font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o._id} className="hover:bg-slate-50 border-b last:border-0">
                            <td className="p-4 text-slate-600 text-sm font-mono">#{o._id?.slice(-6)}</td>
                            <td className="p-4 font-medium">{o.studentName || o.student?.name}</td>
                            <td className="p-4 text-slate-600">{o.hostelRoom}</td>
                            <td className="p-4">{MEAL_LABELS[o.mealTime] || o.mealTime}</td>
                            <td className="p-4 text-sm">
                              {o.items?.map((i, idx) => (
                                <div key={idx}>{i.foodItem?.name || 'Item'} x{i.quantity}</div>
                              ))}
                            </td>
                            <td className="p-4 font-semibold">Rs. {o.totalAmount}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${PAYMENT_COLORS[o.paymentStatus] || 'bg-slate-100 text-slate-600'}`}>
                                {o.paymentStatus === 'paid' ? 'Paid ✓' : 'Unpaid'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${STATUS_COLORS[o.status] || 'bg-slate-100'}`}>
                                {o.status}
                              </span>
                            </td>
                            <td className="p-4">
                              {o.status !== 'cancelled' && o.status !== 'served' && (
                                <div className="flex flex-wrap gap-1">
                                  {o.status === 'pending' && (
                                    <button
                                      onClick={() => updateOrderStatus(o._id, 'confirmed')}
                                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                                    >
                                      Confirm
                                    </button>
                                  )}
                                  {(o.status === 'pending' || o.status === 'confirmed') && (
                                    <button
                                      onClick={() => updateOrderStatus(o._id, 'served')}
                                      className="px-2 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600"
                                    >
                                      Served
                                    </button>
                                  )}
                                  <button
                                    onClick={() => updateOrderStatus(o._id, 'cancelled')}
                                    className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr><td colSpan="9" className="p-12 text-center text-slate-500">No orders found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'menu' && (
            <>
              <div className="flex justify-end mb-6">
                <button
                  onClick={openAddItem}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus size={18} />
                  Add Food Item
                </button>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {loading ? (
                  <div className="p-12 text-center text-slate-500">Loading menu...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-600 text-sm uppercase tracking-wider">
                          <th className="p-4 border-b font-semibold">Icon</th>
                          <th className="p-4 border-b font-semibold">Name</th>
                          <th className="p-4 border-b font-semibold">Meal Time</th>
                          <th className="p-4 border-b font-semibold">Price</th>
                          <th className="p-4 border-b font-semibold">Status</th>
                          <th className="p-4 border-b font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-50 border-b last:border-0">
                            <td className="p-4"><FoodIcon imageUrl={item.imageUrl} /></td>
                            <td className="p-4 font-medium">{item.name}</td>
                            <td className="p-4">{MEAL_LABELS[item.mealTime] || item.mealTime}</td>
                            <td className="p-4 font-semibold">Rs. {item.price}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded text-xs ${item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                {item.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-4 flex gap-2">
                              <button onClick={() => openEditItem(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                <Pencil size={16} />
                              </button>
                              <button onClick={() => deleteItem(item._id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {items.length === 0 && (
                          <tr><td colSpan="6" className="p-12 text-center text-slate-500">No menu items. Add some!</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">{editingItem ? 'Edit Food Item' : 'Add Food Item'}</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-orange-500"
                  placeholder="e.g. Rice & Curry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Description</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-orange-500"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Price (Rs.)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Meal Time</label>
                <select
                  value={formData.mealTime}
                  onChange={(e) => setFormData({ ...formData, mealTime: e.target.value })}
                  className="w-full border border-slate-300 rounded px-3 py-2 outline-none focus:border-orange-500"
                >
                  {Object.entries(MEAL_LABELS).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Food Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center">
                    {imageFile ? (
                      <img src={URL.createObjectURL(imageFile)} alt="" className="w-full h-full object-cover" />
                    ) : formData.imageUrl?.startsWith('/') ? (
                      <img src={`${API_BASE}${formData.imageUrl}`} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{formData.imageUrl || '🍽️'}</span>
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        setImageFile(f || null);
                        if (!f) setFormData({ ...formData, imageUrl: formData.imageUrl });
                      }}
                      className="text-sm text-slate-600 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-50 file:text-orange-600 file:font-medium hover:file:bg-orange-100"
                    />
                    <p className="text-xs text-slate-500 mt-1">Upload image or leave empty for default icon</p>
                  </div>
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isVegetarian}
                  onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                  className="rounded text-orange-500"
                />
                <span className="text-sm">Vegetarian</span>
              </label>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setShowItemModal(false)}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={saveItem}
                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
