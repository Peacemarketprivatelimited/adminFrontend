import React, { useEffect, useState } from "react";
import {
  getAllWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../../api/withdrawlApi";

interface WithdrawalResponse {
  success: boolean;
  withdrawals: any[];
  [key: string]: any;
}

const WithDrawls: React.FC = () => {
  const [withdrawalData, setWithdrawalData] = useState<WithdrawalResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [adminNote, setAdminNote] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchWithdrawals = async () => {
      setLoading(true);
      try {
        const data = await getAllWithdrawals();
        console.log('Received data:', data);
        
        // Check if the response has the expected structure
        if (data && typeof data === 'object' && Array.isArray(data.withdrawals)) {
          setWithdrawalData(data);
          setError("");
        } else {
          console.error('Unexpected API response format:', data);
          setWithdrawalData(null);
          setError("Invalid response format from server");
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || "Failed to fetch withdrawals");
        setWithdrawalData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWithdrawals();
  }, []);

  const handleApprove = async (userId: string, requestedAt: string) => {
    setActionLoading(userId + requestedAt);
    try {
      await approveWithdrawal(userId, requestedAt, adminNote[userId + requestedAt]);
      
      // Update local state
      if (withdrawalData && withdrawalData.withdrawals) {
        const updatedWithdrawals = withdrawalData.withdrawals.map((w) =>
          w.userId === userId && w.requestedAt === requestedAt
            ? { ...w, status: "approved" }
            : w
        );
        
        setWithdrawalData({
          ...withdrawalData,
          withdrawals: updatedWithdrawals
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to approve withdrawal");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string, requestedAt: string) => {
    setActionLoading(userId + requestedAt);
    try {
      await rejectWithdrawal(userId, requestedAt, adminNote[userId + requestedAt]);
      
      // Update local state
      if (withdrawalData && withdrawalData.withdrawals) {
        const updatedWithdrawals = withdrawalData.withdrawals.map((w) =>
          w.userId === userId && w.requestedAt === requestedAt
            ? { ...w, status: "rejected" }
            : w
        );
        
        setWithdrawalData({
          ...withdrawalData,
          withdrawals: updatedWithdrawals
        });
      }
    } catch (err: any) {
      alert(err.message || "Failed to reject withdrawal");
    } finally {
      setActionLoading(null);
    }
  };

  // Extract withdrawals array from the response
  const withdrawals = withdrawalData?.withdrawals || [];

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-blue-400">Withdrawals</h2>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-400">{error}</div>
      ) : withdrawals.length === 0 ? (
        <div>No withdrawals found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded shadow">
            <thead>
              <tr className="bg-gray-900">
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Amount</th>
                <th className="px-4 py-2">Requested At</th>
                <th className="px-4 py-2">Bank Account</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Admin Note</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => {
                if (!w) return null; // Skip if withdrawal item is undefined
                
                return (
                <tr key={(w.userId || 'unknown') + (w.requestedAt || Date.now())} className="border-t border-gray-700">
                  <td className="px-4 py-2">{w.name || 'Unknown'} ({w.username || 'N/A'})</td>
                  <td className="px-4 py-2">{w.email || 'N/A'}</td>
                  <td className="px-4 py-2">PKR {w.amountPaid || 0}</td>
                  <td className="px-4 py-2">{w.requestedAt ? new Date(w.requestedAt).toLocaleString() : 'N/A'}</td>
                  <td className="px-4 py-2">{w.bankAccount || "-"}</td>
                  <td className="px-4 py-2">
                    <span
                      className={
                        w.status === "pending"
                          ? "text-yellow-400"
                          : w.status === "approved"
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {w.status || 'unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      className="px-2 py-1 rounded bg-gray-700 text-gray-100 w-32"
                      placeholder="Admin note"
                      value={adminNote[(w.userId || '') + (w.requestedAt || '')] || ""}
                      onChange={(e) =>
                        setAdminNote((prev) => ({
                          ...prev,
                          [(w.userId || '') + (w.requestedAt || '')]: e.target.value,
                        }))
                      }
                      disabled={w.status !== "pending"}
                    />
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    {w.status === "pending" && w.userId && w.requestedAt && (
                      <>
                        <button
                          className="px-3 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-semibold"
                          onClick={() => handleApprove(w.userId, w.requestedAt)}
                          disabled={actionLoading === w.userId + w.requestedAt}
                        >
                          {actionLoading === w.userId + w.requestedAt ? "Approving..." : "Approve"}
                        </button>
                        <button
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                          onClick={() => handleReject(w.userId, w.requestedAt)}
                          disabled={actionLoading === w.userId + w.requestedAt}
                        >
                          {actionLoading === w.userId + w.requestedAt ? "Rejecting..." : "Reject"}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default WithDrawls;