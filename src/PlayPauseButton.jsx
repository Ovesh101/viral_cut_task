import React from "react";
import "./PlayPauseButton.css"; // Add this for external CSS

const PlayPauseButton = ({ isPlaying, isStopped, onClick }) => {
  return (
    <button onClick={onClick} className="focus:outline-none mr-4">
      <div className="border-2 rounded-[50%] p-2 bg-slate-800">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-blue-500 play-pause-icon"
        >
          <path
            className={`play-pause-icon ${isPlaying ? 'pause' : isStopped ? 'stop' : 'play'}`}
            d="m 8,5 v14 l10,-7 l-10,-7 z m 0,0 v 0 h0 v0 z"
          />
        </svg>
      </div>
    </button>
  );
};

export default PlayPauseButton;
