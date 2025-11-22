# Development Guide

## Architecture Overview

### Frontend Architecture

The frontend is built with React and TypeScript, using a component-based architecture:

- **Components**: Reusable UI components organized by functionality
- **Store**: Zustand for lightweight state management
- **Utils**: Helper functions for geometry, snapping, and exports
- **Data**: Static data files for furniture and materials

### State Management

We use Zustand for state management, which provides:
- Simple API with minimal boilerplate
- TypeScript support out of the box
- No context providers needed
- Easy to test and debug

### Canvas Architecture

The 2D canvas uses Fabric.js for:
- Object manipulation and rendering
- Event handling (mouse, touch)
- Layer management
- Export capabilities

### 3D Rendering

Three.js powers the 3D visualization:
- Scene management with objects and lights
- Camera controls for navigation
- Real-time rendering with WebGL
- Material and texture support

## Code Structure

### Component Hierarchy

```
App
├── Toolbar (tool selection)
├── FloorPlanCanvas (2D drawing)
│   ├── WallTool
│   ├── DoorTool
│   ├── WindowTool
│   └── MeasurementTool
├── Viewer3D (3D preview)
├── FurnitureLibrary (left sidebar)
├── PropertyPanel (right sidebar)
└── LayerManager (right sidebar)
```

### Data Flow

1. User selects a tool from Toolbar
2. Tool state is passed to FloorPlanCanvas
3. User interacts with canvas
4. Elements are added to Zustand store
5. Store updates trigger 3D viewer refresh
6. 3D models are generated from 2D elements

## Adding New Features

### Adding a New Tool

1. Create tool handler in `Canvas.tsx`:
```typescript
const setupMyNewTool = (canvas: fabric.Canvas) => {
  const handleMouseDown = (e: fabric.IEvent) => {
    // Tool logic here
  }

  canvas.on('mouse:down', handleMouseDown)
}
```

2. Add tool button to `Toolbar.tsx`

3. Update tool selection logic in `App.tsx`

### Adding New Furniture

1. Edit `frontend/src/data/furnitureData.json`
2. Add new object with dimensions and properties
3. Furniture will automatically appear in library

### Adding Export Format

1. Create export function in `backend/routes/export.js`
2. Add route handler
3. Implement format-specific logic
4. Return file with appropriate headers

## Best Practices

### TypeScript

- Define interfaces for all data structures
- Use type inference where possible
- Avoid `any` types
- Enable strict mode in tsconfig.json

### React

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use memo() for expensive computations

### Fabric.js

- Always clean up event listeners
- Dispose of objects when removing from canvas
- Use object pooling for better performance
- Render manually when needed, avoid automatic rendering

### Three.js

- Dispose of geometries and materials when removing objects
- Use instanced meshes for repeated objects
- Optimize shadow maps for performance
- Use texture atlases for multiple materials

## Testing

### Unit Tests (Coming Soon)

```bash
cd frontend
npm run test
```

### E2E Tests (Coming Soon)

```bash
cd frontend
npm run test:e2e
```

## Performance Optimization

### Canvas Performance

- Use object caching for static elements
- Minimize canvas redraws
- Use requestAnimationFrame for smooth animations
- Implement virtual scrolling for large projects

### 3D Performance

- Use level of detail (LOD) for complex models
- Implement frustum culling
- Optimize shadow maps
- Use texture compression

## Debugging

### Frontend Debugging

- Use React DevTools for component inspection
- Use Redux DevTools with Zustand middleware
- Enable Fabric.js debug mode: `canvas.renderOnAddRemove = false`

### Backend Debugging

- Use Node inspector: `node --inspect server.js`
- Enable verbose logging
- Use Postman for API testing

## Common Issues

### Issue: Canvas not rendering
**Solution**: Check if canvas container has explicit dimensions

### Issue: 3D view not updating
**Solution**: Ensure elements are properly added to store

### Issue: Snap not working
**Solution**: Verify grid size and snap settings in store

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Update documentation
5. Submit a pull request

## Code Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] No console.log statements in production code
- [ ] Components are properly typed
- [ ] Memory leaks are prevented (cleanup in useEffect)
- [ ] Performance is acceptable
- [ ] Code is documented
- [ ] Tests are written and passing

## Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fabric.js Documentation](http://fabricjs.com/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [Material-UI Documentation](https://mui.com/)
