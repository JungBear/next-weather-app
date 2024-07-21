import { useEffect, useState } from "react";


export default function TimeWeather(){
    const [ViewList, setViewList] = useState();
    const [ViewChart, setViewChart] = useState();
    const [ViewTable, setViewTable] = useState();

    const Today = new Date();

    const endDay = new Date(Today.getDay());
    const endDate = new Date(Today.getTime() + 2 * 24 * 60 * 60 * 1000); // 현재 시각으로부터 2일 후의 시각을 계산합니다.

    const timeList = [];
    
    let currentTime = Today;


    
    while (currentTime <= endDate) {
    timeList.push(currentTime.toLocaleString());
    currentTime = new Date(currentTime.getTime() + 1 * 60 * 60 * 1000);
    }

    

    // 임시데이터
    const weatherData = {
        weather: '맑음',
        temperature: 25,
        feelsLike: 27,
        precipitation: 0.2,
        precipitationProbability: 30,
        windSpeed: 5,
        windDirection: '남서',
        humidity: 70
      };


    return(
        <div>
            <h3>시간별 예보</h3>
            <button></button>
            <button></button>
            <button></button>
            
            {/* 일반 */}
            <div>
               {
                ViewList && timeList?.map((item, index) =>{
                    return(
                        <div>
                            <ul>
                                <li>시각</li>
                                <li>날씨</li>
                                <li>기온</li>
                                <li>체감온도</li>
                                <li>강수량(mm)</li>
                                <li>강수확률</li>
                                <li>바람(m/s)</li>
                                <li>습도</li>
                            </ul>
                            {`${index}시`}
                            {weatherData.weather}
                            {weatherData.temperature}
                            {weatherData.feelsLike}
                            {weatherData.precipitation}
                            {weatherData.precipitationProbability}
                            {weatherData.windSpeed}
                            {weatherData.humidity}
                        </div>
                    )
                })
               }
            </div>
            {/* 그래프 형태 */}
            <div>
                {
                    ViewChart && timeList?.map((item, index) =>{
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li>기온</li>
                            <li>강수량(mm)</li>
                            <li>강수확률</li>
                            <li>풍향풍속(m/s)</li>
                            <li>습도</li>
                        </ul>
                        {weatherData.temperature}
                        {weatherData.precipitation}
                        {weatherData.precipitationProbability}
                        {weatherData.windSpeed}
                        {weatherData.humidity}
                    })
                }
            </div>
            {/* 테이블 형태 */}
            <div>
                {
                    ViewTable && timeList.map((item,index) =>{
                        <div>
                            <h3>요일</h3>
                            <ul>
                                <li>시각</li>
                                <li>날씨</li>
                                <li>기온(체감)</li>
                                <li>강수량</li>
                                <li>강수확률</li>
                                <li>바람</li>
                                <li>습도</li>
                                <li>폭염영향</li>
                            </ul>
                            
                        </div>
                    })
                }
            </div>
            
        </div>
    )
}