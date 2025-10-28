import { useEffect, useRef, useState } from 'react'
import {
  Button, Grid, Radio, RadioGroup, Stack, TextField, FormControlLabel, FormLabel,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function KycPersonal({ state, persist }) {
  const kyc = state.userData.kyc || {}

  // 👇 prefill name from KYC or fallback to signup display name
  const [local, setLocal] = useState({
    name: kyc.name || state.userData.name || '',
    fatherName: kyc.fatherName || '',
    dob: kyc.dob || '',
    pan: kyc.pan || '',
    aadhar: kyc.aadhar || '',
    gender: kyc.gender || '',
    maritalStatus: kyc.maritalStatus || '',
  })
  const [errors, setErrors] = useState({})

  const setL = (k, v) => setLocal(prev => ({ ...prev, [k]: v }))

  // —— Dynamic name sync to header (debounced) ——
  const debounceRef = useRef()
  const updateHeaderName = (val) => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      // only nudge the lightweight display name so header updates,
      // keep the rest of the KYC values local until "Next"
      persist(s => ({ ...s, userData: { ...s.userData, name: val } }))
    }, 200)
  }

  // if signup name changes later and KYC name is still empty, adopt it
  useEffect(() => {
    if (!kyc.name && state.userData.name && !local.name) {
      setLocal(prev => ({ ...prev, name: state.userData.name }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.userData.name])

  const validate = () => {
    const e = {}
    if (!local.name) e.name = 'Name required'
    if (!local.fatherName) e.fatherName = "Father's name required"
    if (!local.dob) e.dob = 'Date of birth required'
    if (!local.pan) e.pan = 'PAN required'
    else if (!/^[A-Z]{5}\d{4}[A-Z]$/.test(local.pan)) e.pan = 'Invalid PAN (e.g., ABCDE1234F)'
    if (!local.aadhar) e.aadhar = 'Aadhaar required'
    else if (!/^\d{12}$/.test(local.aadhar)) e.aadhar = 'Aadhaar must be 12 digits'
    if (!local.gender) e.gender = 'Select gender'
    if (!local.maritalStatus) e.maritalStatus = 'Select marital status'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    // write all KYC fields once on Next
    persist(s => ({
      ...s,
      userData: { ...s.userData, name: local.name, kyc: { ...s.userData.kyc, ...local } },
      kycSubStepStatus: { ...s.kycSubStepStatus, 1: true },
      kycSubStep: 2,
    }))
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <TextField
            label="Name as per PAN"
            fullWidth
            value={local.name}
            onChange={(e) => {
              const val = e.target.value
              setL('name', val)
              updateHeaderName(val)   // 👈 keep greeting in sync while typing
            }}
            error={!!errors.name}
            helperText={errors.name}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Father's Name"
            fullWidth
            value={local.fatherName}
            onChange={(e) => setL('fatherName', e.target.value)}
            error={!!errors.fatherName}
            helperText={errors.fatherName}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <DatePicker
            label="Date of Birth"
            value={local.dob ? new Date(local.dob) : null}
            onChange={(val) => {
              if (val instanceof Date && !isNaN(val)) {
                setL('dob', val.toISOString().split('T')[0])
              } else {
                setL('dob', '')
              }
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!errors.dob,
                helperText: errors.dob,
                InputLabelProps: { shrink: true },
              },
            }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="PAN"
            fullWidth
            value={local.pan}
            onChange={(e) =>
              setL('pan', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10))
            }
            error={!!errors.pan}
            helperText={errors.pan}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 10 }}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            label="Aadhaar"
            fullWidth
            value={local.aadhar}
            onChange={(e) =>
              setL('aadhar', e.target.value.replace(/[^0-9]/g, '').slice(0, 12))
            }
            error={!!errors.aadhar}
            helperText={errors.aadhar}
            InputLabelProps={{ shrink: true }}
            inputProps={{ maxLength: 12 }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <FormLabel sx={{ mb: 1, display: 'block' }}>
            Gender {errors.gender ? <span style={{ color: '#d32f2f' }}> — {errors.gender}</span> : null}
          </FormLabel>
          <RadioGroup
            row
            value={local.gender}
            onChange={(e) => setL('gender', e.target.value)}
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormLabel sx={{ mb: 1, display: 'block' }}>
            Marital Status {errors.maritalStatus ? <span style={{ color: '#d32f2f' }}> — {errors.maritalStatus}</span> : null}
          </FormLabel>
          <RadioGroup
            row
            value={local.maritalStatus}
            onChange={(e) => setL('maritalStatus', e.target.value)}
          >
            <FormControlLabel value="single" control={<Radio />} label="Single" />
            <FormControlLabel value="married" control={<Radio />} label="Married" />
          </RadioGroup>
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between">
        <span /> {/* spacer */}
        <Button endIcon={<ArrowForwardIcon />} onClick={next}>
          Next
        </Button>
      </Stack>
    </Stack>
  )
}
