# Architectural Floor Plan Designer with 3D Preview

A comprehensive web-based application that allows architects to create detailed floor plans with real-time 3D visualization, measurement tools, and professional export capabilities.

## Features

### Core Capabilities

- **2D Floor Plan Designer**
  - Drag-and-drop wall creation with snap-to-grid
  - Room boundary detection and automatic labeling
  - Door and window placement with standard architectural symbols
  - Furniture library with scalable objects (beds, tables, appliances)
  - Precise measurement tools with imperial/metric units
  - Layer management (structure, electrical, plumbing, furniture)
  - Undo/redo functionality with version history

- **3D Visualization Engine**
  - Automatic 3D model generation from 2D floor plans
  - Configurable wall heights and room volumes
  - Texture mapping for floors, walls, and ceilings
  - Lighting simulation (natural and artificial)
  - Camera controls (orbit, pan, zoom, first-person walkthrough)
  - Multiple view modes (wireframe, solid, textured)
  - Real-time shadows and reflections

- **Professional Tools**
  - Grid system with customizable spacing
  - Dimension annotation with automatic calculation
  - Area calculation for rooms and total building space
  - Scale ruler and measurement verification
  - Professional drafting symbols library
  - Text annotation and labeling system

- **Export & Integration**
  - PDF floor plans with dimensions and annotations
  - SVG vector graphics for web use
  - JSON data export for integration
  - High-resolution renders

## Technology Stack

### Frontend
- **React.js** with TypeScript for robust component architecture
- **Three.js** for 3D rendering and visualization
- **Fabric.js** for 2D floor plan canvas manipulation
- **Material-UI** for professional interface design
- **React Router** for multi-page navigation
- **Zustand** for state management

### Backend
- **Node.js/Express** server for file management and exports
- **Better-SQLite3** database for project persistence
- **RESTful API** for floor plan data management
- **PDFKit** for PDF generation

## Project Structure

```
architectural-designer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FloorPlanCanvas/    # 2D drawing components
│   │   │   ├── ThreeD/             # 3D visualization
│   │   │   ├── UI/                 # User interface components
│   │   │   └── Library/            # Furniture and symbols
│   │   ├── utils/                  # Utility functions
│   │   ├── store/                  # State management
│   │   └── data/                   # Static data (furniture, materials)
├── backend/
│   ├── routes/                     # API routes
│   ├── models/                     # Database models
│   └── utils/                      # Backend utilities
└── public/                         # Static assets
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd The-Architect
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   cd ..
   ```

3. **Start the application**

   **Option 1: Run both frontend and backend together**
   ```bash
   npm run dev
   ```

   **Option 2: Run separately**

   Terminal 1 (Backend):
   ```bash
   cd backend
   npm run dev
   ```

   Terminal 2 (Frontend):
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Usage Guide

### Drawing Walls

1. Click the **Wall** tool from the toolbar
2. Click on the canvas to set the start point
3. Move the mouse to the desired end point
4. Click again to complete the wall
5. Walls automatically snap to grid for precise alignment

### Adding Doors and Windows

1. Select **Door** or **Window** tool from the toolbar
2. Click on the canvas where you want to place the element
3. Adjust size and rotation as needed using the property panel

### Placing Furniture

1. Browse the furniture library on the left sidebar
2. Select a category (Bedroom, Kitchen, Bathroom, etc.)
3. Drag and drop furniture items onto the canvas
4. Resize and rotate using the handles

### Measuring Distances

1. Click the **Measure** tool from the toolbar
2. Click the start point of your measurement
3. Click the end point
4. The distance is displayed automatically in feet/meters

### 3D Visualization

- The 3D view updates automatically as you draw
- Use mouse to rotate, pan, and zoom the 3D view
- Click camera buttons to switch between different views (top, front, side, perspective)
- Reset camera position using the reset button

### Exporting Your Design

1. Click the **Export** button in the toolbar
2. Choose your desired format:
   - **PDF** - For printing and presentations
   - **SVG** - For web and vector editing
   - **JSON** - For data integration

### Saving Projects

1. Click the **Save** button to save your current project
2. Projects are automatically saved to the SQLite database
3. Access saved projects from the project list

## API Endpoints

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a new project
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Elements

- `POST /api/projects/:id/elements` - Add element to project
- `DELETE /api/projects/:id/elements/:elementId` - Delete element

### Export

- `POST /api/export/pdf` - Export as PDF
- `POST /api/export/svg` - Export as SVG
- `POST /api/export/json` - Export as JSON

### Library

- `GET /api/library/furniture` - Get furniture library
- `GET /api/library/symbols` - Get architectural symbols
- `GET /api/library/materials` - Get material library

## Development Phases

### Phase 1 (Core MVP) ✅
- Basic 2D drawing tools (walls, doors, windows)
- Simple furniture library
- Real-time 3D preview
- PDF export functionality

### Phase 2 (Professional Features) - Coming Soon
- Advanced measurement tools
- Material library and texturing
- Enhanced layer management
- DWG export capability

### Phase 3 (Business Integration) - Coming Soon
- Client project management
- n8n workflow integration
- Advanced 3D rendering features
- Collaboration tools

## Keyboard Shortcuts

- `W` - Wall tool
- `D` - Door tool
- `Win` - Window tool
- `M` - Measure tool
- `T` - Text tool
- `S` - Select tool
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo
- `Ctrl+S` - Save project
- `Delete` - Delete selected object

## Performance Considerations

- Lazy loading for large furniture libraries
- WebGL optimization for smooth 3D rendering
- Progressive enhancement for different device capabilities
- Efficient canvas rendering with Fabric.js

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

## Acknowledgments

- React.js team for the amazing framework
- Three.js contributors for 3D rendering capabilities
- Fabric.js for canvas manipulation
- Material-UI for the component library

---

Built with ❤️ for architects and designers
