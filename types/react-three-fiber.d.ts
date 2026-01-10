declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      planeGeometry: any;
      shaderMaterial: any;
      [key: string]: any;
    }
  }
}

export {};
