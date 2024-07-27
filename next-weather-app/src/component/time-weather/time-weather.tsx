import { useEffect, useState } from "react";
import styles from './time-weather.module.css'


export default function TimeWeather(){
    const [ViewList, setViewList] = useState(true);
    const [ViewChart, setViewChart] = useState(false);
    const [ViewTable, setViewTable] = useState(false);

    const Today = new Date();
    const endDate = new Date(Today.getTime() + 2 * 24 * 60 * 60 * 1000); 
    // 현재 시각으로부터 2일 후의 시각을 계산합니다.
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

      // 이렇게 돌려도 정말 괜찮은가??
      function handleWeatherIcon(weather: string){
        if(weather === '맑음'){
            return(
                <img src="https://www.weather.go.kr/w/resources/icon/DY@64/A/Light/DB01.png"></img>
            )
        }else if(weather === '구름많음'){
            return(
                <img src="https://www.weather.go.kr/w/resources/icon/DY@64/A/Light/DB03.png"></img>
            )
        }else if(weather === '흐림'){
            return(
                <img src="https://www.weather.go.kr/w/resources/icon/DY@64/A/Light/DB04_N.png"></img>
            )
        }else if(weather === '비'){
            return(
                <img src="https://www.weather.go.kr/w/resources/icon/DY@64/A/Light/DB05.png"></img>
            )
        }
      }

      function hanldeWindIcon(){
        if(weatherData.windDirection === '남서'){
            return(
                <img src="https://www.weather.go.kr/w/resources/icon/ic_wd_48x.png" 
                style={{transform: 'rotate(135deg)', width: '30px', height: '30px'}}/>
            )
        }
      }
    

    return(
        <div>
            <div className={styles.TimeNavbar}>
                <h3>시간별 예보</h3>
                <div className={styles.Navbtn}>
                    <button onClick={()=>{ setViewList(true); setViewChart(false); setViewTable(false); }}>List</button>
                    <button onClick={()=>{ setViewList(false); setViewChart(true); setViewTable(false); }}>Chart</button>
                    <button onClick={()=>{ setViewList(false); setViewChart(false); setViewTable(true); }}>Table</button> 
                </div>    
            </div>
            
            {/* 일반 */}
            {
                ViewList &&(
                    //<div>{`${Today}`} 최저 - / 최고 -℃</div>
                    <div className={styles.ViewList}>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li>기온</li>
                            <li>체감온도</li>
                            <li>강수량<br/>(mm)</li>
                            <li>강수확률</li>
                            <li>바람<br/>(m/s)</li>
                            <li>습도</li>
                            <li>폭염영향</li>
                        </ul>
                        
                    {
                        timeList?.map((item, index) =>{
                            return(
                                <div className={styles.ViewListDetail}>
                                    <ul>
                                        <li>{`${index%24}시`}</li>
                                        <li>{handleWeatherIcon(weatherData.weather)}</li>
                                        <li>{`${weatherData.temperature}℃`}</li>
                                        <li>{`${weatherData.feelsLike}℃`}</li>
                                        <li className={styles.precipitation}>{weatherData.precipitation}</li>
                                        <li>{`${weatherData.precipitationProbability}%`}</li>
                                        <li>
                                            <span>{hanldeWindIcon()}</span> <br/>
                                            <span>{weatherData.windSpeed}</span>
                                        </li>
                                        <li>{`${weatherData.humidity}%`}</li>
                                    </ul>

                                </div>
                            )
                        })
                    }
                    </div>
                )
            }
            
            {/* 그래프 형태 */}
            {
                ViewChart&&(
                    <div className={styles.ViewChart}>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li>기온</li>
                            <li>강수량<br/>(mm)</li>
                            <li>강수확률</li>
                            <li>풍향풍속<br/>(m/s)</li>
                            <li>습도</li>
                        </ul>
                    {
                        ViewChart === true && timeList?.map((item, index) =>{
                            return(
                                <div className={styles.ViewChartDetail}>
                                    <ul>
                                        <li>{`${index%24}시`}</li>
                                        <li>{handleWeatherIcon(weatherData.weather)}</li>
                                        <li>{`${weatherData.temperature}℃`}</li>
                                        <li>{weatherData.precipitation}</li>
                                        <li>{`${weatherData.precipitationProbability}%`}</li>
                                        <li>{weatherData.windSpeed}</li>
                                        <li>{`${weatherData.humidity}%`}</li>
                                    </ul>
                                </div>    
                            )
                        }) 
                    }
                    </div>
                )
            }

            {/* 테이블 형태 */}
            <div>
                {
                    ViewTable === true && timeList.map((item,index) =>{
                        return(
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
                        )
                        
                    })
                }
            </div>
            
        </div>
    )
}