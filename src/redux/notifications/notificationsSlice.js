import authorizeAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constant'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  currentNotifications: null
}

export const fetchInvitationsAPI = createAsyncThunk('notifications/fetchInvitationsAPI', async () => {
  const response = await authorizeAxiosInstance.get(`${API_ROOT}/v1/invitations`)
  return response.data
})

export const updateBoardInvitationAPI = createAsyncThunk(
  'notifications/updateBoardInvitationAPI',
  async ({ status, invitationId }) => {
    const response = await authorizeAxiosInstance.put(`${API_ROOT}/v1/invitations/board/${invitationId}`, { status })
    return response.data
  }
)

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    clearCurrentNotifications: (state) => {
      state.currentNotifications = null
    },
    updateCurrentNotifications: (state, action) => {
      state.currentNotifications, action.payload
    },
    addNotification: (state, action) => {
      state.currentNotifications.unshift(action.payload)
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvitationsAPI.fulfilled, (state, action) => {
      let incomingNotifications = action.payload

      state.currentNotifications = Array.isArray(incomingNotifications) ? incomingNotifications.reverse() : []
    })
    builder.addCase(updateBoardInvitationAPI.fulfilled, (state, action) => {
      let incomingNotifications = action.payload

      const getInvitation = state.currentNotifications.find((n) => n._id === incomingNotifications._id)

      getInvitation.boardInvitation = incomingNotifications.boardInvitation
    })
  }
})

export const { clearCurrentNotifications, updateCurrentNotifications, addNotification } = notificationsSlice.actions

export const selectCurrentNotifications = (state) => state.notifications.currentNotifications

export const notificationsReducer = notificationsSlice.reducer
