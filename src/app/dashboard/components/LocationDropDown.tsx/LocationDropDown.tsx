import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'

import { SortedLocationNameIds } from '@/lib/constants'
import React, { useCallback, useEffect } from 'react'
import { Button } from '../../../../components/ui/button'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { cityDataType } from '../shapes'
export function LocationDropDown({
  dataObject,
  dropDownPosition,
  handleDropDownMenuChange,
}: {
  dataObject: cityDataType[]
  handleDropDownMenuChange: (value: any) => void
  dropDownPosition: any
}) {
  const filterArrayByLocationId = useCallback((data: any, locationId: any) => {
    let x = data.filter((item: any) => item[0] === locationId)[0]
    if (!x) {
      x = ['No Location', 'No Location']
    }
    return { location_name: x[1], location_id: x[0] }
  }, [])

  const { location_name, location_id } = filterArrayByLocationId(SortedLocationNameIds, dropDownPosition)
  const CreateDropDownItemList = () => {
    const DropDownItem = SortedLocationNameIds.map((location: string[], index: number) => {
      let locationName = location[1]
      let locationID = location[0]
      return (
        <React.Fragment key={index}>
          <DropdownMenuRadioItem value={locationID}>{locationName}</DropdownMenuRadioItem>
        </React.Fragment>
      )
    })

    return <>{DropDownItem}</>
  }
  useEffect(() => {}, [dropDownPosition])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline'>
          {location_name} - {location_id}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-96'>
        <DropdownMenuLabel>Select a Location</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={dropDownPosition} onValueChange={handleDropDownMenuChange}>
          <ScrollArea className='h-[300px] w-[350px] rounded-md border p-4'>
            <CreateDropDownItemList />
          </ScrollArea>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
