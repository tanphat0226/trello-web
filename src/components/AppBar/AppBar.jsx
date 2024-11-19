import AppsIcon from '@mui/icons-material/Apps'
import CloseIcon from '@mui/icons-material/Close'
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputAdornment from '@mui/material/InputAdornment'
import SvgIcon from '@mui/material/SvgIcon'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import Profiles from './Menu/Profiles'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import Workspaces from './Menu/Workspaces'
import Notifications from './Notifications/Notifications'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Link to='/boards'>
          <Tooltip title='Board List'>
            <AppsIcon sx={{ color: 'white', verticalAlign: 'middle' }} />
          </Tooltip>
        </Link>

        <Link to='/'>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <SvgIcon component={TrelloIcon} fontSize='small' inheritViewBox sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
              Trello
            </Typography>
          </Box>
        </Link>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: 'white'
            }}
            size='small'
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id='outlined-search'
          label='Search...'
          type='text'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: searchValue ? 'white' : 'transparent ',
                    cursor: 'pointer',
                    display: !!searchValue <= 0 ? 'none' : 'block'
                  }}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
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

        <ModeSelect />

        <Notifications />

        <Tooltip title='Help'>
          <HelpOutlineOutlined sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
