export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;

  const urls = {
    tenders: 'https://apiprd.eprocure.gov.pk/websiteportal/publicportal/1.0.0/api/v1/publicportal/getallpublictenders',
    documents: 'https://apiprd.eprocure.gov.pk/websiteportal/publicportal/1.0.0/api/v1/publicportal/getallpublisheddocumentdetailbypdid',
    download: 'https://apiprd.eprocure.gov.pk/documentmanagementsystem/dmspublicapi/1.0.0/api/v1/dmspublicapi/downloadportalfilebyguid',
  };

  if (!urls[endpoint]) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  try {
    const response = await fetch(urls[endpoint], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic YWRtaW46cHByYTEy',
        'officedetail': 'Sindh-PPRA-Dev',
        'origin': 'https://portalsindh.eprocure.gov.pk',
        'referer': 'https://portalsindh.eprocure.gov.pk/',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', detail: err.message });
  }
}
