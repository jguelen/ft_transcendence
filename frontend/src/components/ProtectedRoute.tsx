import React, {ReactNode} from 'react'

function ProtectedRoute({children}: {children: ReactNode})
{
  return (
    <div className="bg-red-500"> {children} </div>
  )
}

export default ProtectedRoute
