import { createParameterArray } from '@/utils/createParameterArray'
import { nestGroupsBy } from '@/utils/groupFunctions'
import React, { useContext } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { ThemeProviderContext } from '../providers/theme-provider'

//Function to Count the number of errors at each Location
function counter(targetArray: any[]): number {
  let counter = 0
  for (let i = 0; i < targetArray.length; i++) {
    if (targetArray[i] !== '0') {
      counter++
    }
  }
  return counter
}

//Create Incident Banner
export const IncidentBanner = ({
  dataObject,
  setLocationSelection,
}: {
  dataObject: any
  setLocationSelection: (value: string) => void
}) => {
  const { theme } = useContext(ThemeProviderContext)

  if (dataObject === undefined) {
    return null
  }
  const siteObject = nestGroupsBy(dataObject, ['obj_location', 'device_descrip'])
  if (siteObject === undefined) {
    return null
  }
  let LocationKeyArray = Object.keys(siteObject)

  let firstSiteKeyPosition = Object.keys(siteObject[LocationKeyArray[0]])[0]

  const createAlertItem = (locationName: string, count: number, index: number, location_id: number) => {
    const lightToColors = [
      'to-orange-200',
      'to-yellow-300',
      'to-orange-400',
      'to-yellow-300',
      'to-orange-400',
    ]
    const darkToColors = ['to-blue-900', 'to-purple-900', 'to-blue-900', 'to-purple-900', 'to-blue-900']
    const bg_color =
      theme === 'light' ? `from-red-200 ${lightToColors[index]}` : `from-red-500 ${darkToColors[index]}`
    function handleClick() {
      setLocationSelection(`${location_id}`)
    }
    return (
      <button
        className='font-semibold text-sm alert-item-wrapper rounded-md shadow-sm hover:-translate-y-1 hover:scale-105 ease-in-out delay-25 duration-300'
        onClick={handleClick}
      >
        <Card
          key={index}
          className={`flex flex-grow flex-col w-300 bg-gradient-to-r ${bg_color} flex-center p-5 gap-2 `}
        >
          <p className='text-lg font-[700]'>{locationName}</p>

          <div className='space-y-1 flex flex-grow flex-row justify-center gap-2 items-center  '>
            <p className='text-lg '>Error Count:</p>
            <p className='text-lg font-[600] text-center m-0! p-0' style={{ margin: 0 }}>
              {count}
            </p>
          </div>
        </Card>
      </button>
    )
  }

  const UpdateIncidentBanner = () => {
    let incidentCityReturnObject: JSX.Element[] = []
    let item_counter: number = 0
    let maxErrorCount = 0
    let minErrorCount = 0
    if (siteObject !== undefined && LocationKeyArray !== undefined)
      for (let i = 0; i < LocationKeyArray.length; i++) {
        let locationName = siteObject[LocationKeyArray[i]][firstSiteKeyPosition]
          ? siteObject[LocationKeyArray[i]][firstSiteKeyPosition][0].location_descrip
          : ''
        let siteKeyArray = Object.keys(siteObject[LocationKeyArray[i]])
        let locationNumberID: number = Number(LocationKeyArray[i])
        let locationErrorCount: number = 0

        siteKeyArray.map((targetMajorSite: string) => {
          return (locationErrorCount =
            locationErrorCount +
            counter(createParameterArray(locationNumberID, 'status', targetMajorSite, siteObject)))
        })
        if (locationErrorCount > 0) {
          //0 , 55, 5 , 9,  10 , 1 ,2,4
          let IncidentBannerOBject = createAlertItem(
            locationName,
            locationErrorCount,
            item_counter,
            locationNumberID
          )
          if (maxErrorCount <= locationErrorCount) {
            // console.log('maxErrorCount', maxErrorCount)
            maxErrorCount = locationErrorCount
            incidentCityReturnObject.push(IncidentBannerOBject)
            item_counter++
          } else if (minErrorCount >= locationErrorCount) {
            // console.log('minErrorCount', minErrorCount)
            minErrorCount = locationErrorCount
            item_counter--
            incidentCityReturnObject.unshift(IncidentBannerOBject)
          }
        }
      }
    return incidentCityReturnObject
  }

  const IncidentBannerContent = UpdateIncidentBanner()
  return (
    <Card className=' justify-center'>
      <CardHeader>
        <CardTitle className='flex flex-start'>Incident History Log</CardTitle>
      </CardHeader>

      <CardContent className='flex w-full flex-wrap gap-10 justify-center incident-card-container'>
        {IncidentBannerContent.map((cards, index: number) => {
          return <React.Fragment key={index}>{cards}</React.Fragment>
        })}
      </CardContent>
    </Card>
  )
}
