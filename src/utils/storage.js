export const saveTransactionsToStorage = (transactions) => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

export const getTransactionsFromStorage = () => {
  const transactions = localStorage.getItem("transactions");
  return transactions ? JSON.parse(transactions) : [];
};
