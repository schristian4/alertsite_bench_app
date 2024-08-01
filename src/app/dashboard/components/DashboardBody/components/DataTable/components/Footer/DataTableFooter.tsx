import React from 'react'
import { useDataStore } from '@/app/redux/useDataStore'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import moment from 'moment'
import { useTheme } from '../../../../../contexts/ThemeContexts'

const DataTableFooter: React.FC = () => {
  const { theme } = useTheme()
  const { refreshMonitorData } = useDataStore()

  return (
    <div className='flex flex-row flex-wrap justify-between align-bottom mt-3'>
      <ApiInfoTooltip theme={theme} />
      <RefreshStatusComponent refreshMonitorData={refreshMonitorData} />
    </div>
  )
}

const ApiInfoTooltip: React.FC<{ theme: string }> = ({ theme }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant='outline' className='flex justify-center align-middle flex-col border-none w-[270px]'>
          <span>
            <span className='text-sm text-center'>Api data is limited going back&nbsp;</span>
            <span className={`${theme === 'light' ? 'text-blue-400' : 'text-blue-200'} text-sm`}>1 hour</span>
          </span>
          <div className='flex justify-center items-center'>
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
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

const RefreshStatusComponent: React.FC<{ refreshMonitorData: () => void }> = ({ refreshMonitorData }) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false)

  const handleRerender = () => {
    setIsRefreshing(true)
    refreshMonitorData()
    setTimeout(() => setIsRefreshing(false), 2700)
  }

  return (
    <div className='text-right flex flex-row justify-end'>
      <div className='flex flex-col flex-end justify-end h-[50px]'>
        <span className='text-sm text-right'>
          {`Last Updated: ${moment().format('MMMM Do YYYY, h:mm:ss a')}`}
        </span>
        <span
          className={`text-sm text-right text-gray-500 h-[24px] ${isRefreshing ? 'animate-fadeInOut' : ''}`}
        >
          {isRefreshing ? 'Refreshing data...' : 'Refresh to update table...'}
        </span>
      </div>
      <Button onClick={handleRerender} variant='outline' style={{ marginLeft: 15, height: 50 }}>
        <div className='refreshButtonWrapper'>
          <span>Refresh</span>
        </div>
      </Button>
    </div>
  )
}

export default DataTableFooter
