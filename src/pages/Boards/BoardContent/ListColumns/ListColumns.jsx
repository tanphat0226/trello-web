import Box from '@mui/material/Box'
import Column from './Column/Column'
import Button from '@mui/material/Button'
import NoteAdd from '@mui/icons-material/NoteAdd'

function ListColumns({ columns }) {
  return (
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
      {/* Box Column */}
      {columns?.map((column) => (
        <Column key={column._id} column={column} />
      ))}

      {/* Bõ add new Column CTA */}
      <Box
        sx={{
          minWidth: '200px',
          maxWidth: '200px',
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
    </Box>
  )
}

export default ListColumns
