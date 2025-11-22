import { useState } from 'react'
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Paper,
  Chip,
} from '@mui/material'
import furnitureData from '../../data/furnitureData.json'

export default function FurnitureLibrary() {
  const [selectedTab, setSelectedTab] = useState(0)

  const categories = [
    'All',
    'Bedroom',
    'Living Room',
    'Dining Room',
    'Kitchen',
    'Bathroom',
    'Office',
  ]

  const filteredFurniture =
    selectedTab === 0
      ? furnitureData.furniture
      : furnitureData.furniture.filter((item) => item.category === categories[selectedTab])

  const handleDragStart = (e: React.DragEvent, furniture: any) => {
    e.dataTransfer.setData('furniture', JSON.stringify(furniture))
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ p: 2 }} elevation={0}>
        <Typography variant="h6" gutterBottom>
          Library
        </Typography>
      </Paper>

      <Tabs
        value={selectedTab}
        onChange={(_, newValue) => setSelectedTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        {categories.map((category) => (
          <Tab key={category} label={category} />
        ))}
      </Tabs>

      <List sx={{ flex: 1, overflowY: 'auto', p: 1 }}>
        <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
          Furniture
        </Typography>
        {filteredFurniture.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box sx={{ fontSize: '1.5rem', mr: 1 }}>{item.icon}</Box>
              <ListItemText
                primary={item.name}
                secondary={`${item.widthFeet}' × ${item.lengthFeet}'`}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <Typography variant="subtitle2" sx={{ px: 2, py: 1, mt: 2, color: 'text.secondary' }}>
          Doors & Windows
        </Typography>
        {furnitureData.symbols.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box sx={{ fontSize: '1.5rem', mr: 1 }}>{item.icon}</Box>
              <ListItemText primary={item.name} secondary={`${item.widthFeet}'`} />
              <Chip label={item.type} size="small" />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
