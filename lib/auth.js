import Cookies from 'js-cookie';

export const setToken = ({id, username, jwt}) => {
  if (typeof window === 'undefined') {
    return;
  }
  Cookies.set('id', id, { expires: 7 });
  Cookies.set('username', username, { expires: 7 });
  Cookies.set('jwt', jwt, { expires: 7 });
};

export const getTokenFromLocalCookie = () => {
  return Cookies.get('jwt');
};

export const getIdFromLocalCookie = () => {
  return Cookies.get('id');
};

export const unsetToken = () => {
  if (typeof window === 'undefined') {
    return;
  }
  
  Cookies.remove('id');
  Cookies.remove('jwt');
  Cookies.remove('username');
  };
