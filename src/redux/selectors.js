import { useSelector } from 'react-redux';

export const useLocaleOrders = () => useSelector(({ localeOrders }) => localeOrders);
