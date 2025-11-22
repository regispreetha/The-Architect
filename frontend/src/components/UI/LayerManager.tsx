import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Chip,
} from '@mui/material'
import { Visibility, VisibilityOff, Lock, LockOpen } from '@mui/icons-material'
import { useFloorPlanStore } from '../../store/floorPlanStore'

export default function LayerManager() {
  const { layers, activeLayer, setActiveLayer, toggleLayerVisibility } = useFloorPlanStore()

  return (
    <Paper sx={{ p: 2, m: 2 }}>
      <Typography variant="h6" gutterBottom>
        Layers
      </Typography>

      <List dense>
        {layers.map((layer) => (
          <ListItem
            key={layer.id}
            sx={{
              bgcolor: activeLayer === layer.id ? 'action.selected' : 'transparent',
              borderRadius: 1,
              mb: 0.5,
              cursor: 'pointer',
            }}
            onClick={() => setActiveLayer(layer.id)}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: layer.color,
                borderRadius: 1,
                mr: 1,
              }}
            />
            <ListItemText primary={layer.name} />
            {activeLayer === layer.id && (
              <Chip label="Active" size="small" color="primary" sx={{ mr: 1 }} />
            )}
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation()
                toggleLayerVisibility(layer.id)
              }}
            >
              {layer.visible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
            <IconButton size="small">
              {layer.locked ? <Lock /> : <LockOpen />}
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Paper>
  )
}
