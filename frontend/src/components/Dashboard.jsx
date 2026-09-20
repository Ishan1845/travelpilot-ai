import React, { useState } from 'react';
import { 
  IndianRupee, Calendar, AlertTriangle, CheckCircle2, 
  TrendingUp, SlidersHorizontal, ShieldCheck, Users, Car, Plane, Train, Loader2 
} from 'lucide-react';

export default function Dashboard({ itinerary, onUpdateConstraints, isUpdating }) {
  const [showModal, setShowModal] = useState(false);
  const [newBudget, setNewBudget] = useState(itinerary?.metadata?.budget || 20000);
  const [newMembers, setNewMembers] = useState(itinerary?.metadata?.members_count || 1);
  const [newMode, setNewMode] = useState(itinerary?.metadata?.travel_mode || "road");

  if (!itinerary) return null;

  const metadata = itinerary.metadata;
  const totals = itinerary.trip_totals || { 
    estimated_total_cost: 0, 
    activities_cost: 0, 
    transport_cost: 0, 
    cost_per_day: {}, 
    total_activities: 0, 
    members_count: 1 
  };
  const members = totals.members_count || metadata.members_count || 1;
  const conflicts = itinerary.conflicts || [];
  const criticalErrors = conflicts.filter(c => c.severity === 'error');
  const warnings = conflicts.filter(c => c.severity === 'warning');

  const budgetRatio = Math.min(100, Math.round((totals.estimated_total_cost / (metadata.budget || 1)) * 100));
  const isOverBudget = totals.estimated_total_cost > metadata.budget;
  const costPerPerson = Math.round(totals.estimated_total_cost / members);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateConstraints({ 
      new_budget: parseFloat(newBudget),
      new_members_count: parseInt(newMembers, 10),
      new_travel_mode: newMode
    });
    setShowModal(false);
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-sm transition-all card-3d">
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Trip Dashboard & Financial Analytics</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Group finances in INR (₹), verified transit subtotal & live conflict status
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-sky-600" />
          <span>Update Budget & Constraints</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Estimated Total */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Est. Cost</span>
            <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{totals.estimated_total_cost.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium flex items-center justify-between">
            <span>Budget: ₹{metadata.budget.toLocaleString('en-IN')}</span>
            <span className={isOverBudget ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
              {budgetRatio}%
            </span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
            <div 
              className={`h-full transition-all ${isOverBudget ? 'bg-rose-500' : 'bg-emerald-500'}`} 
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>
        </div>

        {/* Cost Per Person */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Cost / Person</span>
            <div className="p-1.5 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{costPerPerson.toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            For {members} traveler{members > 1 ? 's' : ''}
          </div>
        </div>

        {/* Transit vs Activities */}
        <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Transit Subtotal</span>
            <div className={`p-1.5 rounded-lg ${
              metadata.travel_mode === 'flight' 
                ? 'bg-sky-100 text-sky-600' 
                : metadata.travel_mode === 'train' 
                  ? 'bg-teal-100 text-teal-600' 
                  : 'bg-amber-100 text-amber-600'
            }`}>
              {metadata.travel_mode === 'flight' ? <Plane className="w-4 h-4" /> : metadata.travel_mode === 'train' ? <Train className="w-4 h-4" /> : <Car className="w-4 h-4" />}
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">
            ₹{(totals.transport_cost || 0).toLocaleString('en-IN')}
          </div>
          <div className="mt-2 text-xs text-slate-500 font-medium">
            Activities: ₹{(totals.activities_cost || 0).toLocaleString('en-IN')}
          </div>
        </div>

        {/* Validation Status */}
        <div className={`border rounded-2xl p-4 ${
          criticalErrors.length > 0
            ? 'bg-rose-50/70 border-rose-200 text-rose-900'
            : warnings.length > 0
              ? 'bg-amber-50/70 border-amber-200 text-amber-900'
              : 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Validation State</span>
            <div className="p-1.5 rounded-lg bg-white/80 shadow-xs">
              {criticalErrors.length === 0 ? (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600" />
              )}
            </div>
          </div>
          <div className="text-lg font-bold">
            {criticalErrors.length === 0 ? "Optimal Schedule" : `${criticalErrors.length} Overlaps`}
          </div>
          <div className="mt-2 text-xs opacity-80 font-medium">
            {conflicts.length === 0
              ? "All opening hours & buffers verified."
              : `${conflicts.length} total notice(s)`}
          </div>
        </div>
      </div>

      {/* Daily Cost Distribution */}
      <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 mb-6">
        <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-3">
          Daily Spending Breakdown (INR ₹)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {itinerary.days.map((d) => (
            <div key={d.day_number} className="bg-white border border-slate-200/70 p-3 rounded-xl">
              <span className="text-[11px] font-bold text-slate-400 block">Day {d.day_number}</span>
              <span className="text-sm font-extrabold text-slate-800">
                ₹{(totals.cost_per_day?.[d.date] || 0).toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400 block truncate mt-0.5">{d.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flagged Conflicts Section */}
      {conflicts.length > 0 && (
        <div className="border border-amber-200/80 bg-amber-50/40 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Itinerary Verification Notes ({conflicts.length})</span>
          </div>
          <div className="space-y-2">
            {conflicts.map((c, i) => (
              <div key={i} className="text-xs text-slate-700 bg-white/90 border border-amber-200/70 p-2.5 rounded-xl flex items-start gap-2">
                <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${c.severity === 'error' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <span>{c.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Constraint Update Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 animate-fadeIn">
            <h4 className="text-lg font-bold text-slate-900 mb-1">Adjust Trip Constraints</h4>
            <p className="text-xs text-slate-500 mb-4">
              Update your budget, group size, or transportation mode. TravelPilot rebalances impacted days dynamically.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Target Budget (INR ₹)
                </label>
                <input
                  type="number"
                  min="2000"
                  max="2000000"
                  step="500"
                  required
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Number of Members
                </label>
                <select
                  value={newMembers}
                  onChange={(e) => setNewMembers(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-sm"
                >
                  <option value={1}>1 Solo Traveler</option>
                  <option value={2}>2 Members</option>
                  <option value={3}>3 Members</option>
                  <option value={4}>4 Members</option>
                  <option value={5}>5 Members</option>
                  <option value={6}>6+ Members</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Transportation Mode
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMode("road")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center justify-center gap-1 ${
                      newMode === "road" ? 'bg-amber-50 text-amber-900 border-amber-400 ring-2 ring-amber-400/20' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Car className="w-3.5 h-3.5 text-amber-600" />
                    <span>🚗 Road</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMode("train")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center justify-center gap-1 ${
                      newMode === "train" ? 'bg-teal-50 text-teal-900 border-teal-400 ring-2 ring-teal-400/20' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Train className="w-3.5 h-3.5 text-teal-600" />
                    <span>🚆 Railway</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMode("flight")}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold cursor-pointer flex items-center justify-center gap-1 ${
                      newMode === "flight" ? 'bg-sky-50 text-sky-900 border-sky-400 ring-2 ring-sky-400/20' : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    <Plane className="w-3.5 h-3.5 text-sky-600" />
                    <span>✈️ Flight</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>Apply & Recompute</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
