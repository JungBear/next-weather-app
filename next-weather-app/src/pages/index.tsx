import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import KakaoMap from "@/component/kakao-map/kakao-map";
import NowWeather from "@/component/now-weather/now-weather";
import TimeWeather from "@/component/time-weather/time-weather";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div>
      <div className={styles.topSection}>
        {/* 위쪽 맵과 현재 날씨 보여주는 영역 */}
          <KakaoMap />
        <NowWeather/>
      </div>
      <div>
                {/* 시간별 예보 */}
                <TimeWeather />
      </div>
      <div>

        {/* 주간 예보 */}
      </div>
    </div>
  );
}
