import { H1, P } from '#web/components/basics';
import { Link } from '#web/components/Link';
import { Button } from '#web/components/ui/button';
import { MailPlus } from 'lucide-react';
import { useSearchParams } from 'react-router';

export default function Page() {
  const [searchParams] = useSearchParams()
  const email = searchParams.get('email') as string | null

  return (
    <div className='flex flex-col items-center gap-7'>
      <H1>A log-in email has been sent</H1>
      <P>
        Check the inbox for <span className='font-bold'>{searchParams.get('email')}</span> for a log-in link
      </P>
      {
        email?.endsWith('@gmail.com') && (
          <div>
            <Link to='https://mail.google.com'>
              <Button variant={'destructive'} >
                <MailPlus className='p-2 size-10' />
                Open Gmail
              </Button>
            </Link>
          </div>
        )
      }
    </div>
  )
}