import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import Link from 'next/link'

const DashboardFooter = () => {
  return (
    <CardContent className='grid gap-4'>
      <div className='flex flex-row flex-wrap justify-between align-bottom  items-center'>
        <Button className='text-center bg-gray-500 w-[270px] '>
          <Link href='https://techbench-react.vercel.app/'>Checkout the Legacy Version 👴</Link>
        </Button>
        <p className='text-xs text-gray-500 rounded-md'>
          <a
            href='https://support.smartbear.com/alertsite/docs/appendixes/status-codes.html'
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-400 justify-items-center text-center bg-gray-100 dark:bg-gray-900 p-2 rounded-md'
          >
            AlertSite Documentation | Status Codes
          </a>
        </p>
      </div>

      <div className='flex flex-col flex-wrap justify-center items-center'>
        <p className='text-xs pl-3 font-light text-gray-500'>
          Crafted with care by&nbsp;
          <a className='text-blue-300 font-semibold underline' href='https://spencer-christian.vercel.app'>
            Spencer Christian
          </a>
          &nbsp;🛠️✨
        </p>
        <p className='text-xs pl-3 font-light text-gray-500'>Version: 1.23.1</p>
      </div>
    </CardContent>
  )
}

export default DashboardFooter
