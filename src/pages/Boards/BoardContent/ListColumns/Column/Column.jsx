import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import AddCardIcon from '@mui/icons-material/AddCard'
import CloseIcon from '@mui/icons-material/Close'
import Cloud from '@mui/icons-material/Cloud'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { cloneDeep } from 'lodash'
import { useConfirm } from 'material-ui-confirm'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis'

import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import { selectCurrentActiveBoard, updateCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import ListCards from './ListCards/ListCards'

function Column({ column }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    // touchAction: 'none', // Dành cho sensor default dạng PointerSensor
    // Nếu dùng CSS.Transform sẽ bị lỗi stretch
    // https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    // Height phải luôn max 100% nếu không sẽ lỗi lúc kéo column ngắn qua một column dài thì phải kéo ở khu vực giữa giữa rất khó chịu
    // Lưu ý phải dùng {...listener} ở container chứ không phải div ngoài cùng để tránh trường hợp kéo ở dưới column ngắn
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  // Cards đã được sắp xếp ở component cha cao nhất (board/_id.jsx)
  const orderedCard = column.cards
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  const [newCardTitle, setNewCardTitle] = useState('')

  const addNewCard = async () => {
    if (!newCardTitle) {
      toast.error('Please enter Card Title!', { closeOnClick: true })
      return
    }

    // Create Data to call API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }

    // Call the API to create a new card and then redo the state board.
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Update State Board
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find((column) => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // When a column is empty, it includes a placeholder card.
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        // If the column has data, push the card to the end of the array.
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }

    dispatch(updateCurrentActiveBoard(newBoard))

    // Đóng trạng thái thêm Column mới và Clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  // Handle delete to a Column and it's Cards
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Delete Column?',
      // eslint-disable-next-line quotes
      description: `This action will permanently delete your Column and it's Cards! Are you sure?`,
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      // cancellationButtonProps: { color: 'inherit' }
    })
      .then(() => {
        // Handle delete to a Column and it's Cards
        // Update the state board data standard.
        const newBoard = { ...board }
        newBoard.columns = newBoard.columns.filter((c) => c._id !== column._id)
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter((_id) => _id !== column._id)
        dispatch(updateCurrentActiveBoard(newBoard))

        // Call the API handle in BE.
        deleteColumnDetailsAPI(column._id).then((res) => {
          toast.success(res?.deleteResult)
        })
      })
      .catch(() => {})
  }

  // Handle update column title
  const handleUpdateColumnTitle = async (title) => {
    // Call the API to update the column title.
    updateColumnDetailsAPI(column._id, { title }).then((res) => {
      const newBoard = cloneDeep(board)
      const columnToUpdate = newBoard.columns.find((c) => c._id === column._id)
      if (columnToUpdate) columnToUpdate.title = title
      dispatch(updateCurrentActiveBoard(newBoard))
    })
  }

  return (
    // Bọc div ở đây vì vấn đề height của column khi kéo thả sẽ có bug kiểu kiểu flickering.
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box Column Header*/}
        <Box
          sx={{
            height: (theme) => theme.trello.columnHeaderHeight,
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* <Typography
            variant='h6'
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {column?.title}
          </Typography> */}
          <ToggleFocusInput value={column?.title} onChangedValue={handleUpdateColumnTitle} data-no-dnd='true' />
          <Box>
            <Tooltip title='More options'>
              <ExpandMoreIcon
                sx={{ color: 'text.primay', cursor: 'pointer' }}
                id='basic-column-dropdown'
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id='basic-menu-column-dropdown'
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown'
              }}
            >
              <MenuItem
                onClick={toggleOpenNewCardForm}
                sx={{
                  '&:hover': {
                    color: 'primary.dark',
                    '& .add-card-icon': { color: 'primary.dark' }
                  }
                }}
              >
                <ListItemIcon>
                  <AddCardIcon fontSize='small' className='add-card-icon' />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize='small' />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize='small' />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPasteIcon fontSize='small' />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />
              <MenuItem
                onClick={handleDeleteColumn}
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': { color: 'warning.dark' }
                  }
                }}
              >
                <ListItemIcon>
                  <DeleteForeverIcon fontSize='small' className='delete-forever-icon' />
                </ListItemIcon>
                <ListItemText>Delete this collum </ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize='small' />
                </ListItemIcon>
                <ListItemText>Archive this collum </ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* List Cards */}
        <ListCards cards={orderedCard} />

        {/* Box Column Footer*/}
        <Box
          sx={{
            height: (theme) => theme.trello.columnFooterHeight,
            p: 2
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>
                Add new card
              </Button>
              <Tooltip title='Drag to move'>
                <DragHandleIcon sx={{ cursor: 'ponter' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <TextField
                label='Enter card title...'
                type='text'
                size='small'
                variant='outlined'
                autoFocus
                data-no-dnd='true'
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                  },
                  '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                    '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                  },
                  '& .MuiOutlinedInput-input': { borderRadius: 1 }
                }}
              />
              <Box data-no-dnd='true' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  className='interceptor-loading'
                  onClick={addNewCard}
                  variant='contained'
                  color='success'
                  size='small'
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': { bgcolor: (theme) => theme.palette.success.main }
                  }}
                >
                  Add
                </Button>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer'
                  }}
                  onClick={toggleOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  )
}

export default Column
