declare module 'react-pageflip' {
  import React from 'react';

  interface HTMLFlipBookProps {
    width: number;
    height: number;
    size?: 'fixed' | 'stretch';
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    drawShadow?: boolean;
    flippingTime?: number;
    usePortrait?: boolean;
    startZIndex?: number;
    autoSize?: boolean;
    maxShadowOpacity?: number;
    showCover?: boolean;
    mobileScrollSupport?: boolean;
    clickEventForward?: boolean;
    useMouseEvents?: boolean;
    swipeDistance?: number;
    showPageCount?: boolean;
    onFlip?: (e: { data: number }) => void;
    onChangeOrientation?: (e: { data: string }) => void;
    onChangeState?: (e: { data: string }) => void;
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }

  const HTMLFlipBook: React.ForwardRefExoticComponent<
    HTMLFlipBookProps &
      React.RefAttributes<{
        pageFlip: () => {
          flip: (n: number) => void;
          flipNext: () => void;
          flipPrev: () => void;
          getCurrentPageIndex: () => number;
        };
      }>
  >;

  export default HTMLFlipBook;
}
