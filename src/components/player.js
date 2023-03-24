import { useEffect } from "react";

const MiniPlayer = ({ url }) => {
  useEffect(() => {}, [url]);
  return (
    <iframe
      style={{ boxShadow: " rgba(0, 0, 0, 0.24) 0px 3px 8px" }}
      src={`https://www.youtube.com/embed/${url}?autoplay=1`}
      width="100%"
      height="200px"
      allow="autoplay;"
      loading="lazy"
      frameBorder="0"
      allowfullscreen
    />
  );
};

export default MiniPlayer;
