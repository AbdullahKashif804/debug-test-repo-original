import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || "http://localhost:4000"}/api`,
});

export const getTransactions = async () => {
    try {
        const { data } = await api.get("/transactions");
        return data.data || data; // supports paginated { data } or raw array
    } catch (err) {
        console.error("Error fetching transactions:", err);
        return []; // safe fallback
    }
};

export const addTransaction = async (txData) => {
    try {
        const { data } = await api.post("/transactions", txData);
        return data;
    } catch (err) {
        const message =
            err.response?.data?.error || err.message || "Failed to add transaction";
        console.error("Error adding transaction:", message);
        throw new Error(message);
    }
};

export const deleteTransaction = async (id) => {
    try {
        const { data } = await api.delete(`/transactions/${id}`);
        return data;
    } catch (err) {
        const message =
            err.response?.data?.error ||
            err.message ||
            "Failed to delete transaction";
        console.error("Error deleting transaction:", message);
        throw new Error(message);
    }
};

export const getTransactionSummary = async () => {
    try {
        const { data } = await api.get("/transactions/summary");
        return data;
    } catch (err) {
        console.error("Error fetching summary:", err);
        return { total: 0 };
    }
};

export default api;
