import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import AddToDriveOutlinedIcon from '@mui/icons-material/AddToDriveOutlined'
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined'
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined'
import CancelIcon from '@mui/icons-material/Cancel'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Modal from '@mui/material/Modal'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { updateCardDetailsAPI } from '~/apis'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { updateCardInBoard } from '~/redux/activeBoard/activeBoardSlice'
import {
  clearAndHideCurrentActiveCard,
  selectCurrentActiveCard,
  selectIsShowModalActiveCard,
  updateCurrentActiveCard
} from '~/redux/activeCard/activeCardSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constant'
import { singleFileValidator } from '~/utils/validators'
import CardActivitySection from './CardActivitySection'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardUserGroup from './CardUserGroup'

const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  // const [isOpen, setIsOpen] = useState(true)
  // const handleOpenModal = () => setIsOpen(true)
  const currentUser = useSelector(selectCurrentUser)
  /**
   * Handles the event when the user wants to close the modal.
   * We simply clear the current active card to close the modal.
   */
  const handleCloseModal = () => {
    // setIsOpen(false)
    dispatch(clearAndHideCurrentActiveCard())
  }

  /**
   * Call API to update card details.
   * @param {Object} data The data to be updated.
   * @returns {Promise<Object>} The updated card data.
   *
   * This function will do two things:
   * 1. Update the current active card in the present modal.
   * 2. Update the current active card in the activeBoard data in Redux (nested data).
   */
  const callApiUpdateCard = async (data) => {
    const updatedCard = await updateCardDetailsAPI(activeCard._id, data)

    // Step 1 : Update the activing card in present moal.
    dispatch(updateCurrentActiveCard(updatedCard))
    // Step 2 : Update the activing card in the activeBoard data in Redux (nested data)
    dispatch(updateCardInBoard(updatedCard))

    return updatedCard
  }

  /**
   * @function onUpdateCardTitle
   * @description Call API to update the title of the card in database
   * @param {string} newTitle - The new title of the card
   * @returns {Promise} - The promise of the axios request
   */
  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  /**
   * @function onUpdateCardDescription
   * @description Call API to update the description of the card in database
   * @param {string} newDescription - The new description of the card
   * @returns {Promise} - The promise of the axios request
   */
  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * @function onUploadCardCover
   * @description Call API to update the cover of the card in database
   * @param {Event} event - The event of the file input
   * @returns {Promise} - The promise of the axios request
   *
   * This function will validate the uploaded file first, if the file is invalid, it will toast an error message and return.
   * If the file is valid, it will call the API to update the cover of the card and toast a pending message.
   * After the request is finished, it will reset the value of the file input to empty string.
   */
  /******  18387cfe-097f-4eb0-8b68-cbc448f2d08e  *******/
  const onUploadCardCover = (event) => {
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData).finally(() => (event.target.value = '')),
      {
        pending: 'Updating...'
      }
    )
  }

  /**
   * @function onAddCardComment
   * @description Asynchronously calls the API to update the card with a new comment.
   * @param {Object} commentToAdd - The comment data to be added to the card.
   */
  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }

  const onUpdateCardMembers = (incomingMemberInfo) => {
    // Call API to update the members of the card
    callApiUpdateCard({ incomingMemberInfo })
  }

  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 900,
          maxWidth: 900,
          bgcolor: 'white',
          boxShadow: 24,
          borderRadius: '8px',
          border: 'none',
          outline: 0,
          padding: '40px 20px 20px',
          margin: '50px auto',
          backgroundColor: (theme) => (theme.palette.mode === 'dark' ? '#1A2027' : '#fff')
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '12px',
            right: '10px',
            cursor: 'pointer'
          }}
        >
          <CancelIcon color='error' sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>

        {activeCard?.cover && (
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt={`Cover of card ${activeCard?.title}`}
            />
          </Box>
        )}

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput inputFontSize='22px' value={activeCard?.title} onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>
            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Members</Typography>

              {/* Feature 02: Xử lý các thành viên của Card */}
              <CardUserGroup cardMemberIds={activeCard?.memberIds} onUpdateCardMembers={onUpdateCardMembers} />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Description
                </Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                cardDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant='span' sx={{ fontWeight: '600', fontSize: '20px' }}>
                  Activity
                </Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection cardComments={activeCard?.comments} onAddCardComment={onAddCardComment} />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction='column' spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {!activeCard?.memberIds?.includes(currentUser?._id) && (
                <SidebarItem
                  className='active'
                  onClick={() => onUpdateCardMembers({ userId: currentUser._id, action: CARD_MEMBER_ACTIONS.ADD })}
                >
                  <PersonOutlineOutlinedIcon fontSize='small' />
                  Join
                </SidebarItem>
              )}

              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className='active' component='label'>
                <ImageOutlinedIcon fontSize='small' />
                Cover
                <VisuallyHiddenInput type='file' onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem>
                <AttachFileOutlinedIcon fontSize='small' />
                Attachment
              </SidebarItem>
              <SidebarItem>
                <LocalOfferOutlinedIcon fontSize='small' />
                Labels
              </SidebarItem>
              <SidebarItem>
                <TaskAltOutlinedIcon fontSize='small' />
                Checklist
              </SidebarItem>
              <SidebarItem>
                <WatchLaterOutlinedIcon fontSize='small' />
                Dates
              </SidebarItem>
              <SidebarItem>
                <AutoFixHighOutlinedIcon fontSize='small' />
                Custom Fields
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Power-Ups</Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem>
                <AspectRatioOutlinedIcon fontSize='small' />
                Card Size
              </SidebarItem>
              <SidebarItem>
                <AddToDriveOutlinedIcon fontSize='small' />
                Google Drive
              </SidebarItem>
              <SidebarItem>
                <AddOutlinedIcon fontSize='small' />
                Add Power-Ups
              </SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction='column' spacing={1}>
              <SidebarItem>
                <ArrowForwardOutlinedIcon fontSize='small' />
                Move
              </SidebarItem>
              <SidebarItem>
                <ContentCopyOutlinedIcon fontSize='small' />
                Copy
              </SidebarItem>
              <SidebarItem>
                <AutoAwesomeOutlinedIcon fontSize='small' />
                Make Template
              </SidebarItem>
              <SidebarItem>
                <ArchiveOutlinedIcon fontSize='small' />
                Archive
              </SidebarItem>
              <SidebarItem>
                <ShareOutlinedIcon fontSize='small' />
                Share
              </SidebarItem>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  )
}

export default ActiveCard
