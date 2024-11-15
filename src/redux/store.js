import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

import persistReducer from 'redux-persist/es/persistReducer'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { activeCardReducer } from './activeCard/activeCardSlice'

/**
 * Config redux-persist
 * https://www.npmjs.com/package/redux-persist
 * Tutorial Blog
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */

// Config redux-persist
const rootPersistConfig = {
  key: 'root', // key for storage
  storage, // save storage to localStorage
  whitelist: ['user'] // Define data slice ALLOW to persist every time to refresh website
  // blacklist: ['activeBoard'] // Define data slice NOT ALLOW to persist every time to refresh website
}

// Combine all reducers
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer,
  activeCard: activeCardReducer
})

// Implement redux-persist
const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  // Fix warning error when implement redux-persist
  // https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
