import { useEffect, useState } from "react";
import styles from './time-weather.module.css'
import Image from "next/image";
import Highcharts, { chart, Legend } from 'highcharts';
import HighchartsReact from "highcharts-react-official";


export default function TimeWeather(){
    const [view, setView] = useState('list');
    const [timeListByDate, setTimeListByDate] = useState<{ [key: string]: Date[] }>({});

    function handleViewChange(viewState : string) {
        setView(viewState);
    }
    interface ShortWeatherItem {
        baseDate: string;
        baseTime: string;
        category: string;
        nx: number;
        ny: number;
        obsrValue: string;
    }

    useEffect(() => {
        const today = new Date();
        const startHour = today.getHours();
        const todayStr = today.toISOString().split('T')[0];
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + 5); // 5일 후

        const tempTimeListByDate: { [key: string]: Date[] } = {};

        // 현재 시각 이후부터 오늘 날짜의 23:00까지 시각 추가
        let currentTime = new Date(today);
        currentTime.setMinutes(0, 0, 0); // 시각을 정각으로 설정

        while (currentTime.getDate() === today.getDate()) {
            if (currentTime.getHours() >= startHour) {
                if (!tempTimeListByDate[todayStr]) {
                    tempTimeListByDate[todayStr] = [];
                }
                tempTimeListByDate[todayStr].push(new Date(currentTime));
            }
            currentTime.setHours(currentTime.getHours() + 1);
        }

        currentTime = new Date(today); // reset currentTime to the start of today
        currentTime.setDate(today.getDate() + 1);

        // 다음 날짜부터 시각 추가
        while (currentTime <= targetDate) {
            const dateStr = currentTime.toISOString().split('T')[0];
            if (!tempTimeListByDate[dateStr]) {
                tempTimeListByDate[dateStr] = [];
            }
            tempTimeListByDate[dateStr].push(new Date(currentTime));
            currentTime.setHours(currentTime.getHours() + 1);
        }

        setTimeListByDate(tempTimeListByDate);
    }, []);
    
    const formatTodayDay = (date: Date): string => {
        const Days = ['일', '월', '화', '수','목','금','토']
        return Days[date.getDay()];
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

    // chart 
    const LineOptions: Highcharts.Options = {
        chart : { 
            type : 'line',
            height : 180,
            backgroundColor: 'rgba(255, 255, 255, 0)' ,
            margin: [ 0, 0, 0, 0]
        },
        title : { text : "" },
        legend : { enabled : false },
        tooltip : { enabled : false },
        plotOptions : {
            line : { 
                dataLabels : { 
                    enabled : true,
                    format : '{y}℃',
                    style : { fontSize : '16px', fontWeight: 'normal'},
                    align : 'center',
                    verticalAlign : 'bottom'
                },
                enableMouseTracking: false,
                lineWidth : 2
            },
        },
        xAxis : { 
            labels: { enabled : false },
            tickWidth : 0,
            gridLineWidth: 0,
            lineWidth : 0
        },
        yAxis : { 
            labels: { enabled : false },
            tickWidth : 0,
            gridLineWidth: 0,
            title: {
                text: '',
            }
        },
        credits: { enabled : false },
        series: [{
            type : "line",
            data: //임시데이터..
            [31,31,31,31,31,32,31,30,29,28,28,27,27,27,27,26,26,26,26,26,26,27,29,30,31,
                31,32,32,32,32,32,31,30,29,28,28,28,27,27,27,27,27,26,26,27,28,29,30,31,
                31,32,32,32,31,31,30,29,28,28,27,27,27,27,26,26,26,26,26,27,27,28,29,30,
                31,31,32,32,32,31,30,29,28,28,27,27,26]
        }]

    }

    const BarOptions: Highcharts.Options = {
        chart : { 
            type : 'column',
            height : 100,
            backgroundColor: 'rgba(255, 255, 255, 0)' ,
            margin: [ 0, 0, 0, 0]
        },
        title : { text : "" },
        legend : { enabled : false },
        tooltip : { enabled : false },
        plotOptions : {
            column : { 
                dataLabels : { 
                    enabled : true,
                    format : '{y}%',
                    style : { fontSize : '16px', fontWeight: 'normal'},
                    align : 'center'
                },
                
                borderWidth: 1,
                enableMouseTracking: false,
            },
        },
        xAxis : { 
            labels: { enabled : false },
            tickWidth : 0,
            gridLineWidth: 1,
        },
        yAxis : { 
            labels: { enabled : false },
            tickWidth : 0,
            gridLineWidth: 0,
            min: 0,
            max: 100
        },
        credits: { enabled : false },
        series: [{
            type : "column",
            data: //임시데이터..
            [null,null,null,null,null,null,20,20,20,20,0,0,0,0,0,0,0,0,0,0,0,30,30,30,30,
                30,30,20,0,20,0,0,20,60,20,20,0,0,0,0,0,0,0,0,0,20,20,30,30,30,30,30,30,20,
                20,20,20,20,0,0,0,0,0,0,0,0,0,20,20,20,20,30,20,20,20,20,30,30,30,20,20,20,20,
                0,0,0,0,0,0,0,20,20,0]
        }]
    }
    


    function handleWeatherIcon(weather: string){
        const weatherIcons: { [key: string]: string } = {
            '맑음': '/img/sunny.png',
            '구름많음': '/img/smallCloud.png',
            '흐림': '/img/cloudy.png',
            '비': '/img/rainy.png'
        };
        return <Image src={weatherIcons[weather]} alt="" width={55} height={55}/>;
    }

    function handleWindIcon(){
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
                    <Image src="/img/View_mode_1.png" alt="" onClick={() => handleViewChange('list')} width={30} height={30}/>
                    <Image src="/img/View_mode_2.png" alt="" onClick={() => handleViewChange('chart')} width={30} height={30}/>
                    <Image src="/img/View_mode_3.png" alt="" onClick={() => handleViewChange('table')} width={30} height={30}/>
                </div>    
            </div>
            
            {/* 일반 */}
            { view === 'list' && (
                <div className={styles.ViewList}>                        
                    <div className={styles.ViewListNav}>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li className={styles.temperature}>기온</li>
                            <li>체감온도</li>
                            <li className={styles.paddingNone}>강수량(mm)</li>
                            <li>강수확률</li>
                            <li>바람(m/s)</li>
                            <li>습도</li>
                            <li>폭염영향</li>
                        </ul>
                    </div>
                                               
                    <div className={styles.ViewListDetail}>                        
                    {Object.keys(timeListByDate).map(date =>(
                        <div>
                            <div className={styles.floatBox}>
                                <p className={styles.floatDate}>{`${new Date(date).getDate()}일(${formatTodayDay(new Date(date))})`}</p>
                                <p>{`최저 - / 최고 -℃`}</p>
                            </div>
                            <div className={styles.ViewListTimeDetail}>
                            {timeListByDate[date].map((item, index) => (
                                <div>
                                    <ul>
                                        <li>{`${item.getHours()}시`}</li>
                                        <li>{handleWeatherIcon(weatherData?.weather)}</li>
                                        <li className={styles.AddHeight}>
                                        </li>
                                        <li>{`${weatherData.feelsLike}℃`}</li>
                                        <li className={styles.precipitation}>{weatherData.precipitation}</li>
                                        <li>{`${weatherData.precipitationProbability}%`}</li>
                                        <li>
                                            <span>{handleWindIcon()}</span> <br/>
                                            <span>{weatherData.windSpeed}</span>
                                        </li>
                                        <li>{`${weatherData.humidity}%`}</li>
                                    </ul>
                                </div>
                            ))}

                            </div>
                        </div>
                    ))}
                    <div className={styles.TemperChart}>
                        <div>
                            <HighchartsReact 
                            highcharts={ Highcharts } 
                            options={ LineOptions }/>
                        </div>
                    </div> 
                    </div>
                </div>
            )}
            
            {/* 그래프 형태 */}
            { view === 'chart' && (
                <div className={styles.ViewChart}>
                    <div className={styles.ViewChartNav}>
                        <ul>
                            <li>시각</li>
                            <li>날씨</li>
                            <li className={styles.AddHeight}>기온</li>
                            <li className={styles.AddHeight}>강수량(mm)</li>
                            <li className={styles.AddHeight}>강수확률</li>
                            <li className={styles.AddHeight}>풍향풍속<br/>(m/s)</li>
                            <li>습도</li>
                        </ul>
                    </div>
                    <div className={styles.ViewChartDetail}>
                    { Object.keys(timeListByDate).map(date => (
                        <div>
                            <div className={styles.floatBox}>
                                <p className={styles.floatDate}>{`${new Date(date).getDate()}일(${formatTodayDay(new Date(date))})`}</p>
                                <p>{`최저 - / 최고 -℃`}</p>
                            </div>
                            <div className={styles.ViewChartTimeDetail}>
                            {timeListByDate[date]?.map((item, index) =>(
                                <div>
                                    <ul>
                                        <li>{`${item.getHours()}시`}</li>
                                        <li>{handleWeatherIcon(weatherData?.weather)}</li>
                                        <li className={styles.AddHeight}></li>
                                        <li className={styles.AddHeight}></li>
                                        <li className={styles.AddHeight}></li>
                                        <li>
                                            <span>{handleWindIcon()}</span> <br/>
                                            <span>{weatherData.windSpeed}</span>
                                        </li>
                                        <li>{`${weatherData.humidity}%`}</li>
                                    </ul>
                                </div>
                            ))}   
                            </div>
                        </div>   
                    ))}
                    <div className={styles.TemperChart}>
                        <div>
                            <HighchartsReact 
                            highcharts={ Highcharts } 
                            options={ LineOptions }/>
                        </div>
                    </div>
                    <div className={styles.precipChart}>
                        <HighchartsReact 
                        highcharts={ Highcharts } 
                        options={ BarOptions }/>
                    </div>
                    </div>
                    <div>
                    </div>
                </div>
            )}
            {/* 테이블 */}
            {view === 'table' && (
                <div className={styles.ViewTable}>
                    <div className={styles.ViewTableDetail}>
                        {Object.keys(timeListByDate).map(date => (
                            <div className={styles.ViewTableTimeDetail}>
                                <div className={styles.ViewTableNav}>
                                    <h3>{`${new Date(date).getDate()}일(${formatTodayDay(new Date(date))})`}</h3>
                                    <p>{`최저 - / 최고 -℃`}</p>
                                </div>
                                <div>
                                    <ul>
                                        <li>시각</li>
                                        <li>날씨</li>
                                        <li>기온(체감)</li>
                                        <li>강수량</li>
                                        <li>강수<br/>확률</li>
                                        <li>바람</li>
                                        <li>습도</li>
                                        <li>폭염<br/>영향</li>
                                    </ul>
                                </div>
                                <div>
                                {timeListByDate[date]?.map((item, index) => (
                                    <div>
                                        <ul>
                                            <li>{`${item.getHours()}시`}</li>
                                            <li>
                                                <div>
                                                    <div>{handleWeatherIcon(weatherData?.weather)}</div>
                                                    <p>{weatherData?.weather}</p>
                                                </div>
                                            </li>
                                            <li>
                                                <span>
                                                    <p>{`${weatherData.temperature}℃`}</p>
                                                    <p>{`(${weatherData.feelsLike}℃)`}</p>
                                                </span>
                                            </li>
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
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}