import type React from "react"

interface SwiperSlideProps {
  children: React.ReactNode
}

export function SwiperSlide({ children }: SwiperSlideProps) {
  return <div className="swiper-slide">{children}</div>
}
