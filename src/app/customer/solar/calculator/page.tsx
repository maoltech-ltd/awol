"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BatteryCharging, Calculator, Plus, Send, Sun, Trash2, Zap } from "lucide-react";
import api from "@/src/api";
import WhatsAppButton from "@/src/components/Buttons/WhatsAppButton";

type Appliance = {
  id: string;
  name: string;
  watts: number;
  qty: number;
  hours: number;
  period: "day" | "night" | "both";
};

const applianceDefaults = [
  ["LED bulb", 10],
  ["TV", 100],
  ["Standing fan", 60],
  ["Ceiling fan", 75],
  ["Refrigerator", 200],
  ["Freezer", 250],
  ["Laptop", 65],
  ["Wi-Fi router", 15],
  ["Phone charger", 10],
  ["CCTV system", 50],
  ["Pumping machine 0.5HP", 500],
  ["Pumping machine 1HP", 1100],
  ["Microwave", 1000],
  ["Electric iron", 1200],
  ["Air conditioner 1HP", 1200],
] as const;

const formatMoney = (value?: number | string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function SolarCalculator() {
  const [items, setItems] = useState<Appliance[]>([
    { id: crypto.randomUUID(), name: "LED bulb", watts: 10, qty: 6, hours: 6, period: "night" },
    { id: crypto.randomUUID(), name: "TV", watts: 100, qty: 1, hours: 5, period: "night" },
    { id: crypto.randomUUID(), name: "Standing fan", watts: 60, qty: 2, hours: 8, period: "both" },
  ]);
  const [selectedAppliance, setSelectedAppliance] = useState("LED bulb");
  const [sunHours, setSunHours] = useState(5);
  const [panelWatts, setPanelWatts] = useState(550);
  const [batteryVoltage, setBatteryVoltage] = useState(48);
  const [dod, setDod] = useState(0.8);
  const [autonomyDays, setAutonomyDays] = useState(1);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const localSizing = useMemo(() => {
    let peakLoad = 0;
    let dailyEnergy = 0;
    let nightEnergy = 0;

    items.forEach((item) => {
      const power = Number(item.watts) * Number(item.qty);
      const energy = power * Number(item.hours);
      peakLoad += power;
      dailyEnergy += energy;

      if (item.period === "night") nightEnergy += energy;
      if (item.period === "both") nightEnergy += energy / 2;
    });

    const inverterRequired = Math.ceil(peakLoad * 1.25);
    const batteryWh = nightEnergy ? Math.ceil((nightEnergy * autonomyDays) / dod) : 0;
    const batteryAh = batteryWh ? Math.ceil(batteryWh / batteryVoltage) : 0;
    const solarWatts = dailyEnergy ? Math.ceil((dailyEnergy / sunHours) * 1.25) : 0;
    const panelCount = solarWatts ? Math.ceil(solarWatts / panelWatts) : 0;

    return {
      peakLoad,
      dailyEnergy,
      nightEnergy,
      inverterRequired,
      batteryWh,
      batteryAh,
      solarWatts,
      panelCount,
    };
  }, [items, autonomyDays, dod, batteryVoltage, sunHours, panelWatts]);

  function addAppliance() {
    const selected = applianceDefaults.find(([name]) => name === selectedAppliance);
    if (!selected) return;

    setItems((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name: selected[0],
        watts: selected[1],
        qty: 1,
        hours: 4,
        period: "night",
      },
    ]);
  }

  function updateItem(id: string, key: keyof Appliance, value: string | number) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  async function getRecommendation() {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("v1/customer-awol/solar/recommendation/", {
        appliances: items,
        sun_hours: sunHours,
        panel_watts: panelWatts,
        battery_voltage: batteryVoltage,
        depth_of_discharge: dod,
        autonomy_days: autonomyDays,
      });
      setRecommendation(res.data);
    } catch {
      setError("Could not fetch product recommendations. Confirm the backend is running and products are configured.");
    } finally {
      setLoading(false);
    }
  }

  const whatsappMessage = `Hello, I need a solar setup.%0APeak load: ${localSizing.peakLoad}W%0ADaily energy: ${(localSizing.dailyEnergy / 1000).toFixed(2)}kWh%0ABattery: ${(localSizing.batteryWh / 1000).toFixed(2)}kWh%0APanels: ${localSizing.panelCount} x ${panelWatts}W`;

  return (
    <main className="min-h-screen bg-[#f7f8f3] text-slate-950">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-10 md:px-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-800">
            <Sun size={16} />
            Appliance-based solar sizing
          </div>
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">Smart solar calculator</h1>
              <p className="mt-3 max-w-2xl leading-7 text-slate-600">
                Size a practical inverter, battery bank, and solar array from real appliance usage, then request matching AWOL products from the backend.
              </p>
            </div>
            <button onClick={getRecommendation} disabled={loading || items.length === 0} className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-slate-950 px-5 text-sm font-semibold text-white disabled:opacity-60">
              <Send size={18} />
              {loading ? "Checking..." : "Find AWOL products"}
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-8 md:px-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row">
              <select value={selectedAppliance} onChange={(e) => setSelectedAppliance(e.target.value)} className="h-11 flex-1 rounded-md border border-slate-200 px-3 outline-none focus:border-amber-500">
                {applianceDefaults.map(([name, watts]) => (
                  <option key={name} value={name}>
                    {name} ({watts}W)
                  </option>
                ))}
              </select>
              <button onClick={addAppliance} className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-amber-500 px-4 text-sm font-semibold text-slate-950">
                <Plus size={18} />
                Add appliance
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <motion.div key={item.id} layout className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[1fr_120px_120px_140px_44px] md:items-end">
                  <div>
                    <label className="text-xs font-medium text-slate-500">Appliance</label>
                    <input value={item.name} onChange={(e) => updateItem(item.id, "name", e.target.value)} className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Watts</label>
                    <input type="number" value={item.watts} onChange={(e) => updateItem(item.id, "watts", Number(e.target.value))} className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Qty</label>
                    <input type="number" min={0} value={item.qty} onChange={(e) => updateItem(item.id, "qty", Number(e.target.value))} className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-amber-500" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-500">Hours and period</label>
                    <div className="mt-1 grid grid-cols-2 gap-2">
                      <input type="number" min={0} value={item.hours} onChange={(e) => updateItem(item.id, "hours", Number(e.target.value))} className="h-11 rounded-md border border-slate-200 px-3 outline-none focus:border-amber-500" />
                      <select value={item.period} onChange={(e) => updateItem(item.id, "period", e.target.value as Appliance["period"])} className="h-11 rounded-md border border-slate-200 px-2 outline-none focus:border-amber-500">
                        <option value="day">Day</option>
                        <option value="night">Night</option>
                        <option value="both">Both</option>
                      </select>
                    </div>
                  </div>
                  <button onClick={() => setItems((current) => current.filter((next) => next.id !== item.id))} className="flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Calculator size={18} />
              System assumptions
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              <NumberField label="Sun hours" value={sunHours} onChange={setSunHours} />
              <NumberField label="Panel watts" value={panelWatts} onChange={setPanelWatts} />
              <NumberField label="Battery voltage" value={batteryVoltage} onChange={setBatteryVoltage} />
              <NumberField label="Battery DoD" value={dod} step={0.05} onChange={setDod} />
              <NumberField label="Autonomy days" value={autonomyDays} onChange={setAutonomyDays} />
            </div>
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-5 lg:h-fit">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Zap size={20} className="text-amber-500" />
              Sizing result
            </h2>
            <div className="mt-4 grid gap-3">
              <ResultRow label="Peak load" value={`${localSizing.peakLoad.toFixed(0)} W`} />
              <ResultRow label="Inverter" value={`${localSizing.inverterRequired.toFixed(0)} W`} />
              <ResultRow label="Daily energy" value={`${(localSizing.dailyEnergy / 1000).toFixed(2)} kWh`} />
              <ResultRow label="Night energy" value={`${(localSizing.nightEnergy / 1000).toFixed(2)} kWh`} />
              <ResultRow label="Battery" value={`${(localSizing.batteryWh / 1000).toFixed(2)} kWh / ${localSizing.batteryAh} Ah`} />
              <ResultRow label="Solar array" value={`${localSizing.solarWatts.toFixed(0)} W`} />
              <ResultRow label="Panels" value={`${localSizing.panelCount} x ${panelWatts}W`} />
            </div>
            <div className="mt-5">
              <WhatsAppButton message={whatsappMessage} />
            </div>
          </div>

          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          {recommendation && (
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="flex items-center gap-2 text-lg font-semibold">
                <BatteryCharging size={20} className="text-emerald-600" />
                Recommended products
              </h2>
              <div className="mt-4 space-y-3">
                <RecommendationItem label="Inverter" item={recommendation.recommendations?.inverter} />
                <RecommendationItem label="Battery" item={recommendation.recommendations?.battery} />
                <RecommendationItem label="Panels" item={recommendation.recommendations?.panel} />
                <RecommendationItem label="Controller" item={recommendation.recommendations?.charge_controller} />
              </div>
              <div className="mt-4 rounded-md bg-slate-950 p-4 text-white">
                <div className="text-sm text-slate-300">Estimated product total</div>
                <div className="mt-1 text-2xl font-semibold">{formatMoney(recommendation.total_price)}</div>
              </div>
            </div>
          )}
        </aside>
      </section>
    </main>
  );
}

function NumberField({ label, value, onChange, step = 1 }: { label: string; value: number; step?: number; onChange: (value: number) => void }) {
  return (
    <label>
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <input type="number" step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-1 h-11 w-full rounded-md border border-slate-200 px-3 outline-none focus:border-amber-500" />
    </label>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md bg-slate-50 px-3 py-2">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-950">{value}</span>
    </div>
  );
}

function RecommendationItem({ label, item }: { label: string; item: any }) {
  if (!item?.product) {
    return (
      <div className="rounded-md border border-dashed border-slate-300 p-3 text-sm text-slate-500">
        {label}: no matching product configured
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">{label}</div>
          <div className="mt-1 text-sm text-slate-600">{item.product.model_name}</div>
        </div>
        <div className="text-right text-sm font-semibold">x{item.quantity}</div>
      </div>
      <div className="mt-2 text-sm text-emerald-700">{formatMoney(item.product.cash_price)}</div>
    </div>
  );
}
