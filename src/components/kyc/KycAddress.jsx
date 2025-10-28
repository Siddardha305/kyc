// src/components/kyc/KycAddress.jsx
import { useState } from 'react'
import {
  Button,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { indianStates } from '../../constants/indianStates'
import { isEmail, isPincode, isPhone } from '../../utils/validation'

export default function KycAddress({ state, persist }) {
  const kyc0 = state.userData.kyc || {}

  // ✅ local copy to avoid remount/focus loss while typing
  const [local, setLocal] = useState({
    address: kyc0.address || '',
    city: kyc0.city || '',
    pincode: kyc0.pincode || '',
    state: kyc0.state || '',
    country: kyc0.country || 'India',
    mobile: kyc0.mobile || state.userData.mobile || '',
    email: kyc0.email || state.userData.email || '',
  })
  const [errors, setErrors] = useState({})

  const setL = (k, v) => setLocal(prev => ({ ...prev, [k]: v }))

  const validate = () => {
    const e = {}
    if (!local.address) e.address = 'Address required'
    if (!local.city) e.city = 'City required'
    if (!isPincode(local.pincode)) e.pincode = '6-digit PIN required'
    if (!local.state) e.state = 'Select state'
    if (!isPhone(local.mobile)) e.mobile = 'Valid 10-digit mobile required'
    if (!isEmail(local.email)) e.email = 'Valid email required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validate()) return
    // ✅ write once to global state on Next
    persist(s => ({
      ...s,
      userData: { ...s.userData, kyc: { ...s.userData.kyc, ...local } },
      kycSubStepStatus: { ...s.kycSubStepStatus, 2: true },
      kycSubStep: 3,
    }))
  }

  const back = () => persist(s => ({ ...s, kycSubStep: 1 }))

  return (
    <Stack spacing={3}>
      {/* Address */}
      <TextField
        multiline
        minRows={3}
        label="Address"
        value={local.address}
        onChange={e => setL('address', e.target.value)}
        error={!!errors.address}
        helperText={errors.address}
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ '& .MuiOutlinedInput-input': { pr: 4 } }} // avoid Grammarly bump
      />

      <Grid container spacing={2}>
        {/* City */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="City"
            value={local.city}
            onChange={e => setL('city', e.target.value)}
            error={!!errors.city}
            helperText={errors.city}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* PIN */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="PIN Code"
            value={local.pincode}
            onChange={e =>
              setL('pincode', e.target.value.replace(/[^0-9]/g, '').slice(0, 6))
            }
            error={!!errors.pincode}
            helperText={errors.pincode}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* State (no jitter) */}
        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="State"
            value={local.state}
            onChange={e => setL('state', e.target.value)}
            error={!!errors.state}
            helperText={errors.state}
            InputLabelProps={{ shrink: true }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: { PaperProps: { style: { maxHeight: 280 } } },
            }}
            sx={{ minWidth: 0 }}
          >
            <MenuItem value="">
              <em>-- Select State --</em>
            </MenuItem>
            {indianStates.map(s => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Country (read-only) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Country"
            value={local.country}
            InputProps={{ readOnly: true }}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Mobile */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Mobile"
            value={local.mobile}
            onChange={e =>
              setL('mobile', e.target.value.replace(/[^0-9]/g, '').slice(0, 10))
            }
            error={!!errors.mobile}
            helperText={errors.mobile}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        {/* Email */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            value={local.email}
            onChange={e => setL('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>

      <Stack direction="row" justifyContent="space-between">
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={back}>
          Back
        </Button>
        <Button endIcon={<ArrowForwardIcon />} onClick={next}>
          Next
        </Button>
      </Stack>
    </Stack>
  )
}
