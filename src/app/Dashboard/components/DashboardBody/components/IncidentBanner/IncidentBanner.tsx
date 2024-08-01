import { useDataStore } from '@/app/redux/useDataStore'
import { createParameterArray } from '@/utils/createParameterArray'
import { nestGroupsBy } from '@/utils/groupFunctions'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../../../components/ui/card'
import { useTheme } from '@/app/contexts/ThemeContexts'

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
export const IncidentBanner = () => {
  const { monitorData, setSelectedLocation } = useDataStore()

  // Check if the monitor data is empty or undefined
  if (monitorData === undefined || monitorData.length === 0) {
    return null
  }

  // Nest the monitor data by location and device
  const siteObject = nestGroupsBy(monitorData, ['obj_location', 'device_descrip'])
  if (siteObject === undefined) {
    return null
  }

  // Get the first site key position
  let LocationKeyArray = Object.keys(siteObject)
  let firstSiteKeyPosition = Object.keys(siteObject[LocationKeyArray[0]])[0]

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
          //Example Status Codes: 0 , 55, 5 , 9,  10 , 1 ,2,4
          let IncidentBannerOBject = CreateAlertItem(
            locationName,
            locationErrorCount,
            item_counter,
            locationNumberID
          )
          if (maxErrorCount <= locationErrorCount) {
            maxErrorCount = locationErrorCount
            incidentCityReturnObject.push(IncidentBannerOBject)
            item_counter++
          } else if (minErrorCount >= locationErrorCount) {
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
    <Card className='justify-center'>
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

// Create Alert Item
const CreateAlertItem = (locationName: string, count: number, index: number, location_id: number) => {
  const { theme } = useTheme()

  const { setSelectedLocation } = useDataStore()

  const lightToColors = ['to-orange-200', 'to-yellow-300', 'to-orange-400', 'to-yellow-300', 'to-orange-400']
  const darkToColors = ['to-blue-900', 'to-purple-900', 'to-blue-900', 'to-purple-900', 'to-blue-900']
  const bg_color =
    theme === 'light' ? `from-red-200 ${lightToColors[index]}` : `from-red-500 ${darkToColors[index]}`
  function handleClick() {
    setSelectedLocation(`${location_id}`)
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
