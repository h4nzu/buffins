'use client';

import { useState } from 'react';
import { ShoppingBag, CheckCircle2 } from 'lucide-react';

const FLAVORS = [
  {
    id: 'classic',
    name: 'Classic Banana',
    piecePrice: 25,
    box4Price: 100,
    box6Price: 140,
  },
  {
    id: 'chocChip',
    name: 'Chocolate Chip',
    piecePrice: 30,
    box4Price: 120,
    box6Price: 170,
  },
  {
    id: 'creamCheese',
    name: 'Cream Cheese',
    piecePrice: 35,
    box4Price: 140,
    box6Price: 200,
  },
];

export default function HomePage() {
  const [orderMode, setOrderMode] = useState('fixed');
  const [selectedFlavor, setSelectedFlavor] = useState('chocChip');
  const [selectedBoxSize, setSelectedBoxSize] = useState('Box of 4');

  const [assortedCounts, setAssortedCounts] = useState({
    classic: 2,
    chocChip: 1,
    creamCheese: 1,
  });

  const [form, setForm] = useState({
    customerName: '',
    contactNo: '',
    socialHandle: '',
    deliveryAddress: '',
    timeSlot: 'Morning (9:00 AM - 12:00 PM)',
    paymentMethod: 'GCash',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [receipt, setReceipt] = useState(null);

  const getOrderSummary = () => {
    if (orderMode === 'fixed') {
      const flavorObj = FLAVORS.find((f) => f.id === selectedFlavor);
      const qty = selectedBoxSize === 'Box of 4' ? 4 : 6;
      const total = selectedBoxSize === 'Box of 4' ? flavorObj.box4Price : flavorObj.box6Price;
      return {
        orderType: selectedBoxSize,
        classicQty: selectedFlavor === 'classic' ? qty : 0,
        chocChipQty: selectedFlavor === 'chocChip' ? qty : 0,
        creamCheeseQty: selectedFlavor === 'creamCheese' ? qty : 0,
        totalItems: qty,
        totalAmount: total,
        label: `${selectedBoxSize} • ${flavorObj.name}`,
      };
    }

    const totalItems =
      assortedCounts.classic + assortedCounts.chocChip + assortedCounts.creamCheese;
    const totalAmount =
      assortedCounts.classic * 25 +
      assortedCounts.chocChip * 30 +
      assortedCounts.creamCheese * 35;

    return {
      orderType: 'Assorted',
      classicQty: assortedCounts.classic,
      chocChipQty: assortedCounts.chocChip,
      creamCheeseQty: assortedCounts.creamCheese,
      totalItems,
      totalAmount,
      label: `Assorted (${totalItems} pcs)`,
    };
  };

  const summary = getOrderSummary();

  const updateAssorted = (id, delta) => {
    setAssortedCounts((prev) => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (summary.totalItems < 4) {
      setErrorMsg('Minimum order is 4 pieces.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          orderType: summary.orderType,
          classicQty: summary.classicQty,
          chocChipQty: summary.chocChipQty,
          creamCheeseQty: summary.creamCheeseQty,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Something went wrong.');
      } else {
        setReceipt({
          orderId: data.orderId,
          totalAmount: data.totalAmount,
          customerName: form.customerName,
          timeSlot: form.timeSlot,
        });
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] text-slate-800 selection:bg-[#F4C430]/40">
      {/* Continuous Moving Denim Top Bar */}
      <div className="bg-[#3B6E9C] text-[#FFFDF5] text-xs py-2 font-medium tracking-wide overflow-hidden select-none">
        <style>{`
          @keyframes scrollRightLoop {
            0% {
              transform: translate3d(-50%, 0, 0);
            }
            100% {
              transform: translate3d(0%, 0, 0);
            }
          }
          .marquee-track {
            display: flex;
            width: max-content;
            will-change: transform;
            animation: scrollRightLoop 16s linear infinite !important;
          }
        `}</style>

        <div className="marquee-track">
          <div className="flex shrink-0 items-center gap-12 pr-12">
            <span>Dec 5 Pre-Orders Open • Boxes Only</span>
            <span>Bello! Classic • Chocolate Chip • Cream Cheese</span>
            <span>No Solo Orders • Box of 4, Box of 6 &amp; Assorted</span>
            <span>Fresh Holiday Batch • December 5</span>
          </div>
          <div aria-hidden="true" className="flex shrink-0 items-center gap-12 pr-12">
            <span>Dec 5 Pre-Orders Open • Boxes Only</span>
            <span>Bello! Classic • Chocolate Chip • Cream Cheese</span>
            <span>No Solo Orders • Box of 4, Box of 6 &amp; Assorted</span>
            <span>Fresh Holiday Batch • December 5</span>
          </div>
        </div>
      </div>

      {/* Minimal Minion-Inspired Welcome Header */}
      <header className="max-w-4xl mx-auto px-4 pt-10 pb-8 text-center">
        {/* Minimal Goggle Emblem */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-40 h-2.5 bg-slate-700 rounded-full absolute" />
          <div className="relative flex items-center -space-x-2">
            <div className="w-12 h-12 rounded-full bg-[#FFFDF5] border-[5px] border-slate-600 flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 rounded-full bg-amber-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white -translate-x-0.5 -translate-y-0.5" />
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FFFDF5] border-[5px] border-slate-600 flex items-center justify-center shadow-xs">
              <div className="w-4 h-4 rounded-full bg-amber-900 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white -translate-x-0.5 -translate-y-0.5" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
          Bello! <span className="text-[#D9A404]">Banana Muffins.</span>
        </h1>
        <p className="mt-2.5 text-sm sm:text-base text-slate-500">
          Fresh holiday batch dropping <span className="font-semibold text-[#3B6E9C]">December 5</span>.
        </p>
      </header>

      {/* Main Builder + Checkout */}
      <main className="max-w-4xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left: Box Selection */}
        <section className="md:col-span-7 bg-white border border-amber-200/80 rounded-3xl p-6 shadow-xs space-y-6">
          {/* Mode Toggle */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FFF8DC] rounded-2xl border border-amber-200/80">
            <button
              type="button"
              onClick={() => setOrderMode('fixed')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                orderMode === 'fixed'
                  ? 'bg-[#3B6E9C] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Single Flavor
            </button>
            <button
              type="button"
              onClick={() => setOrderMode('assorted')}
              className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                orderMode === 'assorted'
                  ? 'bg-[#3B6E9C] text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assorted Mix
            </button>
          </div>

          {orderMode === 'fixed' ? (
            <div className="space-y-5">
              {/* Flavor List */}
              <div className="space-y-2.5">
                {FLAVORS.map((flavor) => {
                  const active = selectedFlavor === flavor.id;
                  return (
                    <button
                      key={flavor.id}
                      type="button"
                      onClick={() => setSelectedFlavor(flavor.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 transition flex items-center justify-between ${
                        active
                          ? 'bg-[#FFF8DC] border-[#3B6E9C]'
                          : 'bg-[#FFFDF5] border-amber-200/60 hover:border-amber-300'
                      }`}
                    >
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {flavor.name}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-slate-600">
                        ₱{flavor.box4Price} <span className="text-slate-400">/</span> ₱{flavor.box6Price}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Box Size */}
              <div className="grid grid-cols-2 gap-3">
                {['Box of 4', 'Box of 6'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedBoxSize(size)}
                    className={`py-2.5 px-4 rounded-2xl border-2 font-bold text-sm transition ${
                      selectedBoxSize === size
                        ? 'bg-[#F4C430] border-slate-800 text-slate-900'
                        : 'bg-[#FFFDF5] border-amber-200/70 text-slate-600'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Min. 4 pieces total (₱25 / ₱30 / ₱35 per pc)</p>
              {FLAVORS.map((flavor) => (
                <div
                  key={flavor.id}
                  className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#FFFDF5] border border-amber-200/70"
                >
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{flavor.name}</div>
                    <div className="text-xs text-slate-500">₱{flavor.piecePrice} / pc</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => updateAssorted(flavor.id, -1)}
                      className="w-7 h-7 rounded-full bg-amber-100 hover:bg-amber-200 font-bold text-slate-800"
                    >
                      -
                    </button>
                    <span className="w-5 text-center font-bold text-sm">
                      {assortedCounts[flavor.id]}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateAssorted(flavor.id, 1)}
                      className="w-7 h-7 rounded-full bg-[#F4C430] border border-slate-700 font-bold text-slate-900"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right: Checkout */}
        <section className="md:col-span-5 bg-white border border-amber-200/80 rounded-3xl p-6 shadow-xs">
          {/* Summary Bar */}
          <div className="bg-[#FFF8DC] border border-amber-200/90 rounded-2xl px-4 py-3 mb-5 flex items-center justify-between">
            <span className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-[#3B6E9C]" /> {summary.label}
            </span>
            <span className="text-base sm:text-lg font-extrabold text-[#3B6E9C]">
              ₱{summary.totalAmount}
            </span>
          </div>

          {receipt ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2.5">
              <CheckCircle2 className="w-9 h-9 text-emerald-600 mx-auto" />
              <h3 className="font-bold text-base text-emerald-950">Order Reserved!</h3>
              <p className="text-xs text-emerald-800">
                ID: <span className="font-mono font-bold">{receipt.orderId}</span> • ₱{receipt.totalAmount}
              </p>
              <p className="text-xs text-slate-600">
                Locked in for Dec 5 ({receipt.timeSlot}).
              </p>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="mt-2 w-full py-2 rounded-xl bg-[#3B6E9C] text-white text-xs font-semibold"
              >
                Order Again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                required
                type="text"
                placeholder="Full Name *"
                value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 text-sm focus:outline-none focus:border-[#3B6E9C]"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <input
                  required
                  type="tel"
                  placeholder="Mobile No. *"
                  value={form.contactNo}
                  onChange={(e) => setForm({ ...form, contactNo: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 text-sm focus:outline-none focus:border-[#3B6E9C]"
                />
                <input
                  type="text"
                  placeholder="FB / IG Handle"
                  value={form.socialHandle}
                  onChange={(e) => setForm({ ...form, socialHandle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 text-sm focus:outline-none focus:border-[#3B6E9C]"
                />
              </div>

              <textarea
                required
                rows={2}
                placeholder="Delivery Address / Landmark *"
                value={form.deliveryAddress}
                onChange={(e) => setForm({ ...form, deliveryAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 text-sm focus:outline-none focus:border-[#3B6E9C]"
              />

              <div className="grid grid-cols-2 gap-2.5">
                <select
                  value={form.timeSlot}
                  onChange={(e) => setForm({ ...form, timeSlot: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 text-xs sm:text-sm focus:outline-none focus:border-[#3B6E9C]"
                >
                  <option>Morning (9:00 AM - 12:00 PM)</option>
                  <option>Afternoon (1:00 PM - 5:00 PM)</option>
                  <option>Evening (5:00 PM - 8:00 PM)</option>
                </select>

                <select
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF5] border border-amber-200/80 text-xs sm:text-sm focus:outline-none focus:border-[#3B6E9C]"
                >
                  <option>GCash</option>
                  <option>Cash on Delivery</option>
                </select>
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading || summary.totalItems < 4}
                className="w-full py-3 rounded-2xl bg-[#F4C430] hover:bg-amber-400 disabled:opacity-50 border-2 border-slate-800 text-slate-900 font-extrabold text-sm transition cursor-pointer"
              >
                {loading ? 'Sending...' : `Pre-Order • ₱${summary.totalAmount}`}
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}