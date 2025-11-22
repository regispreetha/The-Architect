# Quick Start Guide

Get up and running with the Architectural Floor Plan Designer in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm or yarn

## Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd The-Architect

# Install all dependencies
npm install
cd frontend && npm install
cd ../backend && npm install
cd ..
```

## Running the Application

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This starts both the frontend (port 3000) and backend (port 5000) servers.

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

## First Steps

1. **Open your browser** to http://localhost:3000

2. **Draw your first wall:**
   - Click the "Wall" tool (📏 icon) in the toolbar
   - Click on the canvas to set the start point
   - Move your mouse and click again to complete the wall

3. **Add furniture:**
   - Browse the furniture library on the left
   - Drag and drop items onto your floor plan
   - Resize and rotate as needed

4. **View in 3D:**
   - Your design automatically appears in the 3D preview below
   - Use your mouse to rotate and zoom the 3D view

5. **Measure distances:**
   - Click the "Measure" tool (📐 icon)
   - Click two points to measure the distance
   - Distance is shown in feet or meters

## Common Tasks

### Save Your Project

Click the Save button (💾) in the toolbar. Your project is saved to the SQLite database.

### Export Your Design

1. Click the Export button (⬇️)
2. Choose your format:
   - **PDF** - For printing
   - **SVG** - For editing in other tools
   - **JSON** - For data integration

### Change Units

Click on the settings menu and toggle between Imperial (feet/inches) and Metric (meters).

### Use Layers

- Click on a layer in the right panel to make it active
- Click the eye icon to show/hide layers
- Click the lock icon to prevent editing

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| W | Wall tool |
| D | Door tool |
| S | Select tool |
| M | Measure tool |
| Delete | Delete selected object |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |

## Tips & Tricks

1. **Snap to Grid**: Enable snap-to-grid for precise alignment
2. **Hold Shift**: Draw perfectly straight walls
3. **Double Click**: Edit object properties
4. **Right Click**: Access context menu (coming soon)

## Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

```bash
# Change frontend port
cd frontend
VITE_PORT=3001 npm run dev

# Change backend port
cd backend
PORT=5001 npm run dev
```

### Dependencies Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules frontend/node_modules backend/node_modules
npm install
cd frontend && npm install
cd ../backend && npm install
```

### Canvas Not Showing

- Make sure your browser supports HTML5 Canvas
- Try a different browser (Chrome, Firefox, Safari recommended)
- Clear browser cache and reload

## Next Steps

- Read the full [README](README.md) for detailed features
- Check [DEVELOPMENT.md](DEVELOPMENT.md) for contributing
- Explore the example projects in the gallery (coming soon)

## Need Help?

- Check the [FAQ](README.md#faq) (coming soon)
- Open an issue on GitHub
- Join our community (coming soon)

---

Happy designing! 🏗️
