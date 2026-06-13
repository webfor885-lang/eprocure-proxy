export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const response = await fetch(
      'https://apiprd.eprocure.gov.pk/documentmanagementsystem/dmspublicapi/1.0.0/api/v1/dmspublicapi/downloadportalfilebyguid',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YWRtaW46cHByYTEy',
          'officedetail': 'Sindh-PPRA-Dev',
          'origin': 'https://portalsindh.eprocure.gov.pk',
          'referer': 'https://portalsindh.eprocure.gov.pk/',
          'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ 
        error: 'Download failed', 
        status: response.status,
        detail: errText
      });
    }

    const buffer = await response.arrayBuffer();
    const byteArray = Buffer.from(buffer);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="tender.pdf"');
    res.setHeader('Content-Length', byteArray.length);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    return res.status(200).send(byteArray);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
