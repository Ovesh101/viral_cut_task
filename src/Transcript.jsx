import React, { useState, useEffect, useRef } from "react";
import PlayPauseButton from "./PlayPauseButton";
import toast from "react-hot-toast";

const Transcript = ({ transcript }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isStopped, setIsStopped] = useState(false);
  const [editedTranscript, setEditedTranscript] = useState(transcript);
  const [editIndex, setEditIndex] = useState(null);
  const [editWord, setEditWord] = useState("");

  const inputRef = useRef(null);

  const totalDuration = transcript.reduce(
    (acc, word) => Math.max(acc, word.start_time + word.duration),
    0
  );

  useEffect(() => {
    let interval;
    if (isPlaying && !isDragging) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = prevTime + 100;
          if (newTime >= totalDuration) {
            clearInterval(interval);
            setIsPlaying(false);
            setIsStopped(true);
            return totalDuration;
          }
          return newTime;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isDragging, totalDuration]);

  const play = () => {
    if (isStopped) {
      setCurrentTime(0);
      setIsStopped(false);
    }
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const stop = () => {
    setIsPlaying(false);
    setIsStopped(true);
    setCurrentTime(0);
  };

  const handleEditClick = (index) => {
    setIsPlaying(false);
    setEditIndex(index);
    setEditWord(editedTranscript[index].word);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleEditChange = (e) => {
    const { value } = e.target;
  
    if (value.trim() === "") {
      toast.error("You cannot delete a word.");
    } else if (value.includes(" ")) {
      toast.error("You cannot add spaces.");
    } else if (value.length >= 45) {
      toast.error("Word length cannot exceed 45 characters.");
    } else {
      setEditWord(value);
    }
  };

  const handleEditBlur = () => {
    if (editIndex !== null) {
      const updatedTranscript = [...editedTranscript];
      updatedTranscript[editIndex].word = editWord;
      setEditedTranscript(updatedTranscript);
      setEditIndex(null);
    }
  };

  const handleSliderChange = (e) => {
    const newTime = parseInt(e.target.value, 10);
    setCurrentTime(newTime);
  };

  const handleSliderMouseDown = () => {
    setIsDragging(true);
    setIsPlaying(false);
  };

  const handleSliderMouseUp = () => {
    setIsDragging(false);
    if (isPlaying) {
      setIsPlaying(true);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <>
      <div className="pb-[200px]">
        <div className="mt-4 w-1/2 mx-auto bg-white p-6 rounded border min-h-[90vh]">
          <div className=" flex flex-wrap">
            {editedTranscript.map(({ word, start_time, duration }, index) => (
              <span
                key={index}
                onClick={() => handleEditClick(index)}
                className={`px-1 cursor-pointer rounded h-fit ${
                  currentTime >= start_time &&
                  currentTime < start_time + duration
                    ? "bg-yellow-300 px-[5px]"
                    : ""
                }`}
              >
                {/* {true ? ( */}
                {editIndex === index ? (
                  <span className="relative h-fit">
                    <input
                      ref={inputRef}
                      type="text"
                      value={editWord}
                      onChange={handleEditChange}
                      onBlur={handleEditBlur}
                      maxLength={45}
                      className="border border-gray-300 rounded absolute inset-0 bg-transparent"
                    />
                    <span style={{ visibility: "hidden" }}>{editWord}</span>
                  </span>
                ) : (
                  word
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="py-8 px-4 fixed bottom-0 left-0 bg-[#031c33] w-full">
          <button
            onClick={stop}
            className="text-white bg-[#a584fe] hover:bg-[#9772fc] px-4 py-2 mb-4 rounded font-bold"
          >
            Restart
          </button>
          <div className="flex">
            <PlayPauseButton
              isPlaying={isPlaying}
              isStopped={currentTime >= totalDuration}
              onClick={isPlaying ? pause : play}
            />
            <input
              type="range"
              min="0"
              max={totalDuration}
              value={currentTime}
              onChange={handleSliderChange}
              onMouseDown={handleSliderMouseDown}
              onMouseUp={handleSliderMouseUp}
              className="w-full"
            />
            <div className="text-right text-sm ml-4 text-white shrink-0 self-center">
              {formatTime(currentTime)} - {formatTime(totalDuration)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Transcript;
