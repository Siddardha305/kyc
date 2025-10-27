import { useState } from 'react'
import {
  Alert,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  LinearProgress,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Typography,
  Checkbox, 
} from '@mui/material'
import ActiveHeader from '../layout/ActiveHeader'
import StepRail from '../layout/StepRail'
import { riskQuestions } from '../../constants/riskQuestions'

export default function Risk({ state, persist, onLogout, navigateTo }) {
  const [answers, setAnswers] = useState(state.userData.riskAnswers || {})

  const calcScore = (a) => {
    let s = 0
    let answered = 0
    riskQuestions.forEach((q) => {
      if (q.type === 'checkbox') {
        if ((a[q.id] || []).length) answered++
      } else if (a[q.id] !== undefined && a[q.id] !== null && a[q.id] !== '') {
        s += Number(a[q.id]) + 1
        answered++
      }
    })
    return { score: s, answered }
  }

  const { score, answered } = calcScore(answers)
  const profile = score < 9 ? 'Conservative' : score < 14 ? 'Moderate' : 'Aggressive'

  const setA = (id, val) => {
    const next = { ...answers, [id]: val }
    setAnswers(next)
    const { score: nextScore } = calcScore(next)
    const nextProfile = nextScore < 9 ? 'Conservative' : nextScore < 14 ? 'Moderate' : 'Aggressive'
    persist((s) => ({
      ...s,
      userData: {
        ...s.userData,
        riskAnswers: next,
        riskScore: nextScore,
        riskProfile: nextProfile,
      },
    }))
  }

  const allAnswered = answered === riskQuestions.length

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <ActiveHeader state={state} onLogout={onLogout} />
      <StepRail activeId="risk" />

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack spacing={2}>
            {riskQuestions.map((q) => (
              <Card key={q.id} variant="outlined">
                <CardContent>
                  <Typography fontWeight={700} sx={{ mb: 1 }}>
                    {q.text}
                  </Typography>

                  {q.type === 'radio' && (
                    <RadioGroup
                      value={answers[q.id] ?? ''}
                      onChange={(e) => setA(q.id, Number(e.target.value))}
                    >
                      <Grid container>
                        {q.options.map((opt, idx) => (
                          <Grid item xs={12} sm={6} md={4} key={idx}>
                            <FormControlLabel value={idx} control={<Radio />} label={opt} />
                          </Grid>
                        ))}
                      </Grid>
                    </RadioGroup>
                  )}

                  {q.type === 'checkbox' && (
                    <FormGroup>
                      <Grid container>
                        {q.options.map((opt) => {
                          const arr = answers[q.id] || []
                          const checked = arr.includes(opt)
                          return (
                            <Grid item xs={12} sm={6} md={4} key={opt}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={checked}
                                    onChange={(e) => {
                                      const next = e.target.checked
                                        ? [...arr, opt]
                                        : arr.filter((x) => x !== opt)
                                      setA(q.id, next)
                                    }}
                                  />
                                }
                                label={opt}
                              />
                            </Grid>
                          )
                        })}
                      </Grid>
                    </FormGroup>
                  )}

                  {q.type === 'select' && (
                    <FormControl fullWidth>
                      <Select
                        value={answers[q.id] ?? ''}
                        onChange={(e) => setA(q.id, Number(e.target.value))}
                        displayEmpty
                      >
                        <MenuItem value="">
                          <em>Select</em>
                        </MenuItem>
                        {q.options.map((opt, idx) => (
                          <MenuItem key={opt.text} value={idx}>
                            {opt.text} —{' '}
                            <Typography component="span" variant="caption" color="text.secondary">
                              {opt.horizon}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ position: 'sticky', top: 16 }}>
            <CardHeader title="Your Live Profile" />
            <CardContent>
              <Typography
                align="center"
                fontWeight={800}
                color={
                  profile === 'Conservative'
                    ? 'success.main'
                    : profile === 'Moderate'
                    ? 'warning.main'
                    : 'error.main'
                }
              >
                {profile}
              </Typography>

              <LinearProgress
                variant="determinate"
                value={Math.min(100, (score / 18) * 100)}
                sx={{ my: 2, height: 10, borderRadius: 5 }}
              />
              <Typography align="center" variant="body2" color="text.secondary">
                Score: {score}
              </Typography>

              <Alert sx={{ mt: 2 }} severity={allAnswered ? 'success' : 'info'}>
                {allAnswered ? 'All questions answered.' : 'Answer all questions to proceed.'}
              </Alert>

              <Stack sx={{ mt: 2 }}>
                <Button disabled={!allAnswered} onClick={() => navigateTo('assessment')}>
                  See Full Profile &amp; Proceed
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
