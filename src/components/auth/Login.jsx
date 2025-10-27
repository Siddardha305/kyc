import { useState } from 'react'
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Stack, TextField, Typography } from '@mui/material'
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
      setState({ ...userState, currentUser: userState.userData.email, currentStep: userState.currentStep || 'kyc' })
    } else setErr('Incorrect password')
  }

  return (
    <Card>
      <CardHeader title={<Typography variant="h5" fontWeight={800}>Welcome Back</Typography>} subheader="Log in to continue your application."/>
      <CardContent>
        <Stack spacing={2.5}>
          <TextField label="Email or Phone" value={id} onChange={e=>setId(e.target.value)} fullWidth/>
          <TextField label="Password" type="password" value={pwd} onChange={e=>setPwd(e.target.value)} fullWidth/>
          {err && <Alert severity="error">{err}</Alert>}
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 3 }}>
        <Button fullWidth onClick={handleLogin}>Login</Button>
      </CardActions>
    </Card>
  )
}
