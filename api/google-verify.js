export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send('google-site-verification: googledf134786892bde3b.html\n');
}
