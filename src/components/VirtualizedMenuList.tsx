import React, { useRef, useEffect, useState } from 'react';

export const VirtualizedMenuList = (props: any) => {
  const { options, children, maxHeight, getValue } = props;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  if (!children || children.length === 0) {
    return <div style={{ padding: '8px' }}>No options</div>;
  }

  const itemHeight = 35;
  const containerHeight = Math.min(maxHeight || 300, 300);
  const totalHeight = children.length * itemHeight;

  // Calculate which items to render
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 5);
  const endIndex = Math.min(
    children.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + 5
  );

  const visibleChildren = children.slice(startIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height: containerHeight,
        overflowY: 'auto',
        position: 'relative',
      }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ position: 'absolute', top: startIndex * itemHeight, width: '100%' }}>
          {visibleChildren.map((child: any, index: number) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};