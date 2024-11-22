import PersonAddIcon from '@mui/icons-material/PersonAdd'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Popover from '@mui/material/Popover'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { inviteUserToBoardAPI } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { socketIoInstance } from '~/socketClient'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE, FIELD_REQUIRED_MESSAGE } from '~/utils/validators'

function InviteBoardUser({ boardId }) {
  /**
   * Xử lý Popover để ẩn hoặc hiện một popup nhỏ, tương tự docs để tham khảo ở đây:
   * https://mui.com/material-ui/react-popover/
   */
  const [anchorPopoverElement, setAnchorPopoverElement] = useState(null)
  const isOpenPopover = Boolean(anchorPopoverElement)
  const popoverId = isOpenPopover ? 'invite-board-user-popover' : undefined
  const handleTogglePopover = (event) => {
    if (!anchorPopoverElement) setAnchorPopoverElement(event.currentTarget)
    else setAnchorPopoverElement(null)
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm()
  const submitInviteUserToBoard = (data) => {
    const { inviteeEmail } = data

    // console.log('inviteeEmail:', inviteeEmail)
    inviteUserToBoardAPI({ inviteeEmail, boardId }).then((invitation) => {
      // Clear thẻ input sử dụng react-hook-form bằng setValue
      setValue('inviteeEmail', null)
      setAnchorPopoverElement(null)

      // Realtime update
      socketIoInstance.emit('FE_USER_INVITED_TO_BOARD', invitation)
    })
  }

  return (
    <Box>
      <Tooltip title='Invite user to this board!'>
        <Button
          aria-describedby={popoverId}
          onClick={handleTogglePopover}
          variant='outlined'
          startIcon={<PersonAddIcon />}
          sx={{ color: 'white', borderColor: 'white', '&:hover': { borderColor: 'white' } }}
        >
          Invite
        </Button>
      </Tooltip>

      {/* Khi Click vào butotn Invite ở trên thì sẽ mở popover */}
      <Popover
        id={popoverId}
        open={isOpenPopover}
        anchorEl={anchorPopoverElement}
        onClose={handleTogglePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <form onSubmit={handleSubmit(submitInviteUserToBoard)} style={{ width: '320px' }}>
          <Box sx={{ p: '15px 20px 20px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant='span' sx={{ fontWeight: 'bold', fontSize: '16px' }}>
              Invite User To This Board!
            </Typography>
            <Box>
              <TextField
                autoFocus
                fullWidth
                label='Enter email to invite...'
                type='text'
                variant='outlined'
                {...register('inviteeEmail', {
                  required: FIELD_REQUIRED_MESSAGE,
                  pattern: { value: EMAIL_RULE, message: EMAIL_RULE_MESSAGE }
                })}
                error={!!errors['inviteeEmail']}
              />
              <FieldErrorAlert errors={errors} fieldName={'inviteeEmail'} />
            </Box>

            <Box sx={{ alignSelf: 'flex-end' }}>
              <Button className='interceptor-loading' type='submit' variant='contained' color='info'>
                Invite
              </Button>
            </Box>
          </Box>
        </form>
      </Popover>
    </Box>
  )
}

export default InviteBoardUser
