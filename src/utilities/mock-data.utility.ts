export function getEpisodes() {
  return [
    {
      id: 1,
      title: 'The One Where Ross Finds Out',
      season: 2,
      episode: 7
    },
    {
      id: 2,
      title: 'The One With All the Resolutions',
      episode: 11,
      season: 5
    },
    {
      id: 3,
      title: 'The One With The Cop',
      season: 5,
      episode: 16
    }
  ];
}

export function getBooks() {
  return [
    { id: 1, name: 'The Lord of the Rings' },
    { id: 2, name: 'The Hobbit' }
  ];
}

export function getUsers() {
  return [
    {
      id: 'f2775f38-92fc-42e5-98a5-b137a0887a40',
      username: 'himgoel',
      key: '$2b$10$ph9/OK1lN/.9KzkeGKGPK.bxOkqJ2b9A2AqH/5iPkS7dmqAnUn.vi',
      firstName: 'Himanshu',
      lastName: 'Goel',
      favorite: ['6cc12b5e-cb5e-11ea-87d0-0242ac130003', '765384e6-cb5e-11ea-87d0-0242ac130003'],
      role: 'member'
    },
    {
      id: '677c96e2-cb5e-11ea-87d0-0242ac130003',
      username: 'sapgupta',
      key: '$2b$10$ruGV.xw6P0zuPUa0vt694eLO5LwckcxFZ1NfzdzDQKF12E2240vZy',
      firstName: 'Sapna',
      lastName: 'Gupta',
      favorite: ['722f584a-cb5e-11ea-87d0-0242ac130003'],
      role: 'admin'
    }
  ];
}

export function getJwtOptions() {
  return {
    JWT_OPTIONS: {
      MEMBER_AUDIENCE: ['SHOW_FAVORITE', 'LOGIN', 'SHOW_BOOKS'],
      ADMIN_AUDIENCE: ['SHOW_FAVORITE', 'LOGIN', 'SHOW_BOOKS', 'ADD_BOOK', 'SHOW_USERS']
    }
  };
}
