import { useSelector } from 'react-redux';

export const useLocaleOrders = () => useSelector(({ localeOrders }) => localeOrders);
export const useUser = () => useSelector(({ user }) => user);
