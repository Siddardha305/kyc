import { useState } from 'react'
import {
  Alert, Avatar, Button, Card, CardActions, CardContent, CardHeader, InputAdornment,
  Paper, Stack, TextField, Typography
} from '@mui/material'
import VerifiedIcon from '@mui/icons-material/Verified'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/PhoneIphone'
import LockIcon from '@mui/icons-material/Lock'
import { userExists, saveCurrentSession, saveUserProgress } from '../../utils/storage'
import { isEmail, isPhone } from '../../utils/validation'
import { getInitialState } from '../../rootState.js'

export default function Signup({ state, persist, setState }) {
  const [form, setForm] = useState({ name: '', email: '', mobile: '', password: '', confirm: '' })
  const [sending, setSending] = useState({ email: false, mobile: false })
  const [otp, setOtp] = useState({ email: '', mobile: '' })
  const [errors, setErrors] = useState({})

  const sendEmailOtp = () => { setSending(p=>({ ...p, email:true })); setTimeout(()=>setSending(p=>({ ...p, email:false })), 600) }
  const sendMobileOtp = () => { setSending(p=>({ ...p, mobile:true })); setTimeout(()=>setSending(p=>({ ...p, mobile:false })), 600) }

  const verifyEmailOtp = () => {
    if (otp.email === '123456') persist(s => ({ ...s, emailVerified: true }))
    else setErrors(e => ({ ...e, emailOtp: 'Invalid OTP' }))
  }
  const verifyMobileOtp = () => {
    if (otp.mobile === '654321') persist(s => ({ ...s, mobileVerified: true }))
    else setErrors(e => ({ ...e, mobileOtp: 'Invalid OTP' }))
  }

  const canContinue = state.emailVerified && state.mobileVerified

  const handleContinue = () => {
    const errs = {}
    if (!form.name) errs.name = 'Name required'
    if (!isEmail(form.email)) errs.email = 'Valid email required'
    if (!isPhone(form.mobile)) errs.mobile = 'Valid 10-digit mobile required'
    if (form.password.length < 8) errs.password = 'Min 8 chars'
    if (form.password !== form.confirm) errs.confirm = 'Passwords do not match'
    if (userExists(form.email)) errs.email = 'Account exists. Please login.'
    if (userExists(form.mobile)) errs.mobile = 'Phone exists. Please login.'
    setErrors(errs)
    if (Object.keys(errs).length) return

    const fresh = getInitialState()
    const merged = {
      ...fresh,
      userData: { ...fresh.userData, name: form.name, email: form.email, mobile: form.mobile, password: form.password },
      currentUser: form.email,
      currentStep: 'kyc',
    }
    saveCurrentSession(form.email)
    saveUserProgress(form.email, merged)
    saveUserProgress(form.mobile, merged)
    setState(merged)
  }

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
      <Paper elevation={0} sx={{ p: 4, bgcolor: 'primary.main', background: 'linear-gradient(135deg, #175ee2 0%, #7d2ae8 100%)', color: '#fff', flex: { xs: 1, md: 0.9 }, borderRadius: 3 }}>
        <Stack alignItems="center" spacing={2} textAlign="center">
          <Avatar sx={{ width: 64, height: 64, bgcolor: '#ffffff22' }}><VerifiedIcon/></Avatar>
          <Typography variant="h5" fontWeight={800}>Secure & Seamless Digital Onboarding</Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>Join us today or log in to continue your application.</Typography>
        </Stack>
      </Paper>

      <Card sx={{ flex: 1 }}>
        <CardHeader title={<Typography variant="h5" fontWeight={800}>Let's Get Started</Typography>} subheader="Create your account to begin the verification process."/>
        <CardContent>
          <Stack spacing={2.5}>
            <TextField label="Full Name" value={form.name} error={!!errors.name} helperText={errors.name} onChange={e=>setForm({...form, name:e.target.value})} fullWidth/>

            <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
              <TextField label="Email" value={form.email} error={!!errors.email} helperText={errors.email} onChange={e=>setForm({...form, email:e.target.value})} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon/></InputAdornment> }}/>
              <Button onClick={sendEmailOtp} disabled={!isEmail(form.email) || state.emailVerified} color={state.emailVerified?'success':'primary'} variant={state.emailVerified?'contained':'outlined'} sx={{ minWidth: 140 }}>{sending.email?'Sending…': state.emailVerified?'Verified ✓':'Send OTP'}</Button>
            </Stack>
            {!state.emailVerified && (
              <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
                <TextField label="Enter Email OTP (123456)" value={otp.email} onChange={e=>setOtp({...otp, email:e.target.value})} error={!!errors.emailOtp} helperText={errors.emailOtp} fullWidth/>
                <Button onClick={verifyEmailOtp} disabled={!otp.email}>Verify</Button>
              </Stack>
            )}

            <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
              <TextField label="Mobile" value={form.mobile} error={!!errors.mobile} helperText={errors.mobile} onChange={e=>setForm({...form, mobile:e.target.value.replace(/[^0-9]/g,'').slice(0,10)})} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon/></InputAdornment> }}/>
              <Button onClick={sendMobileOtp} disabled={!isPhone(form.mobile) || state.mobileVerified} color={state.mobileVerified?'success':'primary'} variant={state.mobileVerified?'contained':'outlined'} sx={{ minWidth: 140 }}>{sending.mobile?'Sending…': state.mobileVerified?'Verified ✓':'Send OTP'}</Button>
            </Stack>
            {!state.mobileVerified && (
              <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
                <TextField label="Enter Mobile OTP (654321)" value={otp.mobile} onChange={e=>setOtp({...otp, mobile:e.target.value})} error={!!errors.mobileOtp} helperText={errors.mobileOtp} fullWidth/>
                <Button onClick={verifyMobileOtp} disabled={!otp.mobile}>Verify</Button>
              </Stack>
            )}

            <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
              <TextField type="password" label="Password" value={form.password} error={!!errors.password} helperText={errors.password} onChange={e=>setForm({...form, password:e.target.value})} fullWidth InputProps={{ startAdornment: <InputAdornment position="start"><LockIcon/></InputAdornment> }}/>
              <TextField type="password" label="Confirm Password" value={form.confirm} error={!!errors.confirm} helperText={errors.confirm} onChange={e=>setForm({...form, confirm:e.target.value})} fullWidth/>
            </Stack>

            <Alert severity={canContinue?'success':'info'}>{canContinue?'Email & Mobile verified. You can continue.':'Verify both Email and Mobile to continue.'}</Alert>
          </Stack>
        </CardContent>
        <CardActions sx={{ p: 3 }}>
          <Button fullWidth disabled={!canContinue} onClick={handleContinue}>Continue</Button>
        </CardActions>
      </Card>
    </Stack>
  )
}
