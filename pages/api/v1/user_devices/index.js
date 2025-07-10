/**
 * Fetches all user devices from AlertSite Account
 * @param {object} req - The request object
 * @param {object} res - The response object
 * @returns {Promise<Response>} The fetch response
 */

async function fetchUserDevices(req, res) {
  // Extract query parameters
  let { email, password, customerID } = req.query

  // Validate required parameters
  if (!email || !password || !customerID) {
    return res.status(400).json({
      error: 'Missing required parameters',
      message: 'Please provide email, password, and customerID',
    })
  }

  // Parse password (assuming it's a JSON string)
  const parsedPassword = JSON.parse(password)

  // Create base64 encoded credentials
  const credentials = `${email}:${parsedPassword}`
  const encodedCredentials = Buffer.from(credentials).toString('base64')
  const authHeader = `Basic ${encodedCredentials}`

  // Construct API URL
  const apiVersion = '2'
  const format = 'json'
  const apiUrl = `https://www.alertsite.com/report-api/sitestatus/${customerID}?api_version=${apiVersion}&format=${format}`

  try {
    // Fetch monitor data
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch monitor data: ${response.statusText}`)
    }

    return response
  } catch (error) {
    console.error('Error fetching user devices:', error)
    throw error
  }
}

// user_devices | /api/v1/user_devices
export default async function handler(req, res) {
  try {
    const data = await fetchUserDevices(req, res).then((data) => data.json())
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    })
  }
}
