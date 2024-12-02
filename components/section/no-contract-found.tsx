import React from 'react'
import { CornerUpLeft, MessageSquareWarning, AlertCircle} from 'lucide-react';

interface NoContractFoundProps {
    error: string | null;
  }
interface truncateTextProps {
  text: string | null;
  maxLength: number;
  }
const truncateText : React.FC<truncateTextProps> = ({text, maxLength}) => {
  if (text != null) {
    if (text.length <= maxLength) return text;
    return text.slice(0, 10) + '...' + text.slice(10, maxLength);
  }
}
const NoContractFound: React.FC<NoContractFoundProps> = ({error}) => {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-4 py-8">
          <div className="mx-auto max-w-md text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-primary-red" />            
            <h1 className="my-4 text-3xl font-bold text-gray-900">Project Not Found</h1>
              <div className='mb-8 text-gray-600 rounded-xl border p-4 border-red-200'>
              <p className="text-lg text-left text-primary-red">
                We couldn&apos;t find the project <span className="font-mono text-sm bg-gray-100 p-1 rounded">{truncateText({text: error, maxLength: 20 })}</span>.
              </p>
              <p className='text-left text-lg text-gray-600 mb-2'>
              This might be because: 
              </p>
              <ul className="list-disc pl-5 space-y-2 text-left">
                <li>The project ID is incorrect</li>
                <li>The project has been deleted</li>
                <li>You don&apos;t have permission to access this project</li>
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 bg-primary-red text-white rounded-xl hover:bg-hard-red focus:outline-none  focus:ring-offset-2 duration-200 flex gap-2"
              >
                <span>
                <CornerUpLeft/>
                </span>
                Return Home
              </button>
              <button
                onClick={() => window.open('https://docs.google.com/forms/d/e/1FAIpQLSd4P-PJ7yR1Eol75cZW3-9d8JtTOwqQv6hDm6cmoNg90LUHrA/viewform?usp=sf_link', '_blank')}
                className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-300 duration-200 flex gap-4"
              >
                <span>
                  <MessageSquareWarning/>
                </span>
                Report Issue
              </button>
            </div>
          </div>
        </div>
  )
}

export default NoContractFound