import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./UserView.css";

function UserView() {
  const steps = [
    {
      id: 1,
      image: "/step1.png", // Image for step 1
      instruction: "Step 1: Go straight from the entrance.", // Instruction for step 1
      //audio: "/audio/step1.mp3", // Audio for step 1
    },
    {
      id: 2,
      image: "/step2.png", // Image for step 2
      instruction: "Step 2: Turn left at the first corridor.", // Instruction for step 2
      //audio: "/audio/step2.mp3", // Audio for step 2
    },
    {
      id: 3,
      image: "/step3.png", // Image for step 3
      instruction: "Step 3: Take the stairs to the second floor.", // Instruction for step 3
      //audio: "/audio/step3.mp3", // Audio for step 3
    },
  ];

  // Function to play audio for the current step
  const playAudio = (audioFile) => {
    const audio = new Audio(audioFile);
    audio.play();
  };

  // Play audio when the slide changes
  useEffect(() => {
    playAudio(steps[0].audio); // Play audio for the first step on initial load
  }, []);

  return (
    <div className="user-view-container">
      <h1>Wayfinder Guide</h1>
      <div className="carousel-container">
        <Swiper
          direction="vertical" // Vertical swipe
          modules={[Navigation, Pagination]} // Enable navigation and pagination
          navigation // Add navigation buttons
          pagination={{ clickable: true }} // Add pagination dots
          spaceBetween={10} // Space between slides
          slidesPerView={1} // Show one slide at a time
          onSlideChange={(swiper) => {
            console.log("Slide changed to:", swiper.activeIndex);
            playAudio(steps[swiper.activeIndex].audio); // Play audio for the current step
          }}
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