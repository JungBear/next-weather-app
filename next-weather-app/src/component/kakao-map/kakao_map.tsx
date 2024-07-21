import React, { useEffect, useRef, useState } from "react";
import { Map, MapMarker, CustomOverlayMap } from "react-kakao-maps-sdk";

interface Region {
  name: string;
  lat: number;
  lng: number;
}

interface Coordinates {
  lat: number;
  lng: number;
}

export const regions: Region[] = [
  { name: "서울", lat: 37.5665, lng: 126.9780 },
  { name: "부산", lat: 35.1796, lng: 129.0756 },
  { name: "대구", lat: 35.8714, lng: 128.6014 },
  { name: "인천", lat: 37.4563, lng: 126.7052 },
  { name: "광주", lat: 35.1601, lng: 126.8514 },
  { name: "대전", lat: 36.3504, lng: 127.3845 },
  { name: "울산", lat: 35.5384, lng: 129.3114 },
  { name: "세종", lat: 36.4801, lng: 127.2890 },
  { name: "제주", lat: 33.4996, lng: 126.5312 },
  { name: "강원도", lat: 37.8228, lng: 128.1555 },
  { name: "경기도", lat: 37.4138, lng: 127.5183 },
  { name: "충청북도", lat: 36.6357, lng: 127.4914 },
  { name: "충청남도", lat: 36.6589, lng: 126.6731 },
  { name: "경상북도", lat: 36.5760, lng: 128.5055 },
  { name: "경상남도", lat: 35.4606, lng: 128.2132 },
  { name: "전라북도", lat: 35.8203, lng: 127.1088 },
  { name: "전라남도", lat: 34.8161, lng: 126.4629 }
];

const KakaoMap: React.FC = () => {
  const [center] = useState<Coordinates>({ lat: 36.5, lng: 127.5 });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const defaultLevel = 13
  const [level,setLevel] = useState(defaultLevel)
  const mapRef = useRef<kakao.maps.Map>(null)

  const handleLevel = (type: "increase" | "decrease" )=>{
    const map = mapRef.current
    if(!map)  return
    if(type === "increase"){
      map.setLevel(map.getLevel()+1)
      setLevel(map.getLevel())
    }else{
      type === "decrease"
      map.setLevel(map.getLevel() -1)
      setLevel(map.getLevel())
    }
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setIsLoading(false);
        },
        (error: GeolocationPositionError) => {
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
    <Map 
      center={center} 
      style={{ width: "50%", height: "600px" }}
      level={defaultLevel}
      zoomable={true}
      ref={mapRef}
    >
        
      {regions.map((region) => (
        <CustomOverlayMap
          key={region.name}
          position={{ lat: region.lat, lng: region.lng }}
          yAnchor={1}
        >
          <div style={{ 
            padding: '5px', 
            background: '#fff', 
            borderRadius: '5px', 
            border: '1px solid #ccc',
            color: '#000'
          }}>
            <div style={{ fontWeight: 'bold' }}>{region.name}</div>
          </div>
        </CustomOverlayMap>
      ))}
        <p>
        <button onClick={() => handleLevel("increase")}>지도레벨 - 1</button>{" "}
        <button onClick={() => handleLevel("decrease")}>지도레벨 + 1</button>{" "}
      </p>
    </Map>
    
  );
}

export default KakaoMap;