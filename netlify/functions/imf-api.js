// Netlify Serverless Function for IMF API Proxy
// This function runs server-side, avoiding CORS issues

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

    try {
        // 쿼리 파라미터 추출
        const { indicator, country, startYear, endYear } = event.queryStringParameters || {};

        // 필수 파라미터 검증
        if (!indicator || !country || !startYear || !endYear) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ 
                    error: 'Missing required parameters: indicator, country, startYear, endYear' 
                })
            };
        }

        // IMF API URL 구성
        const imfApiUrl = `https://www.imf.org/external/datamapper/api/v1/${indicator}/${country}?periods=${startYear}-${endYear}`;

        console.log('IMF API 호출:', imfApiUrl);

        // IMF API 호출
        const response = await fetch(imfApiUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (compatible; IMF-Dashboard/1.0)'
            }
        });

        console.log('IMF API 응답 상태:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('IMF API 오류 응답:', errorText);
            throw new Error(`IMF API error: ${response.status} ${response.statusText}. ${errorText.substring(0, 200)}`);
        }

        const data = await response.json();
        console.log('IMF API 데이터:', JSON.stringify(data).substring(0, 500));

        // 성공 응답 반환
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('IMF API Proxy Error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch data from IMF API',
                message: error.message 
            })
        };
    }
};

