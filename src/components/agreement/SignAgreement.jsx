// src/components/agreement/SignAgreement.jsx
import React, { useEffect, useRef, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  Paper,
  Stack,
  Typography,
} from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'

export default function SignAgreement({ state, onLogout, navigateTo }) {
  const [scrolled, setScrolled] = useState(false)
  const [ack, setAck] = useState(false)
  const scrollRef = useRef(null)

  // Auto-enable if there’s nothing to scroll
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const noScrollNeeded = el.scrollHeight <= el.clientHeight + 1
    if (noScrollNeeded) setScrolled(true)
  }, [])

  // Re-check on resize (fonts/layout shifts)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onResize = () => {
      const noScrollNeeded = el.scrollHeight <= el.clientHeight + 1
      if (noScrollNeeded) setScrolled(true)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const handleScroll = (e) => {
    const el = e.currentTarget
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20
    if (atBottom) setScrolled(true)
  }

  const canProceed = scrolled && ack

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ActiveHeader state={state} onLogout={onLogout} />
      <StepRail activeId="sign" />

      <Typography variant="h5" fontWeight={800} sx={{ mb: 1 }}>
        Investment Agreement
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Please review and sign to complete your onboarding.
      </Typography>

      <Paper variant="outlined" sx={{ p: 0, overflow: 'hidden' }}>
        <Box
          ref={scrollRef}
          onScroll={handleScroll}
          sx={{
            maxHeight: { xs: 360, sm: 420 },
            overflow: 'auto',
            p: 2,
            bgcolor: 'grey.50',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Card variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              {[1, 2, 3, 4, 5].map((p) => (
                <Box key={p} sx={{ mb: p === 5 ? 0 : 3 }}>
                  <Typography variant="h6" fontWeight={800}>
                    Agreement Page {p}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This Investment Advisory Agreement outlines services, fees, responsibilities, and disclosures.
                    Electronic consent below is treated as a signature.
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Box>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={1}
          sx={{ p: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                disabled={!scrolled}
                checked={ack}
                onChange={(e) => setAck(e.target.checked)}
              />
            }
            label="I have read and agree to the Investment Agreement."
          />

          <Button
            variant="contained"
            disabled={!canProceed}
            onClick={() => navigateTo('payment')}
          >
            Sign the Agreement
          </Button>
        </Stack>
      </Paper>
    </Container>
  )
}
