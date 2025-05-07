
declare module 'react-parallax' {
  import * as React from 'react';

  export interface ParallaxProps {
    blur?: number | { min: number; max: number };
    bgImage?: string;
    bgImageAlt?: string;
    bgImageStyle?: React.CSSProperties;
    bgStyle?: React.CSSProperties;
    className?: string;
    disabled?: boolean;
    strength?: number;
    style?: React.CSSProperties;
    contentClassName?: string;
    contentStyle?: React.CSSProperties;
    renderLayer?: (percentage: number) => React.ReactNode;
  }

  export interface ParallaxConstructor extends React.ComponentClass<ParallaxProps> {}
  
  export const Parallax: ParallaxConstructor;
}
