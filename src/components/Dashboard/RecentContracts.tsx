export default function RecentContracts() {
  const contracts = [
    { id: "CTR001", customer: "John Doe", balance: "NGN 120,000", status: "Active" },
    { id: "CTR002", customer: "Mary Jane", balance: "NGN 80,000", status: "Overdue" },
    { id: "CTR003", customer: "Ahmed Ali", balance: "NGN 0", status: "Completed" },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <h3 className="mb-4 font-semibold text-slate-950 dark:text-white">Recent Contracts</h3>
      <div className="space-y-3">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex items-center justify-between border-b border-slate-200 pb-2 last:border-b-0 dark:border-slate-800"
          >
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">{contract.customer}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{contract.id}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-800 dark:text-slate-200">{contract.balance}</p>
              <p
                className={`text-sm ${
                  contract.status === "Overdue"
                    ? "text-red-600 dark:text-red-300"
                    : contract.status === "Completed"
                    ? "text-emerald-600 dark:text-emerald-300"
                    : "text-blue-600 dark:text-blue-300"
                }`}
              >
                {contract.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
