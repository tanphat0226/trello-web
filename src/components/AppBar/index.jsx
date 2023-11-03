import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNone from '@mui/icons-material/NotificationsNone'
import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined'
import ModeSelect from '~/components/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import AddIcon from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import SvgIcon from '@mui/material/SvgIcon'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import Tooltip from '@mui/material/Tooltip'

import Workspaces from './Menu/Workspaces'
import Recent from './Menu/Recent'
import Starred from './Menu/Starred'
import Templates from './Menu/Templates'
import Profiles from './Menu/Profiles'

function AppBar() {
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'primary.main' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon component={TrelloIcon} inheritViewBox sx={{ color: 'primary.main' }} />
          <Typography variant='span' sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>
            Trello
          </Typography>
        </Box>

        <Workspaces />
        <Recent />
        <Starred />
        <Templates />

        <Button variant='outlined' size='small'>
          <AddIcon fontSize='small' />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField id='outlined-search' label='Search...' type='search' size='small' />
        <ModeSelect />
        <Tooltip title='Notification'>
          <Badge color='secondary' variant='dot' sx={{ cursor: 'pointer' }}>
            <NotificationsNone />
          </Badge>
        </Tooltip>
        <Tooltip title='Help'>
          <HelpOutlineOutlined sx={{ cursor: 'pointer' }} />
        </Tooltip>
        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
