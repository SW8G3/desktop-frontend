import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./UserView.css";

function UserView(){ 
    const steps = [
        { 
            id: 1,
            image: "/step1.png",
            instruction: "Step 1: start at the entrance and head straight",
        },
        { 
            id: 2,
            image: "/step2.png",
            instruction: "Step 1: start at the entrance and head straight",
        },
        { 
            id: 3,
            image: "/step3.png",
            instruction: "Step 1: start at the entrance and head straight",
        },
    ];

return(
    <div className="user-view-container">
        <h1>Wayfinder Guide</h1>
        <div className="carousel-container">
            <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{clickable: true}}
            spaceBetween={10}
            slidesPerView={1}
            onSlideChange={(swiper) => console.log("Slide changed to:", swiper.activeIndex)}
            >
            {steps.map((step) => (
            <SwiperSlide key={step.id}>
            <div className="step-content">
                <img src={step.image} alt={`Step ${step.id}`} className="step-image" />
                <p className="step-instruction">{step.instruction}</p>    
                </div>
            </SwiperSlide>
            ))}
            </Swiper>
        </div>
    </div>
);
}
export default UserView;