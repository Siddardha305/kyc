import { Button, Card, CardContent, Stack, Typography } from '@mui/material'
import UploadIcon from '@mui/icons-material/UploadFile'

export default function DocCard({ id, title, state, persist }) {
  const uploaded = state.userData.docsStatus?.[id]
  const preview = state.userData.kyc?.[`doc_${id}`]
  const onChange = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target?.result
      persist(s => ({ ...s, userData: { ...s.userData, kyc: { ...s.userData.kyc, [`doc_${id}`]: data }, docsStatus: { ...s.userData.docsStatus, [id]: true } } }))
    }
    reader.readAsDataURL(file)
  }
  return (
    <Card variant="outlined">
      <CardContent>
        <Stack alignItems="center" spacing={2}>
          {uploaded && preview ? (
            <img src={preview} alt="preview" style={{ maxHeight: 140, borderRadius: 8 }}/>
          ) : (
            <UploadIcon sx={{ fontSize: 48, color: 'text.secondary' }}/>
          )}
          <Typography fontWeight={800}>{title} <Typography component="span" color="error">*</Typography></Typography>
          <Typography variant="caption" color="text.secondary">{uploaded?'File saved':'PNG, JPG up to 10MB'}</Typography>
          <Button component="label" variant={uploaded?'outlined':'contained'}>
            {uploaded?'Change File':'Choose File'}
            <input hidden type="file" accept="image/png, image/jpeg" onChange={e=>{ const f = e.target.files?.[0]; if (f) onChange(f) }}/>
          </Button>
        </Stack>
      </CardContent>
    </Card>
  )
}
