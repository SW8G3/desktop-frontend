import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./UserStyle.css";

function UserView() {
  const [started, setStarted] = useState(false);
  const steps = [
    {
      id: 1,
      image: "/step1.png",
      instruction: "Step 1: Go straight from the entrance.",
    },
    {
      id: 2,
      image: "/step2.png",
      instruction: "Step 2: Turn left at the first corridor.",
    },
    {
      id: 3,
      image: "/step3.png",
      instruction: "Step 3: Take the stairs to the second floor.",
    },
  ];

  return (
    <div className="user-view-container">
      <h1 className="guide-title">Wayfinder Guide</h1>
      {!started ? (
        <button className="start-button" onClick={() => setStarted(true)}>
          Start Guide
        </button>
      ) : (
        <div className="carousel-container">
          <Swiper
            direction="horizontal"
            modules={[Navigation, Pagination]}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
          >
            {steps.map((step) => (
              <SwiperSlide key={step.id}>
                <div className="step-content">
                  <img
                    src={step.image}
                    alt={`Step ${step.id}`}
                    className="step-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/fallback.png";
                    }}
                  />
                  <p className="step-instruction">{step.instruction}</p>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-button-next"></div>
            <div className="swiper-button-prev"></div>
          </Swiper>
        </div>
      )}
    </div>
  );
}

export default UserView;