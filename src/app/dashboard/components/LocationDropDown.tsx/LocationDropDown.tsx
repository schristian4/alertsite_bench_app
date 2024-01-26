import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../../components/ui/dropdown-menu'

import { nestGroupsBy } from '@/utils/groupFunctions'
import { Button } from '../../../../components/ui/button'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { cityDataType } from '../shapes'
import { useEffect } from 'react'
import React from 'react'

export function LocationDropDown({
  dataObject,
  dropDownPosition,
  handleDropDownMenuChange,
}: {
  dataObject: cityDataType[]
  handleDropDownMenuChange: (value: any) => void
  dropDownPosition: any
}) {
  let siteObject = nestGroupsBy(dataObject, ['obj_location', 'device_descrip'])

  let locationKeyArray = Object.keys(siteObject)
  let siteKeyArray = Object.keys(siteObject[locationKeyArray[0]])
  const CreateDropDownItemList = () => {
    const DropDownItem = locationKeyArray.map((locationID: string, index: number) => {
      let locationName = siteObject[locationID][siteKeyArray[0]]
        ? siteObject[locationID][siteKeyArray[0]][0].location_descrip
        : 'No Location Name'

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
          {dataObject.length > 0 && dataObject[dropDownPosition] === undefined
            ? dataObject[0].location_descrip
            : siteObject[dropDownPosition][siteKeyArray[0]][0].location_descrip}
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
