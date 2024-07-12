import React from 'react'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { DropDownRdates } from './DropDownRdates'

export function DialogLoginBox({
  handleSubmitParams,
  setUserInput,
  userInput,
}: {
  handleSubmitParams: (value: any) => void
  setUserInput: React.Dispatch<
    React.SetStateAction<{
      username: string
      password: string
    }>
  >
  userInput: any
}) {
  const handleChange = (e: any) => {
    const name = e.target.name
    const value = e.target.value
    setUserInput((prev) => {
      return { ...prev, [name]: value }
    })
  }
  const handleDropDownChange = (value: string) => {
    const newInput = { ...userInput, rdate: value }
    setUserInput(newInput)
  }
  function submitParams() {
    handleSubmitParams(userInput)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Account Parameters</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Account Parameters</DialogTitle>
          <DialogDescription>
            Pass your login credentials and monitor information to compare stats with AlertSite Technical
            Benchmark
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Login Email
            </Label>
            <Input
              id='name'
              placeholder='alertsite@alertsite.com'
              className='col-span-3'
              onChange={handleChange}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Password
            </Label>
            <Input
              id='password'
              placeholder={userInput.password}
              className='col-span-3'
              onChange={handleChange}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Customer ID
            </Label>
            <Input id='customerid' placeholder='C12345' className='col-span-3' onChange={handleChange} />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Devices
            </Label>
            <Input id='locations' placeholder='123456,12364' className='col-span-3' onChange={handleChange} />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Locations
            </Label>
            <Input id='username' placeholder='10,1550' className='col-span-3' onChange={handleChange} />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Time Range
            </Label>
            <div className='col-span-3'>
              {/* <Input
                id="rdate"
                value="10,1550"
                placeholder="10"
                className="col-span-3 hidden"
                onChange={handleChange}
              /> */}
              <DropDownRdates handleChange={handleDropDownChange} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={submitParams}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
function useDebounce(inputValue: any, arg1: number): [any] {
  throw new Error('Function not implemented.')
}
