export default (config = {}) => {
  const browserLocale = navigator.language;

  return Intl.NumberFormat(browserLocale, { style: 'currency', ...config })
    .format;
};
