import { useState } from "react";
import styles from './time-weather.module.css'
import Image from "next/image";

export default function TimeWeather() {
    const [view, setView] = useState('list');

    function handleViewChange(viewState:string) {
        setView(viewState);
    }

    const Today = new Date();
    const formatTodayHour = Number(Today.getHours());
    const formatTodayDay = (day:number) => {
        const Days = ['일', '월', '화', '수', '목', '금', '토'];
        return Days[day];
    };

    const targetDate = new Date();
    targetDate.setDate(Today.getDate() + 5);
    targetDate.setHours(0, 0, 0, 0);

    // 날짜와 시간 정보를 통합하여 계산
    const dateTimeList = [];
    
    for (let i = 0; i < 5; i++) {
        const baseDate = new Date(Today);
        baseDate.setDate(Today.getDate() + i);
        
        for (let hour = 0; hour < 24; hour++) {
            const dateTime = new Date(baseDate);
            dateTime.setHours(hour);
            dateTimeList.push(dateTime);
        }
    }

    // 임시 데이터
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

    function handleWeatherIcon(weather: string) {
        const weatherIcons: { [key: string]: string } = {
            '맑음': '/img/sunny.png',
            '구름많음': '/img/smallCloud.png',
            '흐림': '/img/cloudy.png',
            '비': '/img/rainy.png'
        };
        return <Image src={weatherIcons[weather]} alt="" width={50} height={50} />;
    }

    function handleWindIcon(){
        if(weatherData.windDirection === '남서'){
            return(
                <img src="https://www.weather.go.kr/w/resources/icon/ic_wd_48x.png" 
                style={{transform: 'rotate(135deg)', width: '30px', height: '30px'}}/>
            )
        }
    }

    return (
        <div>
            <div className={styles.TimeNavbar}>
                <h3>시간별 예보</h3>
                <div className={styles.Navbtn}>
                    <Image src="/img/View_mode_1.png" alt="" onClick={() => handleViewChange('list')} width={30} height={30} />
                    <Image src="/img/View_mode_2.png" alt="" onClick={() => handleViewChange('chart')} width={30} height={30} />
                    <Image src="/img/View_mode_3.png" alt="" onClick={() => handleViewChange('table')} width={30} height={30} />
                </div>
            </div>

            {/* 일반 */}
            {view === 'list' && (
                <div className={styles.ViewList}>
                    <div>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li>기온</li>
                            <li>체감온도</li>
                            <li>강수량<br />(mm)</li>
                            <li>강수확률</li>
                            <li>바람<br />(m/s)</li>
                            <li>습도</li>
                            <li>폭염영향</li>
                        </ul>
                    </div>
                    <div className={styles.ViewListDetail}>
                        {dateTimeList.map((dateTime, index) => (
                            <div>
                                {dateTime.getHours() % 24 === 0 &&(
                                    <div className={styles.floatBox}>
                                        <p className={styles.floatDate}>{`${dateTime.getDate()}일(${formatTodayDay(dateTime.getDay())})`}</p>
                                        <p>{`최저 - / 최고 -℃`}</p>
                                    </div>
                                    )
                                }
                                
                                <div className={styles.ViewListTimeDetail}>
                                    <div>
                                        <ul>
                                            <li>{`${dateTime.getHours()}시`}</li>
                                            <li>{handleWeatherIcon(weatherData?.weather)}</li>
                                            <li>
                                                
                                                {`${weatherData.temperature}℃`}
                                            </li>
                                            <li>{`${weatherData.feelsLike}℃`}</li>
                                            <li className={styles.precipitation}>{weatherData.precipitation}</li>
                                            <li>{`${weatherData.precipitationProbability}%`}</li>
                                            <li>
                                                {handleWindIcon()} <br />
                                                <span>{weatherData.windSpeed}</span>
                                            </li>
                                            <li>{`${weatherData.humidity}%`}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 그래프 형태 */}
            {view === 'chart' && (
                <div className={styles.ViewChart}>
                    <div>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li>기온</li>
                            <li>강수확률</li>
                            <li>풍향풍속<br />(m/s)</li>
                            <li>습도</li>
                        </ul>
                    </div>
                    <div className={styles.ViewChartDetail}>
                        {dateTimeList.map((dateTime, index) => (
                            <div>
                                {dateTime.getHours() % 24 === 0 &&(
                                    <div className={styles.floatBox}>
                                        <p className={styles.floatDate}>{`${dateTime.getDate()}일(${formatTodayDay(dateTime.getDay())})`}</p>
                                        <p>{`최저 - / 최고 -℃`}</p>
                                    </div>
                                    )
                                }
                                <ul>
                                    <li>{`${dateTime.getHours()}시`}</li>
                                    <li>{handleWeatherIcon(weatherData?.weather)}</li>
                                    <li>{`${weatherData.temperature}℃`}</li>
                                    <li>{`${weatherData.precipitationProbability}%`}</li>
                                    <li>
                                        {handleWindIcon()} <br />
                                        <span>{weatherData.windSpeed}</span>
                                    </li>
                                    <li>{`${weatherData.humidity}%`}</li>
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* 테이블 형태 */}
            {view === 'table' && (
                <div className={styles.ViewTable}>
                    {dateTimeList.map((dateTime, index) => (
                        <div className={styles.ViewTableDetail}>
                            {dateTime.getHours() % 24 === 0 &&(
                                <div>
                                    <div className={styles.floatBox}>
                                        <h3 className={styles.floatDate}>{`${dateTime.getDate()}일(${formatTodayDay(dateTime.getDay())})`}</h3>
                                        <p>{`최저 - / 최고 -℃`}</p>
                                    </div>
                                    <div>
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
                                </div>
                            )}
                            <ul>
                                <li>{`${dateTime.getHours()}시`}</li>
                                <li>{handleWeatherIcon(weatherData?.weather)}</li>
                                <li>{`${weatherData.temperature}℃`}</li>
                                <li>{`${weatherData.feelsLike}℃`}</li>
                                <li>{weatherData.precipitation}</li>
                                <li>{`${weatherData.precipitationProbability}%`}</li>
                                <li>
                                    {handleWindIcon()} <br />
                                    <span>{weatherData.windSpeed}</span>
                                </li>
                                <li>{`${weatherData.humidity}%`}</li>
                            </ul>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
