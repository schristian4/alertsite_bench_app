import React from 'react'
import moment from 'moment'
import { Theme } from '../../../../../contexts/ThemeContexts'
import { findMinMax } from '../../methods'

interface DataRowResponseTimeGridProps {
  timestampArray: string[]
  statusArray: string[]
  responseTimeArray: string[]
  theme: Theme
}

interface GridEntryProps {
  percentage: number
  inputDate: string
  inputTime: string
  status: string
  index: number
  theme: Theme
}

const DataRowResponseTimeGrid: React.FC<DataRowResponseTimeGridProps> = ({
  timestampArray,
  statusArray,
  responseTimeArray,
  theme,
}) => {
  const responseGridRow = timestampArray.map((timestamp, index) => {
    const responseTime = responseTimeArray[index]
    const status = statusArray[index]

    let heightPercentage: number
    if (responseTimeArray.length > 1) {
      const { minValue, maxValue } = findMinMax(responseTimeArray)
      heightPercentage = ((parseFloat(responseTime) - minValue) * 100) / (maxValue - minValue)
      if (isNaN(heightPercentage)) {
        heightPercentage = 100
      }
    } else {
      heightPercentage = 100
    }

    return (
      <React.Fragment key={index}>
        <GridEntry
          percentage={heightPercentage}
          inputDate={timestamp}
          inputTime={responseTime}
          status={status}
          index={index}
          theme={theme}
        />
      </React.Fragment>
    )
  })

  return <>{responseGridRow}</>
}

const GridEntry: React.FC<GridEntryProps> = ({ percentage, inputDate, inputTime, status, index, theme }) => {
  const isLightTheme = theme === 'light'
  const hasError = status !== '0'

  const minibarBarClass = `minibar__bar ${isLightTheme ? 'minibar__bar_bg_light' : 'minibar__bar_bg_dark'} ${
    hasError ? 'red' : ''
  }`
  const minibarFillClass = `minibar__fill ${hasError ? 'red' : ''} ${
    isLightTheme ? 'minibar__bar_bg_light' : 'minibar__bar_bg_dark'
  }`

  const tooltipStyle = {
    backgroundColor: isLightTheme ? '#eeeef4' : '#1e2840',
    borderRadius: 5,
    color: isLightTheme ? '#96a0c0' : '#eeeef4',
  }

  return (
    <div key={index} className={minibarBarClass}>
      <span className='minibar__tooltip' style={tooltipStyle}>
        {hasError && (
          <div style={{ backgroundColor: 'red', padding: 5, borderRadius: 5 }}>
            <p className='text-red-700 font-extrabold'>Error Status: {status}</p>
          </div>
        )}
        <p>Date: {moment(inputDate).local().format('YYYY-MM-DD hh:mm:ss A')}</p>
        <p>Response Time: {Number(inputTime).toFixed(3)}</p>
      </span>
      <div className={minibarFillClass} style={{ height: `${percentage}%` }}></div>
    </div>
  )
}

export default DataRowResponseTimeGrid
