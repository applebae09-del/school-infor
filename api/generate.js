// api/nesi.js
export default async function handler(req, res) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { endpoint, pIndex = 1, pSize = 100, ATPT_OFCDC_SC_CODE, SD_SCHUL_CODE, MLSV_YMD, AA_YMD } = req.query;
  const apiKey = process.env.NEIS_API_KEY || req.headers['x-neis-key'];

  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint parameter is required' });
  }

  try {
    let url = `https://open.neis.go.kr/hub/${endpoint}?KEY=${apiKey}&Type=json&pIndex=${pIndex}&pSize=${pSize}`;
    
    if (ATPT_OFCDC_SC_CODE) url += `&ATPT_OFCDC_SC_CODE=${ATPT_OFCDC_SC_CODE}`;
    if (SD_SCHUL_CODE) url += `&SD_SCHUL_CODE=${SD_SCHUL_CODE}`;
    if (MLSV_YMD) url += `&MLSV_YMD=${MLSV_YMD}`;
    if (AA_YMD) url += `&AA_YMD=${AA_YMD}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch NEIS API data', details: error.message });
  }
}