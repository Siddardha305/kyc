import { useState } from 'react'
import { Button, FormControl, FormControlLabel, FormHelperText, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, TextField } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function KycProfessional({ state, persist }) {
  const kyc = state.userData.kyc || {}
  const [errors, setErrors] = useState({})
  const setK = (key, val) => persist(s => ({ ...s, userData: { ...s.userData, kyc: { ...s.userData.kyc, [key]: val } } }))

  const occupations = ["Salaried (Private Sector)","Salaried (Government / PSU)","Self-employed / Professional","Business Owner","Student","Retired","Homemaker","Agriculturist / Farmer","Others"]

  const next = () => {
    const e = {}
    if (!kyc.occupationType) e.type = 'Select occupation type'
    if (!kyc.occupation) e.occ = 'Select occupation'
    if (kyc.occupation === 'Others' && !kyc.otherOccupation) e.other = 'Specify other occupation'
    setErrors(e)
    if (Object.keys(e).length) return
    persist(s=>({ ...s, kycSubStepStatus:{...s.kycSubStepStatus, 3:true}, kycSubStep:4 }))
  }
  const back = () => persist(s=>({ ...s, kycSubStep:2 }))

  return (
    <Stack spacing={3}>
      <FormControl error={!!errors.type}>
        <RadioGroup row value={kyc.occupationType || ''} onChange={e=>setK('occupationType', e.target.value)}>
          {['business','profession','self-employed','salaried'].map(t => <FormControlLabel key={t} value={t} control={<Radio/>} label={t.replace('-',' ')} />)}
        </RadioGroup>
        {errors.type && <FormHelperText>{errors.type}</FormHelperText>}
      </FormControl>
      <FormControl fullWidth error={!!errors.occ}>
        <InputLabel id="occ-label">Occupation</InputLabel>
        <Select labelId="occ-label" label="Occupation" value={kyc.occupation||''} onChange={e=>setK('occupation', e.target.value)}>
          {occupations.map(o => <MenuItem key={o} value={o}>{o}</MenuItem>)}
        </Select>
        {errors.occ && <FormHelperText>{errors.occ}</FormHelperText>}
      </FormControl>
      {kyc.occupation === 'Others' && (
        <TextField label="If Others, specify" value={kyc.otherOccupation||''} onChange={e=>setK('otherOccupation', e.target.value)} error={!!errors.other} helperText={errors.other} fullWidth/>
      )}
      <Stack direction="row" justifyContent="space-between">
        <Button startIcon={<ArrowBackIcon/>} variant="outlined" onClick={back}>Back</Button>
        <Button endIcon={<ArrowForwardIcon/>} onClick={next}>Next</Button>
      </Stack>
    </Stack>
  )
}
