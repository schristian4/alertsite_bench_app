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

  // console.log('majorSiteObjectTarget', majorSiteObjectTarget)
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
        <span className='minibar__tooltip'>
          <p>Date: {moment(inputDate).local().format('YYYY-MM-DD hh:mm:ss A')}</p>
          <p>Response Time: {Number(inputTime).toFixed(3)}</p>
          <p>{StatusContent}</p>
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
    let avail = getPercentage(
      createParameterArray(Number(locationSelection), 'status', majorSiteNameArray[index], siteObject)
    )
    const RenderIcon = IconStatus(avail)
    let timestamp_output = createParameterArray(
      Number(locationSelection),
      'dt_status',
      majorSiteNameArray[index],
      siteObject
    )
    let status_output: any = createParameterArray(
      Number(locationSelection),
      'status',
      majorSiteNameArray[index],
      siteObject
    )
    let resptime_output: any = createParameterArray(
      Number(locationSelection),
      'resptime',
      majorSiteNameArray[index],
      siteObject
    )
    let tdResp: any = createResponseTimeGrid(timestamp_output, status_output, resptime_output)
    const RenderResponseTimeGrid = () => {
      return (
        <React.Fragment key={index}>
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
      <div className='flex flex-row flex-wrap justify-between'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant='outline'
                className='flex justify-center flex-col mt-[10.5px] pt-2 pl-2 border-none'
                style={{ alignItems: 'flex-start' }}
              >
                <span>
                  <span>Api data is limited going back&nbsp;</span>
                  <span className={`${theme === 'light' ? 'text-blue-400' : 'text-blue-200'} `}>1 hour</span>
                </span>
                <span
                  className={`${
                    theme === 'light' ? 'text-blue-400' : 'text-blue-200'
                  } text-xs pl-3 font-light`}
                >
                  Last entry delay of about 1-2 hours&nbsp;
                </span>
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

        <div className='text-right pt-2 flex flex-row  justify-center'>
          <div className=' flex flex-col flex-end mt-[10.5px]'>
            <span className='text-sm font-semibold text-right '>{`Last Updated: ${moment().format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`}</span>
            {!showText && (
              <span className='text-sm font-semibold text-right text-gray-500 h-[24px]'>
                Refresh to update table...
              </span>
            )}
            {showText ? (
              <span className='animate-fadeInOut text-sm font-semibold text-right text-gray-500 h-[24px]'>
                Refreshing data...
              </span>
            ) : (
              <span className='opacity-0 h-[0px]'>Click to refresh</span>
            )}
          </div>
          <Button
            onClick={handleRerender}
            className='relative group rounded-lg border w-12 h-[2.85rem] border-transparent ml-2 transition-colors hover:border-gray-300  '
          >
            <span className='animate-ping absolute inline-flex left-3 top-3 h-6 w-6 rounded-lg bg-sky-100 opacity-10'></span>
            <span
              className='absolute inline-flex top-0 left-[-1px] px-3 py-3 transition-transform hover:rotate-[400deg] motion-reduce:transform-none duration-300'
              style={{ fontSize: 29 }}
            >
              &#10227;
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
