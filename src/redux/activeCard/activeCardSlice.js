import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}

export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
    },

    updateCurrentActiveCard: (state, action) => {
      state.currentActiveCard = action.payload
    }
  }
})

export const { updateCurrentActiveCard, clearAndHideCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions

export const selectCurrentActiveCard = (state) => state.activeCard.currentActiveCard
export const selectIsShowModalActiveCard = (state) => state.activeCard.isShowModalActiveCard

export const activeCardReducer = activeCardSlice.reducer
