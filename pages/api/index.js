export default function handler(req, res) {
  const { method } = req
  // console.log('method', method)
  switch (method) {
    case 'GET':
      handleGet(req, res)
      break
    case 'POST':
      handlePost(req, res)
      break
    default:
      res.setHeader('Allow', ['GET', 'POST'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}
