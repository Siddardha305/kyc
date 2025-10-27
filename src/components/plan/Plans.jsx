// src/components/plan/Plans.jsx
import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'

const plans = [
  {
    key: 'standard',
    title: 'Comprehensive Planning',
    subtitle: 'A complete financial roadmap for individuals and families.',
    price: '₹34,999',
    details: 'One-time fee',
    features: [
      'Financial Health Check',
      'Goal-Based Financial Planning',
      'Risk Management Planning',
      'Investment Planning',
      'Retirement & Pension Planning',
      'Debt & Credit Advisory',
    ],
    recommended: false,
  },
  {
    key: 'exclusive',
    title: 'Exclusive Wealth Management',
    subtitle: 'Bespoke strategies for high-net-worth clients.',
    price: 'Customized',
    details: 'Preferred for > ₹1 Cr Net Worth',
    features: [
      'Includes all Comprehensive services, plus:',
      'Strategic Wealth Structuring',
      'Tactical Capital Growth & Investment',
      'Global Diversification & Offshore Planning',
      'Advanced Tax Planning & Exit Strategy',
      'Legacy & Succession Planning',
      'Alternative & Private Market Advisory',
      'Lifestyle, Concierge & Philanthropy',
    ],
    recommended: true,
  },
  {
    key: 'rebalancing',
    title: 'Portfolio Rebalancing',
    subtitle: 'A one-time service to align your portfolio.',
    price: '₹14,999 / ₹24,999',
    details: 'For Portfolio Value up to ₹50L / above ₹50L',
    features: [
      "What's Included:",
      'In-depth Portfolio Analysis & Risk Profiling',
      'Intrinsic Value Analysis (DCF Modeling)',
      'Asset Allocation using Modern Portfolio Theory (MPT)',
      'Portfolio Optimization & Gap Analysis',
      'Actionable Rebalancing Report',
      'Execution Guidance & Support',
    ],
    recommended: false,
  },
]

export default function Plans({ state, persist, onLogout, navigateTo }) {
  const [selected, setSelected] = useState(state.userData.selectedPlan?.key || 'exclusive')
  const [rebalanceOpen, setRebalanceOpen] = useState(false)
  const [exclusiveOpen, setExclusiveOpen] = useState(false)
  const [portfolioValue, setPortfolioValue] = useState('')
  const [aumValue, setAumValue] = useState('')

  const chosen = useMemo(
    () => plans.find((p) => p.key === selected) || plans[1],
    [selected]
  )

  const applySelection = (planObj) => {
    persist((s) => ({
      ...s,
      userData: {
        ...s.userData,
        selectedPlan: {
          key: planObj.key,
          title: planObj.title,
          price: planObj.price,
          details: planObj.details,
        },
      },
    }))
  }

  const handlePick = (key) => {
    setSelected(key)
    const planObj = plans.find((p) => p.key === key)
    if (!planObj) return

    if (key === 'rebalancing') {
      setPortfolioValue('')
      setRebalanceOpen(true)
    } else if (key === 'exclusive') {
      setAumValue('')
      setExclusiveOpen(true)
    } else {
      // standard
      applySelection(planObj)
    }
  }

  const sanitizeNumber = (val) => {
    const cleaned = String(val || '').replace(/[, ]/g, '')
    const num = parseFloat(cleaned)
    return Number.isFinite(num) ? num : NaN
  }

  // Rebalancing: confirm fee tier based on portfolio value
  const confirmRebalance = () => {
    const v = sanitizeNumber(portfolioValue)
    if (!Number.isFinite(v) || v < 0) return
    const np = v <= 5000000 ? '₹14,999' : '₹24,999'
    const nd = v <= 5000000 ? 'For Portfolio Value up to ₹50L' : 'For Portfolio Value above ₹50L'
    applySelection({ key: 'rebalancing', title: 'Portfolio Rebalancing', price: np, details: nd })
    setRebalanceOpen(false)
  }

  // Exclusive: set pricing model (we keep a static text, but you can compute tiers later)
  const confirmExclusive = () => {
    // optional numeric check; not strictly required, but we can store it if needed
    const _aum = sanitizeNumber(aumValue)
    // If you want to enforce a value, uncomment:
    // if (!Number.isFinite(_aum) || _aum < 0) return

    applySelection({
      key: 'exclusive',
      title: 'Exclusive Wealth Management',
      price: 'AUM Based',
      details: '1.5% Annually (+ ₹99,999 Upfront)',
    })
    setExclusiveOpen(false)
  }

  const PlanCard = ({ plan }) => (
    <Card variant="outlined" sx={{ height: '100%', borderColor: plan.recommended ? 'primary.main' : 'divider' }}>
      <CardActionArea onClick={() => handlePick(plan.key)} sx={{ height: '100%' }}>
        {plan.recommended && (
          <Box sx={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}>
            <Chip color="primary" size="small" label="MOST POPULAR" />
          </Box>
        )}
        <CardHeader title={plan.title} subheader={plan.subtitle} />
        <CardContent>
          <Typography variant="h4" fontWeight={800}>{plan.price}</Typography>
          <Typography variant="caption" color="text.secondary">{plan.details}</Typography>
          <Box sx={{ mt: 2 }}>
            {plan.features.map((f) => (
              <Typography key={f} variant="body2" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                • {f}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ActiveHeader state={state} onLogout={onLogout} />
      <StepRail activeId="plan" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={800}>Select Your Plan</Typography>
            <Typography variant="body2" color="text.secondary">
              Choose the plan that best fits your investment goals.
            </Typography>

            <FormControl component="fieldset" sx={{ mt: 1 }}>
              <RadioGroup value={selected} onChange={(e) => handlePick(e.target.value)}>
                <Grid container spacing={2}>
                  {plans.map((p) => (
                    <Grid key={p.key} item xs={12} sm={12} md={12}>
                      <FormControlLabel
                        value={p.key}
                        control={<Radio />}
                        label={
                          <Box sx={{ width: '100%' }}>
                            <PlanCard plan={p} />
                          </Box>
                        }
                        sx={{ alignItems: 'flex-start', m: 0 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            <Stack direction="row" justifyContent="flex-end">
              <Button variant="contained" onClick={() => navigateTo('sign')}>
                Next
              </Button>
            </Stack>
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ position: 'sticky', top: 16 }}>
            <CardHeader title="Selected Product" />
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">Plan</Typography>
              <Typography fontWeight={800}>{state.userData.selectedPlan?.title || chosen.title}</Typography>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Price</Typography>
              <Typography fontWeight={800}>{state.userData.selectedPlan?.price || chosen.price}</Typography>
              <Typography variant="caption" color="text.secondary">
                {state.userData.selectedPlan?.details || chosen.details}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Rebalancing Dialog */}
      <Dialog open={rebalanceOpen} onClose={() => setRebalanceOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Enter Portfolio Value</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Portfolio Value (₹)"
            fullWidth
            value={portfolioValue}
            onChange={(e) => setPortfolioValue(e.target.value)}
            placeholder="e.g., 5,000,000"
            inputProps={{ inputMode: 'decimal' }}
          />
          <Typography variant="caption" color="text.secondary">
            Pricing: ₹14,999 for ≤ ₹50L, otherwise ₹24,999.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRebalanceOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmRebalance}>Confirm</Button>
        </DialogActions>
      </Dialog>

      {/* Exclusive Dialog */}
      <Dialog open={exclusiveOpen} onClose={() => setExclusiveOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Enter Approx AUM</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="AUM (₹)"
            fullWidth
            value={aumValue}
            onChange={(e) => setAumValue(e.target.value)}
            placeholder="e.g., 15,000,000"
            inputProps={{ inputMode: 'decimal' }}
          />
          <Typography variant="caption" color="text.secondary">
            Pricing Model: 1.5% annually + ₹99,999 upfront (AUM-based).
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExclusiveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmExclusive}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
