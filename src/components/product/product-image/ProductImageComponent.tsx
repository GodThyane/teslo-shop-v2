'use client';

import React from 'react';
import Image from 'next/image';

interface Props {
   src?: string;
   alt: string;
   className?: React.StyleHTMLAttributes<HTMLImageElement>['className'];
   width: number;
   height: number;
   onMouseEnter?: React.MouseEventHandler<HTMLImageElement>;
   onMouseLeave?: React.MouseEventHandler<HTMLImageElement>;
}

const ProductImageComponent = ({
   src,
   alt,
   className,
   width,
   height,
   onMouseEnter,
   onMouseLeave,
}: Props) => {
   const localSrc = src
      ? src.startsWith('http')
         ? src
         : `/products/${src}`
      : '/imgs/placeholder.jpg';

   return (
      <Image
         src={localSrc}
         alt={alt}
         width={width}
         height={height}
         className={className}
         onMouseEnter={onMouseEnter}
         onMouseLeave={onMouseLeave}
      />
   );
};

export default ProductImageComponent;
