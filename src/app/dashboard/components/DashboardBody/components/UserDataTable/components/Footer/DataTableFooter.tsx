import { useState } from 'react'

import { useDataStore } from '@/app/redux/useDataStore'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import moment from 'moment'
import { useTheme } from '../../../../../contexts/ThemeContexts'

// Data Table Footer component
const DataTableFooter = () => {
  const { theme } = useTheme()
  const { refreshMonitorData } = useDataStore()
  const [showText, setShowText] = useState(false)
  function handleRerender() {
    // Show Refreshing data text
    setShowText(true)
    refreshMonitorData()
    // Hide text after 2 seconds (2000 milliseconds)
    setTimeout(() => {
      setShowText(false)
    }, 2700)
  }
  return (
    <div className='flex flex-row flex-wrap justify-between align-bottom mt-3'>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
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

      <RefreshStatusComponent showText={showText} handleRerender={handleRerender} />
    </div>
  )
}

const RefreshStatusComponent = ({
  showText,
  handleRerender,
}: {
  showText: boolean
  handleRerender: () => void
}) => {
  return (
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
  )
}

export default DataTableFooter
