import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar() {
  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.boardBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        paddingX: 2,
        overflowX: 'auto',
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        '&::-webkit-scrollbar-track': { m: 2 }
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip sx={MENU_STYLES} icon={<DashboardIcon />} label='Ryan Pham Board' clickable />
        <Chip sx={MENU_STYLES} icon={<VpnLockIcon />} label='Public/Private Workspace' clickable />
        <Chip sx={MENU_STYLES} icon={<AddToDriveIcon />} label='Add to Google Drive' clickable />
        <Chip sx={MENU_STYLES} icon={<BoltIcon />} label='Automation' clickable />
        <Chip sx={MENU_STYLES} icon={<FilterListIcon />} label='Filters' clickable />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant='outlined'
          size='small'
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >
          Inivte
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: '32px',
              height: '32px',
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0de' }
            }
          }}
        >
          <Tooltip title='Ryan Pham'>
            <Avatar
              alt='Ryan Pham'
              src='https://yt3.ggpht.com/0u6kh3TZfHsbADQ7E9VbZyUJ0yb5_OMRCrjvcSaUJlLuB3dJpMWiC1Kjkyct9OmqPRt2cDQxEw=s88-c-k-c0x00ffffff-no-rj'
            />
          </Tooltip>
          <Tooltip title='Ryan Pham'>
            <Avatar alt='Ryan Pham' src='https://source.unsplash.com/random' />
          </Tooltip>
          <Tooltip title='Ryan Pham'>
            <Avatar alt='Ryan Pham' src='https://source.unsplash.com/random' />
          </Tooltip>
          <Tooltip title='Ryan Pham'>
            <Avatar alt='Ryan Pham' src='https://source.unsplash.com/random' />
          </Tooltip>
          <Tooltip title='Ryan Pham'>
            <Avatar alt='Ryan Pham' src='https://source.unsplash.com/random' />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardBar
