import { Link } from "react-router-dom"
import Card from '../../../components/Card'
import { useTranslation } from "react-i18next" 
import { ROUTES } from "../../../App";

function LocalPong()
{
  const { t } = useTranslation();
  return (
  <div className="flex flex-col items-center justify-center max-w-[1600px]
    max-h-[555px] w-full h-full">
    <h1 className="font-orbitron font-medium text-title text-white">{t("gameMenu.title")}</h1>
    <div className="flex items-center justify-between max-w-[1440px] w-full
      max-h-[485px] h-full gap-2">

      <Link to={ROUTES.LOCAL.PLAY_1V1} className="max-w-[670px] max-h-[465px] w-full h-full">
        <div className="flex items-center justify-center max-h-[670px] max-w-[670px]
           w-full h-full bg-transparent hover:bg-main rounded-big group">
          <Card maxWidth="670px" maxHeight="465px"
            className="flex flex-col gap-[20px] items-center justify-center
            group-hover:shadow-primary border-2 border-stroke group-hover:bg-cyan_card" shadowColor="">
            <img src="/icons/single-player.svg" className="w-[100px] h-[100px]"/>
            <h1 className="font-inter font-semibold text-title text-white">1V1</h1>
            <p className="font-inter font-semibold text-subtitle
              text-text">{t("gameMenu.description")}</p>
          </Card>
        </div>
      </Link>

      <Link to={ROUTES.LOCAL.PLAY_AI} className="max-w-[670px] max-h-[465px] w-full h-full">
        <div className="flex items-center justify-center max-h-[670px] max-w-[670px]
           w-full h-full bg-transparent hover:bg-main rounded-big group">
          <Card maxWidth="670px" maxHeight="465px"
            className="flex flex-col gap-[20px] items-center justify-center
            border-2 border-stroke group-hover:shadow-secondary group-hover:bg-blue_card"
            shadowColor="">
            <img src="/icons/hardware-chip.svg" className="w-[100px] h-[100px]"/>
            <h1 className="font-inter font-semibold text-title text-white">VS AI</h1>
            <p className="font-inter font-semibold text-subtitle
              text-text">{t("gameMenu.local.description")}</p>
          </Card>
        </div>
      </Link>

    </div>
  </div>
  )
}

export default LocalPong

