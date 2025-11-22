import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Paper,
} from '@mui/material'
import { FloorPlanElement } from '../../store/floorPlanStore'

interface PropertyPanelProps {
  selectedObject: FloorPlanElement | null
}

export default function PropertyPanel({ selectedObject }: PropertyPanelProps) {
  if (!selectedObject) {
    return (
      <Paper sx={{ p: 2, m: 2 }}>
        <Typography variant="h6" gutterBottom>
          Properties
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Select an object to view its properties
        </Typography>
      </Paper>
    )
  }

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Properties
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth size="small">
          <InputLabel>Type</InputLabel>
          <Select value={selectedObject.type} label="Type" disabled>
            <MenuItem value="wall">Wall</MenuItem>
            <MenuItem value="door">Door</MenuItem>
            <MenuItem value="window">Window</MenuItem>
            <MenuItem value="furniture">Furniture</MenuItem>
            <MenuItem value="room">Room</MenuItem>
          </Select>
        </FormControl>

        {selectedObject.type === 'wall' && (
          <>
            <TextField
              label="Thickness"
              type="number"
              size="small"
              defaultValue={6}
              InputProps={{ endAdornment: 'in' }}
            />
            <TextField
              label="Height"
              type="number"
              size="small"
              defaultValue={8}
              InputProps={{ endAdornment: 'ft' }}
            />
            <FormControl fullWidth size="small">
              <InputLabel>Material</InputLabel>
              <Select defaultValue="drywall" label="Material">
                <MenuItem value="drywall">Drywall</MenuItem>
                <MenuItem value="brick">Brick</MenuItem>
                <MenuItem value="concrete">Concrete</MenuItem>
                <MenuItem value="wood">Wood</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {selectedObject.type === 'furniture' && (
          <>
            <TextField
              label="Width"
              type="number"
              size="small"
              InputProps={{ endAdornment: 'in' }}
            />
            <TextField
              label="Length"
              type="number"
              size="small"
              InputProps={{ endAdornment: 'in' }}
            />
            <TextField
              label="Rotation"
              type="number"
              size="small"
              InputProps={{ endAdornment: '°' }}
            />
          </>
        )}

        <Divider />

        <FormControl fullWidth size="small">
          <InputLabel>Layer</InputLabel>
          <Select value={selectedObject.layer} label="Layer">
            <MenuItem value="structure">Structure</MenuItem>
            <MenuItem value="furniture">Furniture</MenuItem>
            <MenuItem value="electrical">Electrical</MenuItem>
            <MenuItem value="plumbing">Plumbing</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </Paper>
  )
}
