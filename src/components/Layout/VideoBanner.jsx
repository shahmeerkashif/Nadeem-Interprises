import React from "react";
import videoBanner from "../../assets/Create_a_1520_202509040051_z6mnw.mp4";
import "./VideoBanner.css";

const VideoBanner = () => {
  return (
    <div className="video-container">
      <video
        src={videoBanner}
        autoPlay
        loop
        muted
        playsInline
        className="video-banner"
      />
      {/* Text Overlay */}
      <div className="video-text">
        <button className="bo"></button>
      </div>
    </div>
  );
};

export default VideoBanner;
