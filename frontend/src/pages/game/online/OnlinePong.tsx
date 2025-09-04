import { Outlet } from "react-router-dom"

function OnlinePong()
{
  return (
    <div className="bg-red-500">
      OnlinePong
      <Outlet/>
    </div>
  )
}

export default OnlinePong
