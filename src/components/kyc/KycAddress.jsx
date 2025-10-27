import { useState } from 'react'
import { Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, Stack, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { indianStates } from '../../constants/indianStates'
import { isEmail, isPincode } from '../../utils/validation'
import { isPhone } from '../../utils/validation'

export default function KycAddress({ state, persist }) {
  const kyc = state.userData.kyc || {}
  const [errors, setErrors] = useState({})
  const setK = (key, val) => persist(s => ({ ...s, userData: { ...s.userData, kyc: { ...s.userData.kyc, [key]: val } } }))

  const validate = () => {
    const e = {}
    if (!kyc.address) e.address = 'Address required'
    if (!kyc.city) e.city = 'City required'
    if (!isPincode(kyc.pincode)) e.pincode = '6-digit PIN required'
    if (!kyc.state) e.state = 'Select state'
    if (!isPhone(kyc.mobile)) e.mobile = 'Valid 10-digit mobile required'
    if (!isEmail(kyc.email)) e.email = 'Valid email required'
    setErrors(e)
    return Object.keys(e).length === 0
  }
  const next = () => { if (!validate()) return; persist(s=>({ ...s, kycSubStepStatus:{...s.kycSubStepStatus, 2:true}, kycSubStep:3 })) }
  const back = () => persist(s=>({ ...s, kycSubStep:1 }))

  return (
    <Stack spacing={3}>
      <TextField multiline minRows={3} label="Address" value={kyc.address||''} onChange={e=>setK('address', e.target.value)} error={!!errors.address} helperText={errors.address} fullWidth/>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}><TextField label="City" value={kyc.city||''} onChange={e=>setK('city', e.target.value)} error={!!errors.city} helperText={errors.city} fullWidth/></Grid>
        <Grid item xs={12} sm={6}><TextField label="PIN Code" value={kyc.pincode||''} onChange={e=>setK('pincode', e.target.value.replace(/[^0-9]/g,'').slice(0,6))} error={!!errors.pincode} helperText={errors.pincode} fullWidth/></Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth error={!!errors.state}>
            <InputLabel id="state-label">State</InputLabel>
            <Select labelId="state-label" label="State" value={kyc.state||''} onChange={e=>setK('state', e.target.value)}>
              {indianStates.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
            {errors.state && <FormHelperText>{errors.state}</FormHelperText>}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}><TextField label="Country" value="India" InputProps={{ readOnly: true }} fullWidth/></Grid>
        <Grid item xs={12} sm={6}><TextField label="Mobile" value={kyc.mobile||state.userData.mobile||''} onChange={e=>setK('mobile', e.target.value.replace(/[^0-9]/g,'').slice(0,10))} error={!!errors.mobile} helperText={errors.mobile} fullWidth/></Grid>
        <Grid item xs={12} sm={6}><TextField label="Email" value={kyc.email||state.userData.email||''} onChange={e=>setK('email', e.target.value)} error={!!errors.email} helperText={errors.email} fullWidth/></Grid>
      </Grid>
      <Stack direction="row" justifyContent="space-between">
        <Button startIcon={<ArrowBackIcon/>} variant="outlined" onClick={back}>Back</Button>
        <Button endIcon={<ArrowForwardIcon/>} onClick={next}>Next</Button>
      </Stack>
    </Stack>
  )
}
