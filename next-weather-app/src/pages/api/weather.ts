import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nx, ny } = req.query;

  if (!nx || !ny) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const API_KEY = "P71Hw2wR%2F6MChtUK4aHJCUmtP043K7BnXAi%2Bk5oqRlaWeRF0HUmjIUg9cINiNDrGZ%2FBNov3FqppiIFI%2F7u%2FnLA%3D%3D";
  if (!API_KEY) {
    return res.status(500).json({ error: 'API key is missing' });
  }

  try {
    const currentDate = new Date();
    const base_date = currentDate.toISOString().slice(0, 10).replace(/-/g, '');
    const ultraSrtNcst_base_time = adjustUltraSrtNcstBaseTime(currentDate);
    const vilageFcst_base_time = adjustVilageFcstBaseTime(currentDate);

    console.log('Fetching weather data for:', { nx, ny, base_date, ultraSrtNcst_base_time, vilageFcst_base_time });

    // 초단기 실황 조회 (기온, 강수 형태)
    const ultraSrtNcstResponse = await axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst', {
      params: {
        serviceKey: decodeURIComponent(API_KEY),
        numOfRows: '100',
        pageNo: '1',
        base_date: base_date,
        base_time: ultraSrtNcst_base_time,
        nx: nx,
        ny: ny,
        dataType: 'JSON'
      }
    });

    console.log('UltraSrtNcst API response:', ultraSrtNcstResponse.data);

    if (!ultraSrtNcstResponse.data.response) {
      throw new Error('No response from UltraSrtNcst API');
    }

    const ultraSrtNcstItems = ultraSrtNcstResponse.data.response.body.items.item;
    const temperature = ultraSrtNcstItems.find((item: any) => item.category === 'T1H');
    const precipitation = ultraSrtNcstItems.find((item: any) => item.category === 'PTY');

    console.log('Temperature item:', temperature);
    console.log('Precipitation item:', precipitation);

    // 단기 예보 조회 (하늘 상태)
    const vilageFcstResponse = await axios.get('http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst', {
      params: {
        serviceKey: decodeURIComponent(API_KEY),
        numOfRows: '100',
        pageNo: '1',
        base_date: base_date,
        base_time: vilageFcst_base_time,
        nx: nx,
        ny: ny,
        dataType: 'JSON'
      }
    });

    console.log('VilageFcst API response:', vilageFcstResponse.data);

    if (!vilageFcstResponse.data.response) {
      throw new Error('No response from VilageFcst API');
    }

    const vilageFcstItems = vilageFcstResponse.data.response.body.items.item;
    const sky = vilageFcstItems.find((item: any) => item.category === 'SKY');

    console.log('Sky item:', sky);

    res.status(200).json({
      temperature: temperature ? temperature.obsrValue : null,
      sky: sky ? sky.fcstValue : null,
      precipitation: precipitation ? precipitation.obsrValue : null
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
}

function adjustUltraSrtNcstBaseTime(currentDate: Date) {
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();

  if (minutes < 30) {
    currentDate.setHours(hours - 1);
  }

  return currentDate.toISOString().slice(11, 13) + '00';
}

function adjustVilageFcstBaseTime(currentDate: Date) {
  const hours = currentDate.getHours();
  if (hours >= 2 && hours < 5) return '0200';
  if (hours >= 5 && hours < 8) return '0500';
  if (hours >= 8 && hours < 11) return '0800';
  if (hours >= 11 && hours < 14) return '1100';
  if (hours >= 14 && hours < 17) return '1400';
  if (hours >= 17 && hours < 20) return '1700';
  if (hours >= 20 && hours < 23) return '2000';
  return '2300';
}
