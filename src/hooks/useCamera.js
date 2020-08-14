const { useEffect, useState } = require("react");

const useCamera = () => {
  const [stream, setStream] = useState();
  const [error, setError] = useState(false);
  useEffect(() => {
    const getStream = async () => {
      try {
        if (navigator.mediaDevices.getUserMedia) {
          const videoStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          setStream(videoStream);
        }
      } catch (err) {
        setError(true);
      }
    };

    getStream();
  }, []);
  return [stream, error];
};

export default useCamera;
