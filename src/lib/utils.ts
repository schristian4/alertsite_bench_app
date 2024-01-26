import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const shortLocationIds = ['10', '15', '18', '19', '20', '22', '25', '28', '30', '31', '33']
export const LocationIds = [
  '10',
  '15',
  '18',
  '19',
  '20',
  '22',
  '25',
  '28',
  '30',
  '31',
  '33',
  '35',
  '40',
  '42',
  '43',
  '45',
  '47',
  '49',
  '50',
  '52',
  '53',
  '55',
  '56',
  '60',
  '62',
  '63',
  '65',
  '67',
  '69',
  '70',
  '71',
  '72',
  '73',
  '74',
  '75',
  '80',
  '82',
  '85',
  '90',
  '91',
  '93',
  '94',
  '95',
  '4010',
  '4020',
  '5010',
  '5020',
  '5030',
  '5040',
  '5050',
  '5060',
  '5070',
  '5080',
  '5090',
  '5110',
  '5120',
  '5130',
  '5140',
  '5150',
  '5160',
  '5170',
  '6010',
  '6020',
  '6030',
  '6040',
  '6050',
  '6060',
  '6070',
  '6080',
  '6110',
  '6120',
  '7010',
  '7020',
  '7030',
  '7040',
  '7050',
  '8010',
  '8020',
]

export const shortLocationNameIds = [
  ['10', 'Fort Lauderdale, FL'],
  ['15', 'Montreal, Quebec'],
  ['18', 'Tampa, FL'],
  ['19', 'Miami, FL'],
  ['20', 'Atlanta, GA'],
  ['22', 'Charlotte, NC'],
  ['25', 'Vancouver, British Columbia'],
  ['28', 'Calgary, Alberta'],
  ['30', 'Fremont, CA'],
  ['31', 'San Francisco, CA'],
  ['33', 'Portland, OR'],
]

export const LocationNameIds = [
  ['10', 'Fort Lauderdale, FL'],
  ['15', 'Montreal, Quebec'],
  ['18', 'Tampa, FL'],
  ['19', 'Miami, FL'],
  ['20', 'Atlanta, GA'],
  ['22', 'Charlotte, NC'],
  ['25', 'Vancouver, British Columbia'],
  ['28', 'Calgary, Alberta'],
  ['30', 'Fremont, CA'],
  ['31', 'San Francisco, CA'],
  ['33', 'Portland, OR'],
  ['35', 'Seattle, WA'],
  ['40', 'Washington, D.C.'],
  ['42', 'Los Angeles, CA - Level3'],
  ['43', 'Los Angeles, CA - NextLink'],
  ['45', 'Denver, CO'],
  ['47', 'Salt Lake City, UT'],
  ['49', 'San Diego, CA'],
  ['50', 'Chicago, IL - Tata'],
  ['52', 'Chicago, IL - LeaseWeb'],
  ['53', 'Kansas City, KS'],
  ['55', 'Cincinnati, OH'],
  ['56', 'Cleveland, OH'],
  ['60', 'Dallas, TX - LeaseWeb'],
  ['62', 'Las Vegas, NV'],
  ['63', 'Austin, TX'],
  ['65', 'Phoenix, AZ'],
  ['67', 'Dallas, TX'],
  ['69', 'New York, NY - LeaseWeb'],
  ['70', 'New York, NY - Peer1'],
  ['71', 'Newark, NJ - NLayer'],
  ['72', 'Boston, MA'],
  ['73', 'Boston, MA - Expedient'],
  ['74', 'Worcester, MA'],
  ['75', 'St. Louis, MO'],
  ['80', 'Toronto, Ontario'],
  ['82', 'Minneapolis, MN'],
  ['85', 'Detroit, MI'],
  ['90', 'Philadelphia, PA - AboveNet'],
  ['91', 'Philadelphia, PA - XO'],
  ['93', 'Pittsburgh, PA'],
  ['94', 'Memphis, TN'],
  ['95', 'Houston, TX'],
  ['4010', 'Sao Paulo, Brazil'],
  ['4020', 'Buenos Aires, Argentina'],
  ['5010', 'London, UK - AboveNet'],
  ['5020', 'Frankfurt, Germany'],
  ['5030', 'Madrid, Spain'],
  ['5040', 'Dublin, Ireland'],
  ['5050', 'Amsterdam, The Netherlands'],
  ['5060', 'Manchester, UK'],
  ['5070', 'Birmingham, UK'],
  ['5080', 'Paris, France'],
  ['5090', 'Copenhagen, Denmark'],
  ['5110', 'Stockholm, Sweden'],
  ['5120', 'Munich, Germany'],
  ['5130', 'London, UK - Docklands'],
  ['5140', 'Brussels, Belgium'],
  ['5150', 'Milan, Italy'],
  ['5160', 'Siauliai, Lithuania'],
  ['5170', 'Zurich, Switzerland'],
  ['6010', 'Singapore'],
  ['6020', 'Hong Kong'],
  ['6030', 'Shanghai, China'],
  ['6040', 'Mumbai, India'],
  ['6050', 'Tokyo, Japan'],
  ['6060', 'Tel Aviv, Israel'],
  ['6070', 'Beijing, China'],
  ['6080', 'Seoul, South Korea'],
  ['6110', 'New Delhi, India'],
  ['6120', 'Kuala Lumpur, Malaysia'],
  ['7010', 'Sydney, Australia'],
  ['7020', 'Perth, Australia'],
  ['7030', 'Brisbane, Australia'],
  ['7040', 'Sydney, Australia - Equinix'],
  ['7050', 'Auckland, New Zealand'],
  ['8010', 'Cape Town, South Africa'],
  ['8020', 'Bahrain'],
]