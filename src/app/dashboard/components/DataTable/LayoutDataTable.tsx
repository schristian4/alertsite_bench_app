import React, { useContext, useState } from 'react'
import DataTable from './DataTable'

import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { createParameterArray } from '@/utils/createParameterArray'
import { getPercentage } from '@/utils/getPercentage'
import { nestGroupsBy } from '@/utils/groupFunctions'
import moment from 'moment'
import { ThemeProviderContext } from '../providers/theme-provider'
import { Columns } from './Columns'
import './circle.css'
export type UserDataObject = {
  status: JSX.Element
  major_site: string
  avail: string
  rMetric: JSX.Element
}

export type Person = {
  firstName: string
  lastName: string
  age: number
  visits: number
  progress: number
  status: 'relationship' | 'complicated' | 'single'
  createdAt: Date
  subRows?: Person[]
}

export type MonitorDataShape = {
  status: JSX.Element
  major_site: string
  avail: string
  rMetric: JSX.Element
}

const IconStatus = (avail: number) => {
  // console.log('avail', avail)
  if (avail >= 95) {
    return <i className='iconStatus icon-check justify-center relative'></i>
    // return <i className='iconStatus icon-check justify-center relative'></i>
  } else if (avail >= 75 && avail <= 95) {
    return <i className='iconStatus icon-warning justify-center align-middle relative'></i>
  } else if (avail < 75 && avail >= 0) {
    return <i className='iconStatus icon-danger  justify-center align-middle relative'></i>
  } else {
    return <></>
  }
}

export default function LayoutDataTable({
  dataObject,
  locationSelection,
  rerender,
}: {
  dataObject: any
  locationSelection: string
  rerender: Function
}) {
  const { theme } = useContext(ThemeProviderContext)

  const [showText, setShowText] = useState(false)
  if (dataObject === undefined) {
    return null
  }
  const siteObject = nestGroupsBy(dataObject, ['obj_location', 'device_descrip'])
  if (siteObject === undefined) {
    return null
  }

  const majorSiteObjectTarget = siteObject[Number(locationSelection)]
  if (majorSiteObjectTarget === undefined) {
    return null
  }

  const majorSiteNameArray: string[] = Object.keys(majorSiteObjectTarget)

  const gridEntry = (
    percentage: string | number,
    inputDate: string,
    inputTime: string,
    status: string,
    index: number
  ) => {
    let theme_mode = theme == 'light' ? ' minibar__bar_bg_light' : ' minibar__bar_bg_dark'

    let minibar__bar = 'minibar__bar' + theme_mode
    let minibar__fill = 'minibar__fill'
    if (status !== '0') {
      minibar__bar = 'minibar__bar red'
      minibar__fill = 'minibar__fill red'
    }
    percentage = percentage + '%'
    let StatusContent = status === '0' ? null : `Error Status: ${status}`

    return (
      <div key={index} className={minibar__bar}>
        <span
          className='minibar__tooltip'
          style={{
            backgroundColor: theme == 'light' ? '#eeeef4' : '#1e2840',
            borderRadius: 5,
            color: theme == 'light' ? '#96a0c0;' : '#eeeef4',
          }}
        >
          <p>Date: {moment(inputDate).local().format('YYYY-MM-DD hh:mm:ss A')}</p>
          <p>Response Time: {Number(inputTime).toFixed(3)}</p>
          {StatusContent && <p className='text-red-700 font-extrabold'>{StatusContent}</p>}
        </span>
        <div className={minibar__fill + theme_mode} style={{ height: percentage }}></div>
      </div>
    )
  }

  const createResponseTimeGrid = (
    timestampArray: object[],
    statusArray: string[],
    responseTimeArray: string | string[]
  ): {} => {
    let tempArray: any[] = []

    tempArray.push(timestampArray, responseTimeArray, statusArray)
    let inputSelection, heightPercentage

    let x = tempArray[0].map((item: any, index: number) => {
      if (tempArray[1].length > 1) {
        inputSelection = tempArray[1][index]
        let minValue = Math.min(...tempArray[1])
        let maxValue = Math.max(...tempArray[1])

        heightPercentage = ((inputSelection - minValue) * 100) / (maxValue - minValue)
        if (isNaN(heightPercentage)) {
          heightPercentage = 100
        }
      } else {
        inputSelection = tempArray[1][index]
        heightPercentage = 100
      }

      return gridEntry(heightPercentage, tempArray[0][index], tempArray[1][index], tempArray[2][index], index)
    })
    return x
  }

  const updateDataObjectNew = majorSiteNameArray.map((item: any, index: number) => {
    let avail = getPercentage(createParameterArray(Number(locationSelection), 'status', item, siteObject))

    const RenderIcon = IconStatus(avail)

    let timestamp_output = createParameterArray(Number(locationSelection), 'dt_status', item, siteObject)
    let status_output: any = createParameterArray(Number(locationSelection), 'status', item, siteObject)

    let resptime_output: any = createParameterArray(Number(locationSelection), 'resptime', item, siteObject)
    let tdResp: any = createResponseTimeGrid(timestamp_output, status_output, resptime_output)

    const RenderResponseTimeGrid = () => {
      return (
        <React.Fragment key={'tdResp' + index}>
          {tdResp.map((item: any, td_index: number) => {
            return <React.Fragment key={td_index}>{item}</React.Fragment>
          })}
        </React.Fragment>
      )
    }
    return {
      status: <>{RenderIcon}</>,
      major_site: majorSiteNameArray[index],
      avail: `${avail}%`,
      rMetric: <RenderResponseTimeGrid />,
    }
  }, [])

  function handleRerender() {
    // Show text
    setShowText(true)
    rerender()
    // Hide text after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setShowText(false)
    }, 2700)
  }

  return (
    <div className='mx-auto w-full'>
      <DataTable columns={Columns} data={updateDataObjectNew} />
      <div className='flex flex-row flex-wrap justify-between align-bottom mt-3'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant='outline'
                className='flex justify-center align-middle flex-col border-none w-[270px]'
              >
                <span>
                  <span className='text-sm text-center'>Api data is limited going back&nbsp;</span>
                  <span className={`${theme === 'light' ? 'text-blue-400' : 'text-blue-200'} text-sm`}>
                    1 hour
                  </span>
                </span>
                <div
                  className='align-middle'
                  style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <span
                    className={`${
                      theme === 'light' ? 'text-blue-400' : 'text-blue-200'
                    } text-sm font-light text-center`}
                  >
                    Last entry delay of about 1-2 hours&nbsp;
                  </span>
                </div>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delay notice:</p>
              <p>&nbsp;&nbsp;Api data is populated in batch requests. </p>
              <p>&nbsp;&nbsp;1 hour delay due to funding limitations. </p>
              {/* <p>&nbsp;&nbsp;defined by the host server 🙁</p> */}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className='text-right flex flex-row justify-end'>
          <div className=' flex flex-col flex-end justify-end h-[50px]'>
            <span className='text-sm  text-right '>{`Last Updated: ${moment().format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`}</span>
            {!showText && (
              <span className='text-sm text-right text-gray-500 h-[24px]'>Refresh to update table...</span>
            )}
            {showText ? (
              <span className='animate-fadeInOut text-sm  text-right text-gray-500 h-[24px]'>
                Refreshing data...
              </span>
            ) : (
              <span className='opacity-0 h-[0px]'>Click to refresh</span>
            )}
          </div>
          <Button onClick={handleRerender} variant={'outline'} style={{ marginLeft: 15, height: 50 }}>
            <div className='refreshButtonWrapper'>
              <span>Refresh</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  )
}
