export default (amount, currency) =>
  Intl.NumberFormat('en-IN', { style: 'currency', currency }).format(amount);
