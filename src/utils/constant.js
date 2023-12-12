let apiRoot = ''

if (process.env === 'dev') {
  apiRoot = 'http://localhost:8018'
}

if (process.env === 'production') {
  apiRoot = 'https://trello-api-2d4q.onrender.com'
}

export const API_ROOT = apiRoot
