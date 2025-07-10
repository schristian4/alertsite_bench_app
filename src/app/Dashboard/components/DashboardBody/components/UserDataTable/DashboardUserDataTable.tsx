'use client'
import React from 'react'
import DataTable from './components/DataTable'

import { useDataStore } from '@/app/redux/useDataStore'
import { getPercentage } from '@/utils/getPercentage'
import { nestGroupsBy } from '@/utils/groupFunctions'
import moment from 'moment'
import { Theme, useTheme } from '@/app/contexts/ThemeContexts'
import { LoadingUserWrapper } from '../../../LoadingWrapper/LoadingWrapper'
import { createMultiParameterArrays } from '../DataTable/methods'
import { UserLocationDropDown } from '../LocationDropdown/UserLocationDropdown'
import { Columns } from './components/Columns/Columns'
import IconStatus from './components/IconStatus/IconStatus'
import { findMinMax } from './methods'
import './styles/circle.css'

// Dashboard User Data Table component
export default function DashboardUserDataTable() {
  const { loginMonitorData, isLoginFetchMonitorLoading, loginFetchMonitorProgress, userSelectedLocation } =
    useDataStore()
  const { theme } = useTheme()

  // Check if the login monitor data is empty or undefined
  if (loginMonitorData.length === 0 || loginMonitorData == undefined) {
    return null
  }

  // Nest the login monitor data by location and device
  const dataNestedByLocationAndDevice = nestGroupsBy(loginMonitorData, ['obj_location', 'device_descrip'])

  // Get the user's selected location
  const availableLocations: string[] = Object.keys(dataNestedByLocationAndDevice)
  let userAvailableLocationSelection = availableLocations.includes(userSelectedLocation)
    ? userSelectedLocation
    : availableLocations[0]

  const userSelectedLocationMajorSiteData =
    dataNestedByLocationAndDevice[Number(userAvailableLocationSelection)]

  const userSiteNameArray: string[] = Object.keys(userSelectedLocationMajorSiteData)

  // Format the table data from the monitor data
  const formatTableFromMonitorData: MonitorDataTableShape[] = userSiteNameArray.map(
    (majorSiteName): MonitorDataTableShape => {
      const paramArrays = createMultiParameterArrays(
        Number(userAvailableLocationSelection),
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

  return (
    <LoadingUserWrapper
      isLoading={isLoginFetchMonitorLoading}
      loadingType='skeleton'
      loadingProgress={loginFetchMonitorProgress}
    >
      <div className='mx-auto w-full'>
        <div className='flex flex-row justify-between gap-5 mb-3'>
          <div className='flex flex-row items-center'>
            <h1 className='text-1xl font-semibold'>Account Monitor Table:</h1>
          </div>
          <UserLocationDropDown />
        </div>
        <DataTable columns={Columns} data={formatTableFromMonitorData} />
      </div>
    </LoadingUserWrapper>
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
          color: theme == 'light' ? '#96a0c0' : '#eeeef4',
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
