import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import KakaoMap from "@/component/kakao-map/kakao_map";
import NowWeather from "@/component/now-weather/now-weather";
import axios from "axios";
import { GetServerSideProps } from "next";
import { parseStringPromise  } from 'xml2js'; // xml2js의 parseStringPromise를 사용


const inter = Inter({ subsets: ["latin"] });

interface ShortWeatherResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      dataType: string;
      items: {
        item: ShortWeatherItem[];
      };
      pageNo: number;
      numOfRows: number;
      totalCount: number;
    };
  };
}

interface ShortWeatherItem {
  baseDate: string;
  baseTime: string;
  category: string; // 어떤 종류인지
  nx: number;
  ny: number;
  obsrValue: string; // category에 맞는 수치
}

 // 일출 일몰에 대한 타입
 interface SunriseSunsetResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: SunriseSunsetItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

interface SunriseSunsetItem {
  sunrise: string;
  sunset: string;
}

interface HomeProps {
  weatherData: ShortWeatherItem[];
  sunriseSunsetData: SunriseSunsetItem[]; // 필요한 타입 정의
}

const weatherUrl = 'https://apihub.kma.go.kr/api/typ02/openApi/VilageFcstInfoService_2.0/getUltraSrtNcst';
const sunriseSunsetUrl = 'http://apis.data.go.kr/B090041/openapi/service/RiseSetInfoService/getAreaRiseSetInfo';
const weatherAuthKey = 'oRIlKky8TDqSJSpMvPw6Aw'; // 실제 인증키를 여기에 입력하세요
const sunriseSunsetAuthKey = 'yaffGNRuw48SPoAj/aHF91dtGjGx87nkQopY9gR0iMQXDo8rcfNIfeniedTYxbzSMCAQZgcwO5H/KG2J2nYOLw=='; // 실제 인증키를 여기에 입력하세요

export const getServerSideProps: GetServerSideProps = async () => {
  // 현재 날짜와 시간 가져오기
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  // API 요청에 사용할 날짜와 시간 형식 만들기
  const base_date = `${year}${month}${day}`;
  const base_time = `${hours}${minutes}`;

  const weatherParams = {
    pageNo: 1,
    numOfRows: 1000,
    dataType: 'json',
    base_date: base_date,
    base_time: base_time,
    nx: 55,
    ny: 127,
    authKey: weatherAuthKey
  };

  const sunriseSunsetParams = {
    location: '서울',
    locdate: base_date,
    ServiceKey: sunriseSunsetAuthKey
  };


 
  try {
    
    const jsonWeatherData = await axios.get<ShortWeatherResponse>(weatherUrl, { params: weatherParams });
    const weatherData = jsonWeatherData.data.response.body.items.item;

    // 일출 일몰 데이터 요청
    const sunriseSunsetResponse = await axios.get(sunriseSunsetUrl, { params: sunriseSunsetParams, responseType: 'json' });


    const item = sunriseSunsetResponse.data.response.body.items.item;
    const sunriseSunsetData = item ? [{
      sunrise: item.sunrise.trim(),
      sunset: item.sunset.trim()
    }] : [];

    return {
      props: {
        weatherData,
        sunriseSunsetData: sunriseSunsetData
      }
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        weatherData: [],
        sunriseSunsetData: []
      }
    };
  }
};


export default function Home({ weatherData, sunriseSunsetData }: HomeProps) {
  return (
    <div>
      <div className={styles.topSection}>
        {/* 위쪽 맵과 현재 날씨 보여주는 영역 */}
          <KakaoMap />
        <NowWeather weatherData={weatherData} sunriseSunsetData={sunriseSunsetData}/>
      </div>
      <div>
                {/* 시간별 예보 */}
      </div>
      <div>

        {/* 주간 예보 */}
      </div>
    </div>
  );
}
