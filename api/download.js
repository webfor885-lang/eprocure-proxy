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
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: 'Download failed', 
        status: response.status 
      });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="tender.pdf"');
    res.setHeader('Content-Length', buffer.byteLength);
    res.send(Buffer.from(buffer));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
