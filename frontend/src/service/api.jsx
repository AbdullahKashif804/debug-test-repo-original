// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    const error = new Error(data.message || "API request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  
  return data;
};

// Helper function to handle API errors
const handleError = (error, context) => {
  console.error(`[${context}] Error:`, error);
  
  if (error.message) {
    throw error;
  }
  
  throw new Error(`Failed to ${context}`);
};

export const getTransactions = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);
    const result = await handleResponse(response);
    // Handle both old and new response format
    return result.data || result;
  } catch (err) {
    handleError(err, "fetch transactions");
  }
};


export const addTransaction = async (data) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return await handleResponse(response);
  } catch (err) {
    handleError(err, "add transaction");
  }
};

export const deleteTransaction = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: "DELETE"
    });
    return await handleResponse(response);
  } catch (err) {
    handleError(err, "delete transaction");
  }
};

export const getSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/summary`);
    return await handleResponse(response);
  } catch (err) {
    handleError(err, "fetch summary");
  }
};