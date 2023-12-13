let apiRoot = ''

if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:8018'
}

if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-2d4q.onrender.com'
}

export const API_ROOT = apiRoot
