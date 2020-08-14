const { useEffect, useState } = require("react");

const useCamera = () => {
  const [stream, setStream] = useState();
  useEffect(() => {
    const getStream = async () => {
      if (navigator.mediaDevices.getUserMedia) {
        const videoStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(videoStream);
      }
    };

    getStream();
  }, []);
  return [stream];
};

export default useCamera;
