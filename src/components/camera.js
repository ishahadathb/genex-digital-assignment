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
    vidRef.current.srcObject = stream;
  }, [stream]);

  return (
    <div
      draggable={true}
      style={{ background: `hsla(${id * 50},100%,50%,0.3)`, order }}
      onDragStart={(e) => onDragStart(e, order)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => onDragOver(e, order)}
    >
      {id}
      <video
        ref={vidRef}
        height="auto"
        width="100%"
        autoPlay
        draggable={false}
      />
      <span title="remove" onClick={() => onRemove(id)}>
        X
      </span>
    </div>
  );
};

export default React.memo(Camera);
