export default value => {
  const regex = /^[0-9]+\.?[0-9]{0,2}/;
  const result = regex.exec(value);

  return result !== null ? result[0] : '';
};
