export function dummyMethod() {
  return null;
}

export function getJwtOptions() {
  return {
    JWT_OPTIONS: {
      MEMBER_AUDIENCE: ['SHOW_FAVORITE', 'LOGIN', 'SHOW_BOOKS'],
      ADMIN_AUDIENCE: ['SHOW_FAVORITE', 'LOGIN', 'SHOW_BOOKS', 'ADD_BOOK', 'SHOW_USERS']
    }
  };
}
