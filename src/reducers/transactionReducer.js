export const initialState = {
  transactions: [],
  loading: false,
  currentBalance: 0,
  income: 0,
  expenses: 0,
};

export const transactionReducer = (state, action) => {
  switch (action.type) {
    case "SET_TRANSACTIONS":
      return {
        ...state,
        transactions: action.payload,
        loading: false,
      };
    case "ADD_TRANSACTION":
      const newTransactions = [...state.transactions, action.payload];
      return {
        ...state,
        transactions: newTransactions,
        ...calculateBalance(newTransactions),
      };
    case "DELETE_TRANSACTION":
      const filteredTransactions = state.transactions.filter(
        (transaction) => transaction.id !== action.payload.id
      );
      return {
        ...state,
        transactions: filteredTransactions,
        ...calculateBalance(filteredTransactions),
      };
    case "EDIT_TRANSACTION": {
      const updatedTransactions = state.transactions.map((transaction) =>
        transaction.id === action.payload.id ? action.payload : transaction
      );
      return {
        ...state,
        transactions: updatedTransactions,
        ...calculateBalance(updatedTransactions),
      };
    }
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export const calculateBalance = (transactions) => {
  let incomeTotal = 0;
  let expensesTotal = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      incomeTotal += transaction.amount;
    } else {
      expensesTotal += transaction.amount;
    }
  });

  return {
    income: incomeTotal,
    expenses: expensesTotal,
    currentBalance: incomeTotal - expensesTotal,
  };
};
