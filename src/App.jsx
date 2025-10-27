import * as React from 'react'
import { useEffect, useState } from 'react'
import { Box, Chip, Container, Paper, Stack, Tab, Tabs, Typography, Button, Checkbox, FormControlLabel } from '@mui/material'
import { useRef } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { theme } from './theme/theme'
import { clearCurrentSession, loadCurrentSession, loadUserProgress } from './utils/storage'
import { usePersist } from './hooks/usePersist'
import { getInitialState } from './rootState.js' 
// auth
import Signup from './components/auth/Signup'
import Login from './components/auth/Login'

// flows
import KycContainer from './components/kyc/KycContainer'
import Risk from './components/risk/Risk'
import Docs from './components/docs/Docs'
import Plans from './components/plan/Plans'
import SignAgreement from './components/agreement/SignAgreement'
import Payment from './components/payment/Payment'

export default function App() {
  const [state, setState] = useState(getInitialState())
  const persist = usePersist(setState)
  const [authTab, setAuthTab] = useState(0) // 0 signup, 1 login

  // resume session
  useEffect(() => {
    const logged = loadCurrentSession()
    if (logged) {
      const userState = loadUserProgress(logged)
      if (userState) setState({ ...userState, currentUser: logged })
    }
  }, [])

  const navigateTo = (next) => persist(s => ({ ...s, currentStep: next }))
  const logout = () => { clearCurrentSession(); setState(getInitialState()) }

  const Auth = () => (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={800}>Digital Onboarding</Typography>
        <Tabs value={authTab} onChange={(_,v)=>setAuthTab(v)} aria-label="auth tabs">
          <Tab label="Sign Up"/>
          <Tab label="Login"/>
        </Tabs>
      </Stack>
      {authTab===0? <Signup state={state} persist={persist} setState={setState}/> : <Login setState={setState}/>}
    </Container>
  )

  const Screen = () => {
    switch (state.currentStep) {
      case 'auth': return <Auth/>
      case 'kyc': return <KycContainer state={state} persist={persist} onLogout={logout} navigateTo={navigateTo}/>
      case 'risk': return <Risk state={state} persist={persist} onLogout={logout} navigateTo={navigateTo}/>
      case 'assessment': return <Assessment navigateTo={navigateTo} onLogout={logout} state={state}/>
      case 'docs': return <Docs state={state} persist={persist} onLogout={logout} navigateTo={navigateTo}/>
      case 'plan': return <Plans state={state} persist={persist} onLogout={logout} navigateTo={navigateTo}/>
      case 'sign': return <SignAgreement state={state} onLogout={logout} navigateTo={navigateTo}/>
      case 'payment': return <Payment state={state} onLogout={logout}/>
      default: return <Auth/>
    }
  }

function Assessment({ state, navigateTo }) {
  const [scrolled, setScrolled] = React.useState(false)
  const [ack, setAck] = React.useState(false)
  const scrollRef = useRef(null)

  // When the component mounts (or layout changes), auto-enable if there's nothing to scroll.
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // If content height <= container height, there's nothing to scroll → mark as scrolled.
    const noScrollNeeded = el.scrollHeight <= el.clientHeight + 1
    if (noScrollNeeded) setScrolled(true)
  }, [])

  // If window resizes (or fonts load) and content shrinks/expands, re-check
  React.useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const handle = () => {
      const noScrollNeeded = el.scrollHeight <= el.clientHeight + 1
      if (noScrollNeeded) setScrolled(true)
    }
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  const handleScroll = (e) => {
    const el = e.currentTarget
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    if (atBottom) setScrolled(true)
  }

  const canProceed = scrolled && ack

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Typography variant="subtitle1" fontWeight={800}>
          Hello, {state.userData.name || 'Guest'}!
        </Typography>
        <Stack direction="row" spacing={1}>
          <Chip label="ASSESSMENT" color="primary" variant="outlined" />
        </Stack>
      </Stack>

      <Paper variant="outlined" sx={{ p: 0 }}>
        <Stack sx={{ p: 2 }}>
          <Typography variant="h6" fontWeight={800}>
            Suitability Assessment
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Please read the following document carefully before proceeding.
          </Typography>
        </Stack>

        <Box
          ref={scrollRef}
          sx={{
            maxHeight: { xs: 360, sm: 420 },
            overflow: 'auto',
            p: 2,
            bgcolor: 'grey.50',
            borderTop: 1,
            borderColor: 'divider',
          }}
          onScroll={handleScroll}
        >
          {[1, 2, 3, 4, 5].map((p) => (
            <Box key={p} sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight={800}>
                Page {p}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae eros a
                dolor fermentum ornare. Praesent bibendum efficitur nibh.
              </Typography>
            </Box>
          ))}
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{ p: 2 }}
          spacing={1}
        >
          <FormControlLabel
            control={
              <Checkbox
                disabled={!scrolled}
                checked={ack}
                onChange={(e) => setAck(e.target.checked)}
              />
            }
            label="I have read and understood the document."
          />

          <Button
            variant="contained"
            disabled={!canProceed}
            onClick={() => navigateTo('docs')}
          >
            Next
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}


  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ minHeight: '100dvh', bgcolor: '#f5f7fb', py: 2 }}>
          <Container maxWidth="lg" sx={{ mb: 2 }}>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 3, background: 'linear-gradient(135deg, #ffffff 0%, #f3f7ff 100%)', border: '1px solid', borderColor: '#e6ebf5' }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={1}>
                <Typography variant="h6" fontWeight={900}>KYC Onboarding</Typography>
                <Chip label={state.currentStep.toUpperCase()} color="primary" variant="outlined"/>
              </Stack>
            </Paper>
          </Container>
          <Screen/>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  )
}
