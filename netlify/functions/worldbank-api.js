// Netlify Serverless Function for World Bank API Proxy
// World Bank API는 무료이고 공개되어 있어 접근 제한이 없습니다

const https = require('https');

exports.handler = async (event, context) => {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // GET 요청만 허용
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    return new Promise((resolve) => {
        try {
            // 쿼리 파라미터 추출
            const { indicator, country, startYear, endYear } = event.queryStringParameters || {};

            // 필수 파라미터 검증
            if (!indicator || !country || !startYear || !endYear) {
                resolve({
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({ 
                        error: 'Missing required parameters: indicator, country, startYear, endYear' 
                    })
                });
                return;
            }

            // World Bank 지표 매핑
            const indicatorMap = {
                'NGDP_RPCH': 'NY.GDP.MKTP.KD.ZG',      // GDP 성장률 (연간 %)
                'PCPIPCH': 'FP.CPI.TOTL.ZG',          // 인플레이션율 (연간 %)
                'LUR': 'SL.UEM.TOTL.ZS',              // 실업률 (%)
                'NGDPD': 'NY.GDP.MKTP.CD',            // GDP (현재 가격, USD)
                'GDP_PCAP': 'NY.GDP.PCAP.CD',         // 1인당 GDP (현재 가격, USD)
                'BCA': 'BN.CAB.XOKA.GD.ZS'            // 경상수지 (GDP 대비 %)
            };

            // 국가 코드 매핑 (대부분 동일하지만 일부 확인 필요)
            const countryMap = {
                'US': 'USA',
                'CN': 'CHN',
                'JP': 'JPN',
                'DE': 'DEU',
                'GB': 'GBR',
                'FR': 'FRA',
                'KR': 'KOR',
                'IN': 'IND',
                'BR': 'BRA',
                'RU': 'RUS',
                'CZ': 'CZE',  // 체코
                'SK': 'SVK'   // 슬로바키아
            };

            const wbIndicator = indicatorMap[indicator] || indicator;
            const wbCountry = countryMap[country] || country;

            // World Bank API URL 구성
            // 형식: /country/{country_code}/indicator/{indicator_code}?format=json&date={start_year}:{end_year}
            const wbApiUrl = `https://api.worldbank.org/v2/country/${wbCountry}/indicator/${wbIndicator}?format=json&date=${startYear}:${endYear}`;

            console.log('World Bank API 호출:', wbApiUrl);
            console.log('파라미터:', { indicator, country, startYear, endYear, wbIndicator, wbCountry });

            const url = new URL(wbApiUrl);
            const options = {
                hostname: url.hostname,
                path: url.pathname + url.search,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'World-Bank-Economic-Dashboard/1.0'
                },
                timeout: 30000  // 30초 타임아웃
            };

            const req = https.request(options, (res) => {
                console.log('World Bank API 응답 상태:', res.statusCode, res.statusMessage);

                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        if (res.statusCode !== 200) {
                            console.error('World Bank API 오류 응답:', data.substring(0, 500));
                            resolve({
                                statusCode: 500,
                                headers,
                                body: JSON.stringify({
                                    error: 'World Bank API error',
                                    message: `HTTP ${res.statusCode}: ${res.statusMessage}`,
                                    details: data.substring(0, 200)
                                })
                            });
                            return;
                        }

                        // World Bank API는 배열 형태로 반환: [metadata, data]
                        const jsonData = JSON.parse(data);
                        
                        if (!Array.isArray(jsonData) || jsonData.length < 2) {
                            throw new Error('Invalid World Bank API response format');
                        }

                        // 데이터 추출 및 변환
                        const metadata = jsonData[0];
                        const dataArray = jsonData[1] || [];

                        // World Bank 형식을 우리 형식으로 변환
                        const transformedData = {
                            values: {}
                        };

                        dataArray.forEach(item => {
                            if (item.date && item.value !== null) {
                                const year = parseInt(item.date);
                                transformedData.values[year] = item.value;
                            }
                        });

                        console.log('World Bank API 데이터 수신 성공:', Object.keys(transformedData.values).length, '개 데이터 포인트');

                        resolve({
                            statusCode: 200,
                            headers,
                            body: JSON.stringify(transformedData)
                        });
                    } catch (parseError) {
                        console.error('JSON 파싱 오류:', parseError);
                        resolve({
                            statusCode: 500,
                            headers,
                            body: JSON.stringify({
                                error: 'Failed to parse World Bank API response',
                                message: parseError.message,
                                rawData: data.substring(0, 500)
                            })
                        });
                    }
                });
            });

            req.on('error', (error) => {
                console.error('World Bank API 요청 오류:', error);
                resolve({
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        error: 'Failed to fetch data from World Bank API',
                        message: error.message,
                        code: error.code
                    })
                });
            });

            req.on('timeout', () => {
                console.error('World Bank API 요청 시간 초과');
                req.destroy();
                resolve({
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({
                        error: 'World Bank API request timeout',
                        message: 'Request took longer than 30 seconds'
                    })
                });
            });

            req.end();

        } catch (error) {
            console.error('World Bank API Proxy Error:', error);
            resolve({
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Failed to fetch data from World Bank API',
                    message: error.message,
                    stack: error.stack
                })
            });
        }
    });
};

