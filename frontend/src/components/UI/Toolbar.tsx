import {
  AppBar,
  Toolbar as MuiToolbar,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Box,
  Typography,
  Tooltip,
} from '@mui/material'
import {
  PanTool,
  Wallpaper,
  MeetingRoom,
  Window,
  SquareFoot,
  TextFields,
  GetApp,
  Save,
  Undo,
  Redo,
  GridOn,
  ZoomIn,
  ZoomOut,
} from '@mui/icons-material'

interface ToolbarProps {
  selectedTool: string
  onToolSelect: (tool: string) => void
}

export default function Toolbar({ selectedTool, onToolSelect }: ToolbarProps) {
  const handleToolChange = (_event: React.MouseEvent<HTMLElement>, newTool: string | null) => {
    if (newTool !== null) {
      onToolSelect(newTool)
    }
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <MuiToolbar variant="dense" sx={{ gap: 2 }}>
        <Typography variant="h6" component="div" sx={{ mr: 2 }}>
          Floor Plan Designer
        </Typography>

        <ToggleButtonGroup
          value={selectedTool}
          exclusive
          onChange={handleToolChange}
          size="small"
        >
          <ToggleButton value="select">
            <Tooltip title="Select">
              <PanTool />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="wall">
            <Tooltip title="Draw Wall">
              <Wallpaper />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="door">
            <Tooltip title="Add Door">
              <MeetingRoom />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="window">
            <Tooltip title="Add Window">
              <Window />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="measure">
            <Tooltip title="Measure">
              <SquareFoot />
            </Tooltip>
          </ToggleButton>
          <ToggleButton value="text">
            <Tooltip title="Add Text">
              <TextFields />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Undo">
            <IconButton size="small">
              <Undo />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo">
            <IconButton size="small">
              <Redo />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Zoom In">
            <IconButton size="small">
              <ZoomIn />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out">
            <IconButton size="small">
              <ZoomOut />
            </IconButton>
          </Tooltip>
          <Tooltip title="Toggle Grid">
            <IconButton size="small">
              <GridOn />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Save Project">
            <IconButton size="small">
              <Save />
            </IconButton>
          </Tooltip>
          <Tooltip title="Export">
            <IconButton size="small">
              <GetApp />
            </IconButton>
          </Tooltip>
        </Box>
      </MuiToolbar>
    </AppBar>
  )
}
