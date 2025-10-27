import { useState } from 'react'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import {
  Box, Button, FormControl, FormControlLabel, FormHelperText, Grid, Radio, RadioGroup,
  Stack, TextField, Typography, InputAdornment
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import CalendarIcon from '@mui/icons-material/CalendarMonth'
import { isAadhaar, isPan } from '../../utils/validation'

export default function KycPersonal({ state, persist }) {
  const kyc = state.userData.kyc || {}
  const [errors, setErrors] = useState({})
  const [localDob, setLocalDob] = useState(kyc.dob ? new Date(kyc.dob) : null)

  const setK = (key, val) => persist(s => ({ ...s, userData: { ...s.userData, kyc: { ...s.userData.kyc, [key]: val } } }))

  const validate = () => {
    const e = {}
    if (!kyc.name) e.name = 'Name as per PAN is required'
    if (!kyc.fatherName) e.fatherName = "Father's name required"
    if (!kyc.dob) e.dob = 'DOB required'
    if (!isPan(kyc.pan)) e.pan = 'Invalid PAN (e.g., ABCDE1234F)'
    if (!isAadhaar(kyc.aadhar)) e.aadhar = 'Aadhaar must be 12 digits'
    if (!kyc.gender) e.gender = 'Select gender'
    if (!kyc.maritalStatus) e.maritalStatus = 'Select marital status'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    persist(s => ({ ...s, kycSubStepStatus: { ...s.kycSubStepStatus, 1: true }, kycSubStep: 2 }))
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField label="Name as per PAN" value={kyc.name || state.userData.name || ''} error={!!errors.name} helperText={errors.name}
            onChange={e=>{ setK('name', e.target.value); persist(s=>({ ...s, userData: { ...s.userData, name: e.target.value } })) }} fullWidth/>
        </Grid>
        <Grid item xs={12}>
          <TextField label="Father's Name" value={kyc.fatherName || ''} error={!!errors.fatherName} helperText={errors.fatherName} onChange={e=>setK('fatherName', e.target.value)} fullWidth/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker label="Date of Birth" value={localDob}
              onChange={(val)=>{ setLocalDob(val); setK('dob', val ? val.toISOString().split('T')[0] : '') }}
              slotProps={{ textField: { fullWidth: true, error: !!errors.dob, helperText: errors.dob, InputProps: { startAdornment: <InputAdornment position="start"><CalendarIcon/></InputAdornment> } } }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="PAN" value={kyc.pan || ''} onChange={e=>setK('pan', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,10))} error={!!errors.pan} helperText={errors.pan} fullWidth/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField label="Aadhaar" value={kyc.aadhar || ''} onChange={e=>setK('aadhar', e.target.value.replace(/[^0-9]/g,'').slice(0,12))} error={!!errors.aadhar} helperText={errors.aadhar} fullWidth/>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={!!errors.gender} fullWidth>
            <Typography variant="caption" sx={{ mb: 0.5 }}>Gender</Typography>
            <RadioGroup row value={kyc.gender || ''} onChange={e=>setK('gender', e.target.value)}>
              {['male','female','other'].map(g => <FormControlLabel key={g} value={g} control={<Radio/>} label={g[0].toUpperCase()+g.slice(1)} />)}
            </RadioGroup>
            {errors.gender && <FormHelperText>{errors.gender}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl error={!!errors.maritalStatus} fullWidth>
            <Typography variant="caption" sx={{ mb: 0.5 }}>Marital Status</Typography>
            <RadioGroup row value={kyc.maritalStatus || ''} onChange={e=>setK('maritalStatus', e.target.value)}>
              {['single','married'].map(m => <FormControlLabel key={m} value={m} control={<Radio/>} label={m[0].toUpperCase()+m.slice(1)} />)}
            </RadioGroup>
            {errors.maritalStatus && <FormHelperText>{errors.maritalStatus}</FormHelperText>}
          </FormControl>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between">
        <Box/>
        <Button endIcon={<ArrowForwardIcon/>} onClick={next}>Next</Button>
      </Stack>
    </Stack>
  )
}
