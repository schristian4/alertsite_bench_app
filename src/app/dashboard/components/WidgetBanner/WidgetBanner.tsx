import { nestGroupsBy } from '@/utils/groupFunctions'
import moment from 'moment-timezone'
import { Card, CardDescription } from '../../../../components/ui/card'
import { cityDataType } from '../shapes'
//Function to Count the number of errors at each Location
export const WidgetBanner = ({
  dataObject,
  locationSelection,
}: {
  dataObject: any
  locationSelection: string
}) => {
  if (dataObject === undefined) {
    return null
  }
  const siteObject = nestGroupsBy(dataObject, ['obj_location'])

  if (siteObject === undefined) {
    return null
  }
  const majorSiteObjectTarget = siteObject[Number(locationSelection)]
  if (majorSiteObjectTarget === undefined) {
    return null
  }

  function formatTimestamp(lastErrorTimestamp: string): string {
    let gmtMoment = moment(lastErrorTimestamp)
    let localMoment = moment(moment().format()).format('YYYY-MM-DD HH:mm:ss')

    let minutes = Math.abs(gmtMoment.diff(localMoment, 'minutes'))
    let hours = Math.abs(gmtMoment.diff(localMoment, 'hours'))
    let days = Math.abs(gmtMoment.diff(localMoment, 'days'))

    if (days >= 1) {
      return `${days} days`
    } else if (hours >= 1) {
      return `${hours} hours`
    } else {
      return `${minutes} mins`
    }
  }

  function findLastReportedError(objects: cityDataType[]) {
    const filterErrorObject = objects.filter((obj) => {
      if (obj.status !== '0') {
        return obj.dt_status
      }
    }, [])

    let momentObjects = filterErrorObject.map((object) => moment(object.dt_status))

    momentObjects.sort((a, b) => a.diff(b))
    let sortedTimestamps = momentObjects.map((m) => m.format())

    let lastErrorTimestamp = sortedTimestamps[sortedTimestamps.length - 1]

    return lastErrorTimestamp === undefined || lastErrorTimestamp === null
      ? 'No Errors'
      : formatTimestamp(lastErrorTimestamp)
  }

  function averageResponseTime(objects: cityDataType[]): number {
    const totalResponseTime = objects.reduce((sum, obj) => sum + parseFloat(obj.resptime), 0)
    return objects.length > 0 ? totalResponseTime / objects.length : 0
  }

  function averageAvailability(objects: cityDataType[]): number {
    const availableCount = objects.filter((obj) => obj.status === '0').length
    return objects.length > 0 ? (availableCount / objects.length) * 100 : 0
  }

  function errorCount(objects: cityDataType[]): number {
    return objects.filter((obj) => obj.status !== '0').length
  }

  const FindLastResponseTime = findLastReportedError(majorSiteObjectTarget)
  const AverageRespTime = averageResponseTime(majorSiteObjectTarget).toFixed(2)
  const AverageAvail = averageAvailability(majorSiteObjectTarget).toFixed(2)
  const ErrorCount = errorCount(majorSiteObjectTarget)

  return (
    <div className='flex flex-wrap w-full gap-2 justify-center '>
      <Card className='flex flex-wrap widget-card w-[24%] min-w-[220px]'>
        <div className='grid row-span-3 w-full m-5 gap-3 font-medium'>
          <p className='flex flex-start text-sm'>Last Error</p>
          <div className='flex  justify-center text-4xl' style={{ alignItems: 'center' }}>
            {ErrorCount !== 0 ? '~' : ''}
            {FindLastResponseTime}
          </div>
          <CardDescription className='flex  justify-center ' style={{ alignItems: 'center' }}>
            since last error
          </CardDescription>
        </div>
      </Card>
      <Card className='flex flex-wrap widget-card w-[24%] min-w-[220px] '>
        <div className='grid row-span-3 w-full m-5 gap-3 font-medium'>
          <p className='flex flex-start text-sm'>Average Response Time</p>
          <div className='flex justify-center text-4xl' style={{ alignItems: 'center' }}>
            {AverageRespTime}secs
          </div>
          <CardDescription className='flex  justify-center ' style={{ alignItems: 'center' }}>
            <span>over the last&nbsp;</span>
            <span className='text-blue-300'>hour</span>
          </CardDescription>
        </div>
      </Card>
      <Card className='flex flex-wrap widget-card w-[24%] min-w-[220px] '>
        <div className='grid row-span-3 w-full m-5 gap-3 font-medium'>
          <p className='flex flex-start text-sm'>Average Availability</p>
          <div className='flex  justify-center text-4xl' style={{ alignItems: 'center' }}>
            {AverageAvail}%
          </div>
          <CardDescription className='flex justify-center ' style={{ alignItems: 'center' }}>
            <span>over the last&nbsp;</span> <span className='text-blue-300'>hour</span>
          </CardDescription>
        </div>
      </Card>
      <Card className='flex flex-wrap widget-card w-[24%] min-w-[220px]'>
        <div className='grid row-span-3 w-full m-5 gap-3 font-medium'>
          <p className='flex flex-start text-sm'>Error Ratio</p>
          <div className='flex  justify-center text-4xl' style={{ alignItems: 'center' }}>
            {ErrorCount}/{majorSiteObjectTarget.length}
          </div>
          <CardDescription className='flex justify-center '>at last check</CardDescription>
        </div>
      </Card>
    </div>
  )
}
