

import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

function KakaoMap() {
  const [center, setCenter] = useState({ lat: 33.5563, lng: 126.79581 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          setIsLoading(false);
        },
        (error) => {
          console.error(error);
          setIsLoading(false);
        }
      );
    } else {
      
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Map level={13} center={center} style={{ width: "500px", height: "600px" }}>
      <MapMarker position={center} />
    </Map>
  );
}

export default KakaoMap;
