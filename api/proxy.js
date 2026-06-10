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

  // Default body agar GET request ho test ke liye
  const defaultBodies = {
    tenders: {
      filter: {
        sortOrder: "",
        activityStatus: null,
        keywords: "",
        tenderNo: "",
        departmentName: null
      },
      loggedInUserID: 1,
      loggedInUserOfficeID: 31640,
      pagination: {
        pageNumber: "1",
        pageSize: "10",
        orderBy: "",
        orderByColumnName: "",
        approvalStatusID: 0
      }
    }
  };

  const body = (req.method === 'POST' && req.body && Object.keys(req.body).length > 0)
    ? req.body
    : defaultBodies[endpoint] || {};

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
      body: JSON.stringify(body),
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Proxy failed', detail: err.message });
  }
}
