import React, { useEffect, useRef } from "react";

const Camera = (props) => {
  const vidRef = useRef();
  const {
    onDragStart,
    onDragEnd,
    onDragOver,
    onRemove,
    stream,
    item: { order, id },
  } = props;

  useEffect(() => {
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

  return (
    <div
      draggable={true}
      style={{ background: `hsla(${id * 50},100%,50%,0.3)`, order }}
      onDragStart={(e) => onDragStart(e, order)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, order)}
    >
      {id}

      <button type="button" onClick={toggleFullScreen}>
        Toggle fullscreen
      </button>
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
      <span title="remove" onClick={() => onRemove(id)}>
        X
      </span>
    </div>
  );
};

export default React.memo(Camera);
