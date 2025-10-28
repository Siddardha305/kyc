// src/components/layout/StepRail.jsx
import React from 'react'
import { Box, Stack, Typography } from '@mui/material'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import AssignmentTurnedInRoundedIcon from '@mui/icons-material/AssignmentTurnedInRounded'
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded'
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded'
import UploadFileRoundedIcon from '@mui/icons-material/UploadFileRounded'
import RequestQuoteRoundedIcon from '@mui/icons-material/RequestQuoteRounded'
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded'
import CreditCardRoundedIcon from '@mui/icons-material/CreditCardRounded'
import { riskQuestions } from '../../constants/riskQuestions'

/**
 * Props:
 *   - activeId: 'kyc' | 'risk' | 'assessment' | 'docs' | 'plan' | 'sign' | 'payment'
 *   - state: app state (optional; component is defensive)
 */
export default function StepRail({ activeId, state }) {
  // ✅ defensive defaults if state not passed yet
  const s = state ?? {}
  const userData = s.userData ?? {}
  const flags = s.flags ?? {}
  const kycSubStepStatus = s.kycSubStepStatus ?? {}

  const isKycDone = Object.values(kycSubStepStatus).every(Boolean)

  const answeredCount = Object.entries(userData.riskAnswers ?? {}).reduce((acc, [qid, val]) => {
    const q = riskQuestions.find((x) => x.id === qid)
    if (!q) return acc
    if (q.type === 'checkbox') return acc + (Array.isArray(val) && val.length ? 1 : 0)
    return acc + (val !== undefined && val !== null && val !== '' ? 1 : 0)
  }, 0)
  const isRiskDone = answeredCount === riskQuestions.length

  const isAssessmentDone = !!flags.assessmentAck
  const isDocsDone = userData.docsStatus ? Object.values(userData.docsStatus).every(Boolean) : false
  const isPlanDone = !!userData.selectedPlan?.title
  const isSignDone = !!flags.agreementSigned
  const isPaymentDone = !!flags.paymentDone

  const steps = [
    { id: 'kyc',        label: 'KYC Details',  icon: <DescriptionRoundedIcon/>,         done: isKycDone },
    { id: 'risk',       label: 'Risk Profiling', icon: <AssignmentTurnedInRoundedIcon/>, done: isRiskDone },
    { id: 'assessment', label: 'Suitability',  icon: <TaskAltRoundedIcon/>,             done: isAssessmentDone },
    { id: 'docs',       label: 'Upload Docs',  icon: <UploadFileRoundedIcon/>,          done: isDocsDone },
    { id: 'plan',       label: 'Select Plan',  icon: <RequestQuoteRoundedIcon/>,        done: isPlanDone },
    { id: 'sign',       label: 'Agreement',    icon: <ReceiptLongRoundedIcon/>,         done: isSignDone },
    { id: 'payment',    label: 'Payment',      icon: <CreditCardRoundedIcon/>,          done: isPaymentDone },
  ]

  const activeIndex = Math.max(0, steps.findIndex((st) => st.id === activeId))

  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ my: 2, overflowX: 'auto', pb: 1 }}>
      {steps.map((step, idx) => {
        const isActive = step.id === activeId
        const isCompleted = !!step.done
        const beforeActive = idx < activeIndex

        const bulletBg = isCompleted ? 'success.main' : isActive ? 'primary.main' : 'text.primary'
        const bulletColor = isCompleted || isActive ? '#fff' : 'background.paper'
        const connectorColor = idx < activeIndex ? 'primary.main' : 'divider'

        return (
          <React.Fragment key={step.id}>
            <Stack alignItems="center" minWidth={96} sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 36, height: 36, borderRadius: '50%',
                  display: 'grid', placeItems: 'center',
                  bgcolor: bulletBg, color: bulletColor,
                  boxShadow: isActive ? 2 : 0,
                }}
              >
                {isCompleted ? <CheckRoundedIcon fontSize="small" /> : step.icon}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 1,
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'text.primary' : beforeActive ? 'text.primary' : 'text.secondary',
                }}
              >
                {step.label}
              </Typography>
            </Stack>

            {idx < steps.length - 1 && (
              <Box sx={{ flex: 1, height: 2, bgcolor: connectorColor, opacity: idx < activeIndex ? 1 : 0.5 }} />
            )}
          </React.Fragment>
        )
      })}
    </Stack>
  )
}
