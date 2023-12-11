import { useState } from 'react'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAdd from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'


function ListColumns({ columns, createNewColumn, createNewCard, deleteColumnDetails }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleOpenNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)

  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = () => {
    if (!newColumnTitle) {
      toast.error('Please enter Column Title!')
      return
    }

    // Create Data to call API
    const newColumnData = {
      title: newColumnTitle
    }
    // Gọi API ở đây...
    createNewColumn(newColumnData)

    // Đóng trạng thái thêm Column mới và Clear input
    toggleOpenNewColumnForm()
    setNewColumnTitle('')
  }

  return (
    /**
     * SortableContext yêu cầu items là dạng mảng ['id-1', 'id-2','id-3'] chứ không phải là object [{id: 'id-1'}, {id: 'id-2'}]
     * Nếu không đúng data type vẫn kéo thả được nhưng không có animation
     * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
     * */
    <SortableContext items={columns?.map((c) => c._id)} strategy={horizontalListSortingStrategy}>
      <Box
        sx={{
          bgcolor: 'inherit',
          width: '100%',
          height: '100%',
          display: 'flex',
          overflowY: 'hidden',
          overflowX: 'auto',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {columns?.map((column) => <Column
          key={column._id} column={column}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
        /> )}

        {/* Box add new Column CTA */}
        {!openNewColumnForm
          ? <Box
            onClick={toggleOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              bgcolor: '#ffffff3d',
              mx: 2,
              borderRadius: '6px',
              height: 'fit-content'
            }}
          >
            <Button
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
              startIcon={<NoteAdd />}
            >
              Add new Column
            </Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            bgcolor: '#ffffff3d',
            mx: 2,
            p:2,
            borderRadius: '6px',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label='Enter column title...'
              type='text'
              size='small'
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& input': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&:hover fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' }
                }
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                onClick={addNewColumn}
                variant='contained'
                color='success'
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover' : { bgcolor: (theme) => theme.palette.success.main }
                }}
              >
                Add Column
              </Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                  '&:hover' : { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleOpenNewColumnForm}
              />
            </Box>
          </Box>
        }

      </Box>
    </SortableContext>
  )
}

export default ListColumns
