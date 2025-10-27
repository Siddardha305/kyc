import { Button, Card, CardContent, CardHeader, Container, Grid, Stack } from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'
import DocCard from './DocCard'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function Docs({ state, persist, onLogout, navigateTo }) {
  const allUploaded = Object.values(state.userData.docsStatus || {}).every(Boolean)
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ActiveHeader state={state} onLogout={onLogout}/>
      <StepRail activeId="docs"/>

      <Grid container spacing={2}>
        {[
          { id: 'pan', title: 'PAN Card' },
          { id: 'aadhaar-front', title: 'Aadhaar Card (Front)' },
          { id: 'aadhaar-back', title: 'Aadhaar Card (Back)' },
          { id: 'profile', title: 'Profile Photo' },
        ].map(d => (
          <Grid key={d.id} item xs={12} sm={6} md={3}>
            <DocCard {...d} state={state} persist={persist}/>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
        <Button disabled={!allUploaded} onClick={()=>navigateTo('plan')} endIcon={<ArrowForwardIcon/>}>Next</Button>
      </Stack>
    </Container>
  )
}
