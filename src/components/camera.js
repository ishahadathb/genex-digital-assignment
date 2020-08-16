import React, { useEffect, useRef } from "react";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import { ReactComponent as FullScreenIcon } from "../assets/full-screen.svg";
import { ReactComponent as VideoIcon } from "../assets/video.svg";

const Camera = (props) => {
  const vidRef = useRef();
  const {
    onDragStart,
    onDragEnd,
    onDragOver,
    onRemove,
    stream,
    dragOrder,
    item: { order, id },
  } = props;

  useEffect(() => {
    //setup the source of video element after initial mount
    if (vidRef.current) {
      vidRef.current.srcObject = stream;
    }
  }, [stream]);

  const toggleFullScreen = async () => {
    try {
      if (vidRef.current.requestFullscreen && !document.fullscreenElement) {
        vidRef.current.parentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    } catch (err) {
      console.log(err.toString());
    }
  };

  const isDropAbleItem = dragOrder === order;

  return (
    <div
      className={`${isDropAbleItem && "dropAble"} cameraEl`}
      draggable={true}
      onDoubleClick={toggleFullScreen}
      style={{ background: `hsla(${id * 50},100%,50%,0.3)`, order }}
      onDragStart={(e) => onDragStart(e, order)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, order)}
    >
      {isDropAbleItem ? <p className="messgae">place here</p> : ""}
      <div className="panelOption">
        <div
          className="cameraInfo"
          style={{ background: `hsla(${id * 50},100%,50%,0.3)` }}
        >
          <VideoIcon className="icon" /> <span>Cam #{id}</span>
        </div>

        <div className="actionArea">
          <div
            className="fullScreen"
            onClick={toggleFullScreen}
            title="Full-screen camera"
          >
            <FullScreenIcon className="icon" />
          </div>

          <div
            className="close"
            onClick={() => onRemove(id)}
            title="Remove camera"
            alt="Close Icon"
          >
            <CloseIcon className="icon" />
          </div>
        </div>
      </div>
      {stream && (
        <video
          ref={vidRef}
          height="auto"
          width="100%"
          autoPlay
          draggable={false}
          controls={false}
        />
      )}
    </div>
  );
};

export default Camera;
