'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';
import ProductImageComponent from '@/components/product/product-image/ProductImageComponent';

interface Props {
   images: string[];
   title: string;
   className?: string;
}

const ProductMobileSlideshow = ({ images, title, className }: Props) => {
   return (
      <div className={className}>
         <Swiper
            style={{
               width: '100vw',
               height: '500px',
            }}
            pagination
            navigation={true}
            autoplay={{
               delay: 2500,
            }}
            modules={[FreeMode, Autoplay, Pagination]}
            className="mySwiper2"
         >
            {images.map((image) => (
               <SwiperSlide key={image}>
                  <ProductImageComponent
                     src={image}
                     width={600}
                     height={500}
                     alt={title}
                     className="object-fill"
                  />
               </SwiperSlide>
            ))}
         </Swiper>
      </div>
   );
};

export default ProductMobileSlideshow;
