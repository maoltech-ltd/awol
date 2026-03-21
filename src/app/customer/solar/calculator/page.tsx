// 

"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

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
  { name: "Pumping Machine (0.5HP)", watts: 500 },
  { name: "Pumping Machine (1.0HP)", watts: 1100 },
  { name: "Pumping Machine (1.5HP)", watts: 1500 },
  { name: "Electric Iron", watts: 1200 },
  { name: "Electric Kettle", watts: 2000 },
  { name: "Standing Fan", watts: 50 },
  { name: "Microwave", watts: 1000 },
  { name: "Blender", watts: 500 },
  { name: "CCTV System", watts: 50 },
  { name: "Wi-Fi Router", watts: 15 }
];

export default function SolarCalculator() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedAppliance, setSelectedAppliance] = useState("");
  const [backupHours, setBackupHours] = useState(8);
  const [panelSize, setPanelSize] = useState(450);

  // ADD APPLIANCE
  function addAppliance() {
    if (!selectedAppliance) return;

    const base = appliancesList.find(a => a.name === selectedAppliance);

    if (items.find(i => i.name === selectedAppliance)) return;

    setItems([
      ...items,
      { name: base?.name, watts: base?.watts, qty: 1, hours: 1 }
    ]);

    setSelectedAppliance("");
  }

  // UPDATE
  function updateItem(name: string, field: string, value: number) {
    setItems(items.map(i =>
      i.name === name ? { ...i, [field]: value } : i
    ));
  }

  // REMOVE
  function removeItem(name: string) {
    setItems(items.filter(i => i.name !== name));
  }

  // CALCULATIONS
  const result = useMemo(() => {
    let totalWatts = 0;
    let totalWh = 0;

    items.forEach(i => {
      totalWatts += i.watts * i.qty;
      totalWh += i.watts * i.qty * i.hours;
    });

    const batteryWh = totalWatts * backupHours;
    const batteryKwh = batteryWh / 1000;

    const solarWatts = (totalWh / 5) * 1.3;
    const panels = Math.ceil(solarWatts / panelSize);

    return {
      totalWatts,
      totalWh,
      batteryKwh,
      solarWatts,
      panels,
    };
  }, [items, backupHours, panelSize]);

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-950 dark:to-gray-900">

      <h1 className="text-3xl font-bold mb-6">
        ⚡ Solar Calculator
      </h1>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT SIDE */}
        <div className="space-y-6">

          {/* ADD APPLIANCE */}
          <div className="flex gap-2">
            <select
              value={selectedAppliance}
              onChange={(e) => setSelectedAppliance(e.target.value)}
              className="input-green flex-1"
            >
              <option value="">Select Appliance</option>
              {appliancesList.map(a => (
                <option key={a.name} value={a.name}>
                  {a.name} ({a.watts}W)
                </option>
              ))}
            </select>

            <button
              onClick={addAppliance}
              className="px-4 rounded-xl bg-green-600 text-white"
            >
              Add
            </button>
          </div>

          {/* SELECTED APPLIANCES */}
          <div className="space-y-4">
            {items.map(item => (
              <motion.div
                key={item.name}
                layout
                className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow flex flex-col gap-3"
              >
                <div className="flex justify-between">
                  <h3 className="font-semibold">
                    {item.name} ({item.watts}W)
                  </h3>

                  <button onClick={() => removeItem(item.name)}>
                    <X size={18} />
                  </button>
                </div>

                {/* <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) =>
                      updateItem(item.name, "qty", Number(e.target.value))
                    }
                    className="input-green"
                    placeholder="Qty"
                  />

                  <input
                    type="number"
                    value={item.hours}
                    onChange={(e) =>
                      updateItem(item.name, "hours", Number(e.target.value))
                    }
                    className="input-green"
                    placeholder="Hours"
                  />
                </div> */}
                <div className="grid grid-cols-2 gap-3">

                  {/* QUANTITY */}
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.qty}
                      onChange={(e) =>
                        updateItem(item.name, "qty", Number(e.target.value))
                      }
                      className="input-green"
                      placeholder="e.g 2"
                    />
                  </div>

                  {/* HOURS */}
                  <div className="flex flex-col">
                    <label className="text-xs text-gray-500 mb-1">
                      Hours / day
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={item.hours}
                      onChange={(e) =>
                        updateItem(item.name, "hours", Number(e.target.value))
                      }
                      className="input-green"
                      placeholder="e.g 5"
                    />
                  </div>

                </div>
              </motion.div>
            ))}
          </div>

          {/* SETTINGS */}
          <div className="grid grid-cols-2 gap-4">

            <div>
              <label>Backup Time</label>
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

            <div>
              <label>Panel Size (W)</label>
              <input
                type="number"
                value={panelSize}
                onChange={(e) => setPanelSize(Number(e.target.value))}
                className="input-green"
              />
            </div>

          </div>

        </div>

        {/* RIGHT SIDE (RESULT) */}
        <div className="sticky top-6 h-fit">

          <motion.div
            className="p-6 rounded-2xl bg-green-100 dark:bg-green-900/20 shadow-xl space-y-3"
          >
            <h2 className="text-xl font-bold text-green-700">
              ⚡ Result
            </h2>

            <p>Total Load: <b>{result.totalWatts} W</b></p>
            <p>Daily Energy: <b>{(result.totalWh / 1000).toFixed(2)} kWh</b></p>
            <p>Battery: <b>{result.batteryKwh.toFixed(2)} kWh</b></p>
            <p>
              Panels: <b>{result.panels}</b> ({panelSize}W each)
            </p>
          </motion.div>

        </div>

      </div>

      <style jsx>{`
        .input-green {
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          background: rgba(255,255,255,0.7);
          outline: none;
        }
      `}</style>
    </div>
  );
}