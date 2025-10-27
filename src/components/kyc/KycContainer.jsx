import { Card, CardContent, CardHeader, Container, Grid, Stack, Button } from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'
import KycPersonal from './KycPersonal'
import KycAddress from './KycAddress'
import KycProfessional from './KycProfessional'
import KycReview from './KycReview'

export default function KycContainer({ state, persist, onLogout, navigateTo }) {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ActiveHeader state={state} onLogout={onLogout}/>
      <StepRail activeId="kyc"/>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Card variant="outlined">
            <CardContent>
              <Stack spacing={1.5}>
                {[1,2,3,4].map(i => (
                  <Button key={i} onClick={()=>persist(s=>({ ...s, kycSubStep:i }))} variant={state.kycSubStep===i?'contained':'outlined'} color={state.kycSubStepStatus[i]?'success':'primary'}>
                    {i===1?'Personal':i===2?'Address & Contact':i===3?'Professional':'Review'}
                  </Button>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={9}>
          <Card>
            <CardHeader title={state.kycSubStep===1?'Personal Details': state.kycSubStep===2?'Address & Contact': state.kycSubStep===3?'Professional Details':'Review'} />
            <CardContent>
              {state.kycSubStep===1 && <KycPersonal state={state} persist={persist}/>}
              {state.kycSubStep===2 && <KycAddress state={state} persist={persist}/>}
              {state.kycSubStep===3 && <KycProfessional state={state} persist={persist}/>}
              {state.kycSubStep===4 && <KycReview state={state} persist={persist} goRisk={()=>navigateTo('risk')}/>}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
