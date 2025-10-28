import { useState } from 'react'
import {
  Alert, Avatar, Button, Card, CardActions, CardContent, CardHeader,
  InputAdornment, Paper, Stack, TextField, Typography
} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/PhoneIphone'
import LockIcon from '@mui/icons-material/Lock'
import { isPhone, isEmail } from '../../utils/validation'
import { loadUserProgress, saveCurrentSession, userExists } from '../../utils/storage'

export default function Login({ setState }) {
  const [id, setId] = useState('')
  const [pwd, setPwd] = useState('')
  const [err, setErr] = useState('')

  const handleLogin = () => {
    setErr('')
    if (!isEmail(id) && !isPhone(id)) return setErr('Enter valid email or 10-digit phone')
    if (!pwd) return setErr('Enter password')
    if (!userExists(id)) return setErr('No account found. Please sign up.')

    const userState = loadUserProgress(id)
    if (userState?.userData?.password === pwd) {
      saveCurrentSession(userState.userData.email)
      setState({
        ...userState,
        currentUser: userState.userData.email,
        currentStep: userState.currentStep || 'kyc'
      })
    } else {
      setErr('Incorrect password')
    }
  }

  const idAdornmentIcon = isPhone(id) ? <PhoneIcon/> : <EmailIcon/>

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      {/* Left gradient panel — matches Signup */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          bgcolor: 'primary.main',
          background: 'linear-gradient(135deg, #175ee2 0%, #7d2ae8 100%)',
          color: '#fff',
          flex: { xs: 1, md: 0.9 },
          borderRadius: 3
        }}
      >
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#ffffff22' }}>
            <VerifiedIcon />
          </Avatar>
          <Typography variant="h5" fontWeight={800}>
            Welcome Back!
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Log in to continue your application securely.
          </Typography>
        </Stack>
      </Paper>

      {/* Right card — matches Signup card structure */}
      <Card sx={{ flex: 1 }}>
        <CardHeader
          title={<Typography variant="h5" fontWeight={800}>Welcome Back</Typography>}
          subheader="Log in to continue your application."
        />
        <CardContent>
          <Stack spacing={2.5}>
            <TextField
              label="Email or Phone"
              value={id}
              onChange={(e) => setId(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {idAdornmentIcon}
                  </InputAdornment>
                ),
              }}
              error={!!err && (!isEmail(id) && !isPhone(id))}
              helperText={(!isEmail(id) && !isPhone(id) && err.includes('valid')) ? err : ''}
            />

            <TextField
              label="Password"
              type="password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
              }}
              error={!!err && (err === 'Enter password' || err === 'Incorrect password')}
              helperText={(err === 'Enter password' || err === 'Incorrect password') ? err : ''}
            />

            {/* Generic error (account not found, etc.) */}
            {err && !['Enter password', 'Incorrect password'].includes(err) &&
              !(err.includes('valid')) && (
                <Alert severity="error">{err}</Alert>
              )
            }
          </Stack>
        </CardContent>

        <CardActions sx={{ p: 3 }}>
          <Button fullWidth variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </CardActions>
      </Card>
    </Stack>
  )
}
