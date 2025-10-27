import { Avatar, Box, Button, Stack, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'

export default function ActiveHeader({ state, onLogout }) {
  const female = "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=80&auto=format"
  const male = "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=80&auto=format"
  const src = state.userData?.kyc?.gender === 'female' ? female : male

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2} sx={{ mb: 3 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Avatar src={src} sx={{ width: 56, height: 56 }} />
        <Box>
          <Typography variant="subtitle1" fontWeight={800}>Hello, {state.userData?.name || 'Guest'}!</Typography>
          <Typography variant="body2" color="text.secondary">Let's continue where you left off.</Typography>
        </Box>
      </Stack>
      <Button startIcon={<LogoutIcon/>} color="inherit" variant="outlined" onClick={onLogout}>Log Out</Button>
    </Stack>
  )
}
