import { Step, StepLabel, Stepper } from '@mui/material'
import AssignmentIcon from '@mui/icons-material/Assignment'
import FeedIcon from '@mui/icons-material/Feed'
import TaskAltIcon from '@mui/icons-material/TaskAlt'
import UploadIcon from '@mui/icons-material/UploadFile'
import PriceChangeIcon from '@mui/icons-material/PriceChange'
import DescriptionIcon from '@mui/icons-material/Description'
import CreditCardIcon from '@mui/icons-material/CreditCard'

const steps = [
  { id: 'kyc', label: 'KYC Details', icon: <AssignmentIcon/> },
  { id: 'risk', label: 'Risk Profiling', icon: <FeedIcon/> },
  { id: 'assessment', label: 'Suitability', icon: <TaskAltIcon/> },
  { id: 'docs', label: 'Upload Docs', icon: <UploadIcon/> },
  { id: 'plan', label: 'Select Plan', icon: <PriceChangeIcon/> },
  { id: 'sign', label: 'Agreement', icon: <DescriptionIcon/> },
  { id: 'payment', label: 'Payment', icon: <CreditCardIcon/> },
]

export default function StepRail({ activeId }) {
  const activeIndex = steps.findIndex(s => s.id === activeId)
  return (
    <Stepper alternativeLabel activeStep={activeIndex} sx={{ mb: 4 }}>
      {steps.map((s, idx) => (
        <Step key={s.id} completed={idx < activeIndex}>
          <StepLabel icon={s.icon}>{s.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  )
}
