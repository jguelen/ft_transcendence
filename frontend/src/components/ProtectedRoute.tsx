import React, {ReactNode} from 'react'

function ProtectedRoute({children}: {children: ReactNode})
{
  return (
    <div className="h-full w-full"> {children} </div>
  )
}

export default ProtectedRoute
