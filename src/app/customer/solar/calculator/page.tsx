"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const appliancesList = [
  { name: "TV", watts: 100 },
  { name: "Fan", watts: 70 },
  { name: "Refrigerator", watts: 200 },
  { name: "Freezer", watts: 250 },
  { name: "Laptop", watts: 60 },
  { name: "Air Conditioner", watts: 1200 },
  { name: "Hot Plate", watts: 1200 },
  { name: "Light Bulb", watts: 10 },
  { name: "Phone Charger", watts: 10 },
  { name: "Pumping Machine (0.5HP)", watts: 500, surgeWatts: 1500 },
  { name: "Pumping Machine (1.0HP)", watts: 1100, surgeWatts: 3300 },
  { name: "Pumping Machine (1.5HP)", watts: 1500, surgeWatts: 4500 },
  { name: "Electric Iron", watts: 1200 },
  { name: "Electric Kettle", watts: 2000 },
  { name: "Standing Fan", watts: 50 },
  { name: "Microwave", watts: 1000 },
  { name: "Blender", watts: 500},
  { name: "CCTV System", watts: 50},
  { name: "Wi-Fi Router", watts: 15}
];

export default function SolarCalculator() {
  const [items, setItems] = useState<any[]>([]);
  const [backupHours, setBackupHours] = useState(8);

  function updateItem(name: string, field: string, value: number) {
    const existing = items.find((i) => i.name === name);

    if (existing) {
      setItems(items.map(i =>
        i.name === name ? { ...i, [field]: value } : i
      ));
    } else {
      const base = appliancesList.find(a => a.name === name);
      setItems([
        ...items,
        { name, watts: base?.watts, qty: 1, hours: 1, [field]: value }
      ]);
    }
  }

  // 🔥 CALCULATIONS
  const result = useMemo(() => {
    let totalWatts = 0;
    let totalWh = 0;

    items.forEach(i => {
      totalWatts += i.watts * i.qty;
      totalWh += i.watts * i.qty * i.hours;
    });

    const batteryWh = totalWatts * backupHours;
    const batteryKwh = batteryWh / 1000;

    const solarWatts = (totalWh / 5) * 1.3; // Nigeria sun + losses
    const panels = Math.ceil(solarWatts / 400); // 400W panel

    return {
      totalWatts,
      totalWh,
      batteryKwh,
      solarWatts,
      panels,
    };
  }, [items, backupHours]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:to-gray-900">

      <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
        ⚡ Solar Power Calculator
      </h1>

      {/* APPLIANCES */}
      <div className="grid md:grid-cols-3 gap-4">
        {appliancesList.map((a) => (
          <motion.div
            key={a.name}
            whileHover={{ scale: 1.03 }}
            className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/70 
            backdrop-blur shadow-lg space-y-3"
          >
            <h2 className="font-semibold">{a.name}</h2>
            <p className="text-sm text-gray-500">{a.watts}W</p>

            <input
              type="number"
              placeholder="Quantity"
              className="input-green"
              onChange={(e) =>
                updateItem(a.name, "qty", Number(e.target.value))
              }
            />

            <input
              type="number"
              placeholder="Hours/day"
              className="input-green"
              onChange={(e) =>
                updateItem(a.name, "hours", Number(e.target.value))
              }
            />
          </motion.div>
        ))}
      </div>

      {/* BACKUP TIME */}
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Battery Backup Time</h2>

        <select
          value={backupHours}
          onChange={(e) => setBackupHours(Number(e.target.value))}
          className="input-green"
        >
          <option value={1}>1 Hour</option>
          <option value={2}>2 Hours</option>
          <option value={3}>3 Hours</option>
          <option value={4}>4 Hours</option>
          <option value={5}>5 Hours</option>
          <option value={8}>Overnight (8h)</option>
          <option value={24}>24 Hours</option>
          <option value={48}>2 days</option>
        </select>
      </div>

      {/* RESULT */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-10 p-6 rounded-2xl bg-green-100 dark:bg-green-900/20 shadow-xl space-y-3"
      >
        <h2 className="text-xl font-bold text-green-700">
          ⚡ Your Solar Requirement
        </h2>

        <p>Total Load: <b>{result.totalWatts} W</b></p>
        <p>Daily Energy: <b>{(result.totalWh / 1000).toFixed(2)} kWh</b></p>
        <p>Battery Needed: <b>{result.batteryKwh.toFixed(2)} kWh</b></p>
        <p>Solar Panels: <b>{result.panels} panels (400W each)</b></p>
      </motion.div>

      {/* STYLES */}
      <style jsx>{`
        .input-green {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          outline: none;
        }
      `}</style>
    </div>
  );
}