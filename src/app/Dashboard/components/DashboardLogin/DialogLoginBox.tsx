import { useDataStore } from '@/app/redux/useDataStore'
import { Button } from '../../../../components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../components/ui/dialog'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import * as DialogPrimitive from '@radix-ui/react-dialog'

// Dialog Login Box Component
// This component is used to display a dialog box for login
export function DialogLoginBox() {
  const { loginStatus } = useDataStore()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline'>Account</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Please provide your AlertSite login credentials and customer ID to compare statistics with the
            AlertSite Technical Benchmark.
          </DialogDescription>
        </DialogHeader>

        {/*
        Render the appropriate content based on the login status
          - If login status is false, render the login dialog content
          - If login status is true, render the login success content
        */}
        <>{loginStatus === false ? <LoginDialogContent /> : <LoginSuccessContent />}</>
      </DialogContent>
    </Dialog>
  )
}

// Login Dialog Content Component
// This component is used to display the login dialog content
const LoginDialogContent = () => {
  const { handleUserInput, LoginUserSubmit, loginErrorStatus } = useDataStore()

  function handleSubmit() {
    LoginUserSubmit()
    DialogTrigger
  }
  return (
    <>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='email' className='text-right'>
            Login Email
          </Label>
          <Input
            id='email'
            placeholder='alertsite@alertsite.com'
            className='col-span-3'
            onChange={handleUserInput}
          />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='password' className='text-right' aria-placeholder='Password'>
            Password
          </Label>
          <Input id='password' className='col-span-3' type='password' onChange={handleUserInput} />
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='customerNum' className='text-right'>
            Customer ID
          </Label>
          <Input id='customerNum' placeholder='C12345' className='col-span-3' onChange={handleUserInput} />
        </div>
      </div>
      {loginErrorStatus && (
        <div className='text-red-500 text-center'>
          <p>Failed to login. Please check your credentials and try again.</p>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild id='DialogClose'>
          <Button type='submit' onClick={handleSubmit}>
            Save
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}

// Login Success Content Component
// This component is used to display the login success content
const LoginSuccessContent = () => {
  const { userInput, LogoutUser } = useDataStore()
  return (
    <>
      <div className='grid gap-4 py-4'>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='email' className='text-right'>
            Login Email
          </Label>
          <p>{userInput.email}</p>
        </div>
        <div className='grid grid-cols-4 items-center gap-4'>
          <Label htmlFor='customerNum' className='text-right'>
            Customer ID
          </Label>
          <p>{userInput.customerNum}</p>
        </div>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type='submit' onClick={LogoutUser}>
            Log Out
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  )
}
