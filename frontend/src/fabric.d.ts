declare module 'fabric' {
  export namespace fabric {
    interface Object {
      left?: number
      top?: number
      set?(options: any): void
    }

    class Canvas {
      constructor(element: string | HTMLCanvasElement, options?: any)
      add(...objects: any[]): any
      remove(...objects: any[]): any
      renderAll(): void
      setDimensions(dimensions: { width: number; height: number }): void
      getObjects(): any[]
      sendToBack(...objects: any[]): void
      dispose(): void
      on(event: string, handler: any): void
      off(event: string): void
      getWidth(): number
      getHeight(): number
      selection: boolean
      defaultCursor: string
    }
    class Line implements Object {
      constructor(points: number[], options?: any)
      set(options: any): void
      left?: number
      top?: number
    }
    class Rect implements Object {
      constructor(options?: any)
      left?: number
      top?: number
    }
    class Group implements Object {
      constructor(objects: any[], options?: any)
      left?: number
      top?: number
    }
    class Text implements Object {
      constructor(text: string, options?: any)
      left?: number
      top?: number
    }
    interface IEvent {
      pointer?: { x: number; y: number }
    }
  }
  export { fabric }
}
