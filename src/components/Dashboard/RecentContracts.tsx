export default function RecentContracts() {
  const contracts = [
    { id: "CTR001", customer: "John Doe", balance: "₦120,000", status: "Active" },
    { id: "CTR002", customer: "Mary Jane", balance: "₦80,000", status: "Overdue" },
    { id: "CTR003", customer: "Ahmed Ali", balance: "₦0", status: "Completed" },
  ];

  return (
    <div className="p-6 rounded-2xl border bg-white dark:bg-gray-900 dark:border-gray-800">
      <h3 className="font-semibold mb-4">Recent Contracts</h3>
      <div className="space-y-3">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex justify-between items-center border-b pb-2 dark:border-gray-800"
          >
            <div>
              <p className="font-medium">{contract.customer}</p>
              <p className="text-sm text-gray-500">{contract.id}</p>
            </div>
            <div className="text-right">
              <p>{contract.balance}</p>
              <p
                className={`text-sm ${
                  contract.status === "Overdue"
                    ? "text-red-500"
                    : contract.status === "Completed"
                    ? "text-green-500"
                    : "text-blue-500"
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