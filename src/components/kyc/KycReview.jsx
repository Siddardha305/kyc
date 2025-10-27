import { Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function KycReview({ state, persist, goRisk }) {
  const kyc = state.userData.kyc || {}
  const back = () => persist(s=>({ ...s, kycSubStep:3 }))
  const confirm = () => { persist(s=>({ ...s, kycSubStepStatus:{...s.kycSubStepStatus, 4:true} })); goRisk() }

  return (
    <Stack spacing={2}>
      <Card variant="outlined">
        <CardContent>
          <Grid container spacing={2}>
            {Object.entries(kyc).map(([k,v]) => (
              <Grid item xs={12} sm={6} key={k}>
                <Typography variant="caption" color="text.secondary">{k.replace(/([A-Z])/g,' $1').toUpperCase()}</Typography>
                <Typography fontWeight={700}>{String(v||'-')}</Typography>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>
      <Stack direction="row" justifyContent="space-between">
        <Button startIcon={<ArrowBackIcon/>} variant="outlined" onClick={back}>Back</Button>
        <Button endIcon={<ArrowForwardIcon/>} onClick={confirm}>Confirm & Proceed</Button>
      </Stack>
    </Stack>
  )
}
