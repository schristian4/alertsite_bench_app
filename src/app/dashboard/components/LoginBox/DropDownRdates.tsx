import { ScrollArea } from '../../../../components/ui/scroll-area'

import React from 'react'
import { Button } from '../../../../components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'

export function DropDownRdates({ handleChange }: { handleChange: any }) {
  const [position, setPosition] = React.useState('LastOneHour')

  const rdates = [
    'LastOneHour',
    'LastTwoHours',
    'LastFourHours',
    'LastEightHours',
    'LastTwelveHours',
    'LastTwentyFourHours',
    'LastFortyEightHours',
    'Today',
    'Yesterday',
    'LastTwoDays',
    'LastThreeDays',
    'LastSevenDays',
    'LastEightDays',
    'ThisWeek',
    'ThisMonth',
    'LastMonth',
    'LastWeek',
    'LastBizWeek',
  ]

  function handleSelection(value: string) {
    setPosition(value)
    handleChange(value)
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-full'>
          {position}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-full'>
        <DropdownMenuLabel>Select a Location</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={handleSelection}>
          <ScrollArea className='h-[300px] rounded-md border p-4'>
            {rdates.map((rdate, index) => {
              return (
                <DropdownMenuRadioItem key={index} value={rdate}>
                  <span>{rdate}</span>
                </DropdownMenuRadioItem>
              )
            })}
          </ScrollArea>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
