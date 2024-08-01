import React from 'react'
import DataTable from './components/DataTable'

import { useDataStore } from '@/app/redux/useDataStore'
import { getPercentage } from '@/utils/getPercentage'
import { nestGroupsBy } from '@/utils/groupFunctions'
import moment from 'moment'
import { Theme, useTheme } from '../../../contexts/ThemeContexts'
import { LocationDropDown } from '../LocationDropdown/LocationDropdown'
import { Columns } from './components/Columns/Columns'
import DataTableFooter from './components/Footer/DataTableFooter'
import IconStatus from './components/IconStatus/IconStatus'
import { createMultiParameterArrays, findMinMax, SiteObject } from './methods'
import './styles/circle.css'
import { MonitorDataShape } from '@/lib/types'

// TODO: Review and refactor this component
// Dashboard Data Table component
export default function DashboardDataTable() {
  const { monitorData, selectedLocation } = useDataStore()
  const { theme } = useTheme()
  if (!monitorData || monitorData.length === 0) {
    return null
  }

  const dataNestedByLocationAndDevice: SiteObject<MonitorDataShape> = nestGroupsBy(monitorData, [
    'obj_location',
    'device_descrip',
  ])

  const selectedLocationMajorSiteData = dataNestedByLocationAndDevice[Number(selectedLocation)]
  if (!selectedLocationMajorSiteData) {
    throw new Error('No data found for selected location')
  }
  const majorSiteNameArray: string[] = Object.keys(selectedLocationMajorSiteData)

  const formatTableFromMonitorData: MonitorDataTableShape[] = majorSiteNameArray.map(
    (majorSiteName): MonitorDataTableShape => {
      const paramArrays = createMultiParameterArrays(
        Number(selectedLocation),
        majorSiteName,
        dataNestedByLocationAndDevice
      )
      const { status: statusArray, dt_status: timestampArray, resptime: responseTimeArray } = paramArrays

      const avail: number = getPercentage(statusArray)
      const { minValue, maxValue } = findMinMax(responseTimeArray)

      const rMetric = (
        <React.Fragment>
          {timestampArray.map((timestamp, index) => {
            const responseTime: string = responseTimeArray[index]
            const status = statusArray[index]
            const heightPercentage =
              minValue === maxValue
                ? 100
                : ((parseFloat(responseTime) - minValue) * 100) / (maxValue - minValue)

            return (
              <React.Fragment key={index}>
                {MinibarItem({
                  index,
                  theme,
                  status,
                  inputDate: timestamp,
                  inputTime: responseTime,
                  percentage: heightPercentage,
                })}
              </React.Fragment>
            )
          })}
        </React.Fragment>
      )

      return {
        status: <IconStatus statusScore={avail} />,
        major_site: majorSiteName,
        avail: `${avail.toFixed(2)}%`,
        rMetric: rMetric,
      }
    }
  )

  if (formatTableFromMonitorData.length === 0) {
    return null
  }

  return (
    <div className='mx-auto w-full'>
      <div className='flex flex-row justify-between gap-5 mb-3'>
        <div className='flex flex-row items-center'>
          <h1 className='text-1xl font-semibold'>Technical Benchmark Table:</h1>
        </div>
        <LocationDropDown />
      </div>
      <DataTable columns={Columns} data={formatTableFromMonitorData} />
      <DataTableFooter />
    </div>
  )
}

const MinibarItem = ({
  index,
  theme,
  status,
  inputDate,
  inputTime,
  percentage,
}: {
  index: number
  theme: Theme
  status: string
  inputDate: string
  inputTime: string
  percentage: string | number
}) => {
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
        <div
          style={{
            backgroundColor: status === '0' ? 'green' : 'red',
            padding: 5,
            marginTop: 2,
            borderRadius: 5,
          }}
        >
          <p className={`${status === '0' ? 'text-green-200' : 'text-red-200'}` + 'font-bold'}>
            {status === '0' ? 'No Error' : StatusContent}
          </p>
        </div>
      </span>
      <div className={minibar__fill + theme_mode} style={{ height: percentage }}></div>
    </div>
  )
}
