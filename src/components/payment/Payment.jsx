import { Button, Card, CardContent, CardHeader, Container, Divider, Grid, Stack, Typography } from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'

export default function Payment({ state, onLogout }) {
  const md = state.userData.kyc || {}
  const u = state.userData
  const p = state.userData.selectedPlan || { title: 'No Plan Selected', price: '₹0.00' }
  const pay = () => alert('Payment flow stubbed. Integrate Razorpay/Stripe as needed.')

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ActiveHeader state={state} onLogout={onLogout}/>
      <StepRail activeId="payment"/>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="Member Details"/>
            <CardContent>
              <Grid container spacing={2}>
                {[{l:'Full Name', v: md.name || u.name},{l:'City', v: md.city},{l:'State', v: md.state},{l:'PAN', v: md.pan},{l:'Email', v: u.email},{l:'Phone', v: u.mobile}]
                  .map(row => (
                    <Grid key={row.l} item xs={12} sm={6}>
                      <Typography variant="caption" color="text.secondary">{row.l}</Typography>
                      <Typography fontWeight={700}>{row.v || 'N/A'}</Typography>
                    </Grid>
                  ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ position: { md: 'sticky' }, top: 16 }}>
            <CardHeader title="Selected Products"/>
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography>{p.title}</Typography>
                <Typography fontWeight={800}>{(p.price||'').split('/')[0].trim()}</Typography>
              </Stack>
              <Divider sx={{ my: 2 }}/>
              <Stack direction="row" justifyContent="space-between">
                <Typography fontWeight={800}>Total Payable</Typography>
                <Typography fontWeight={800}>{(p.price||'').split('/')[0].trim()}</Typography>
              </Stack>
              <Button fullWidth sx={{ mt: 2 }} onClick={pay}>Pay Now</Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

