import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Box, IconButton, ButtonGroup, Tooltip } from '@mui/material'
import { Visibility, Refresh, CameraAlt } from '@mui/icons-material'
import { useFloorPlanStore } from '../../store/floorPlanStore'

export default function Viewer3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationIdRef = useRef<number | null>(null)

  const { elements } = useFloorPlanStore()

  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x87ceeb)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    directionalLight.castShadow = true
    directionalLight.shadow.camera.left = -20
    directionalLight.shadow.camera.right = 20
    directionalLight.shadow.camera.top = 20
    directionalLight.shadow.camera.bottom = -20
    scene.add(directionalLight)

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(100, 100)
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      roughness: 0.8,
      metalness: 0.2,
    })
    const ground = new THREE.Mesh(groundGeometry, groundMaterial)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Grid helper
    const gridHelper = new THREE.GridHelper(100, 100, 0x888888, 0xdddddd)
    scene.add(gridHelper)

    // Animation loop
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return

      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      renderer.dispose()
      containerRef.current?.removeChild(renderer.domElement)
    }
  }, [])

  useEffect(() => {
    if (!sceneRef.current) return

    // Remove existing 3D objects (except ground and lights)
    const objectsToRemove = sceneRef.current.children.filter(
      (obj) =>
        obj instanceof THREE.Mesh &&
        obj !== sceneRef.current?.children.find(
          (child) => child instanceof THREE.Mesh && (child as any).isGround
        )
    )
    objectsToRemove.forEach((obj) => {
      if (obj instanceof THREE.Mesh) {
        sceneRef.current?.remove(obj)
        obj.geometry.dispose()
        if (Array.isArray(obj.material)) {
          obj.material.forEach((mat) => mat.dispose())
        } else {
          obj.material.dispose()
        }
      }
    })

    // Generate 3D models from 2D floor plan elements
    elements.forEach((element) => {
      if (element.type === 'wall' && element.data.start && element.data.end) {
        createWall3D(
          element.data.start,
          element.data.end,
          element.data.thickness || 6
        )
      } else if (element.type === 'furniture' && element.fabricObject) {
        createFurniture3D(element)
      } else if (element.type === 'door' && element.data.position) {
        createDoor3D(element.data.position, element.data.width || 36)
      } else if (element.type === 'window' && element.data.position) {
        createWindow3D(element.data.position, element.data.width || 36)
      }
    })
  }, [elements])

  const createWall3D = (
    start: { x: number; y: number },
    end: { x: number; y: number },
    thickness: number
  ) => {
    if (!sceneRef.current) return

    const dx = end.x - start.x
    const dy = end.y - start.y
    const length = Math.sqrt(dx * dx + dy * dy)
    const angle = Math.atan2(dy, dx)

    const wallHeight = 8 * 20 // 8 feet in pixels, convert to 3D units

    const geometry = new THREE.BoxGeometry(
      length / 20, // Convert pixels to 3D units
      wallHeight / 20,
      thickness / 20
    )

    const material = new THREE.MeshStandardMaterial({
      color: 0xf5f5dc,
      roughness: 0.7,
      metalness: 0.1,
    })

    const wall = new THREE.Mesh(geometry, material)
    wall.castShadow = true
    wall.receiveShadow = true

    // Position and rotate
    const centerX = (start.x + end.x) / 2 / 20
    const centerY = (start.y + end.y) / 2 / 20

    wall.position.set(centerX - 2, wallHeight / 40, -centerY + 2)
    wall.rotation.y = -angle

    sceneRef.current.add(wall)
  }

  const createFurniture3D = (element: any) => {
    if (!sceneRef.current || !element.fabricObject) return

    const fabricObj = element.fabricObject
    const left = fabricObj.left || 0
    const top = fabricObj.top || 0
    const width = element.data.width || 40
    const height = element.data.height || 40

    const geometry = new THREE.BoxGeometry(width / 20, 1, height / 20)
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.2,
    })

    const furniture = new THREE.Mesh(geometry, material)
    furniture.castShadow = true
    furniture.receiveShadow = true

    furniture.position.set(left / 20, 0.5, -top / 20)

    sceneRef.current.add(furniture)
  }

  const createDoor3D = (position: { x: number; y: number }, width: number) => {
    if (!sceneRef.current) return

    const doorHeight = 7 * 20 // 7 feet

    const geometry = new THREE.BoxGeometry(width / 20, doorHeight / 20, 0.2)
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b4513,
      roughness: 0.5,
      metalness: 0.3,
    })

    const door = new THREE.Mesh(geometry, material)
    door.castShadow = true
    door.receiveShadow = true

    door.position.set(position.x / 20, doorHeight / 40, -position.y / 20)

    sceneRef.current.add(door)
  }

  const createWindow3D = (position: { x: number; y: number }, width: number) => {
    if (!sceneRef.current) return

    const windowHeight = 4 * 20 // 4 feet

    const geometry = new THREE.BoxGeometry(width / 20, windowHeight / 20, 0.1)
    const material = new THREE.MeshStandardMaterial({
      color: 0x87ceeb,
      transparent: true,
      opacity: 0.5,
      roughness: 0.1,
      metalness: 0.9,
    })

    const windowMesh = new THREE.Mesh(geometry, material)
    windowMesh.castShadow = true
    windowMesh.receiveShadow = true

    windowMesh.position.set(position.x / 20, 3 + windowHeight / 40, -position.y / 20)

    sceneRef.current.add(windowMesh)
  }

  const resetCamera = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(10, 10, 10)
      controlsRef.current.reset()
    }
  }

  const switchView = (view: 'perspective' | 'top' | 'front' | 'side') => {
    if (!cameraRef.current || !controlsRef.current) return

    switch (view) {
      case 'top':
        cameraRef.current.position.set(0, 20, 0)
        break
      case 'front':
        cameraRef.current.position.set(0, 5, 20)
        break
      case 'side':
        cameraRef.current.position.set(20, 5, 0)
        break
      default:
        cameraRef.current.position.set(10, 10, 10)
    }

    controlsRef.current.update()
  }

  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
      <Box
        ref={containerRef}
        sx={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      />

      <ButtonGroup
        sx={{ position: 'absolute', top: 16, right: 16 }}
        variant="contained"
        size="small"
      >
        <Tooltip title="Reset View">
          <IconButton onClick={resetCamera} size="small">
            <Refresh />
          </IconButton>
        </Tooltip>
        <Tooltip title="Perspective View">
          <IconButton onClick={() => switchView('perspective')} size="small">
            <CameraAlt />
          </IconButton>
        </Tooltip>
        <Tooltip title="Top View">
          <IconButton onClick={() => switchView('top')} size="small">
            <Visibility />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    </Box>
  )
}
