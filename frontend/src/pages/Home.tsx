import Card from '../components/Card'
import Button from '../components/Button'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next' 

function Home()
{
  const { t } = useTranslation();
  return (
    <div className="flex justify-around items-center
      max-w-[1600px] w-full max-h-[530px] h-full gap-1">
      <Card maxWidth="400px" maxHeight="504px" className="flex flex-col
        items-center justify-evenly p-1">
        <h1 className="font-orbitron text-title text-white font-medium break-all">{t("home.local")}</h1>
        <Link to="/local-pong" className="flex justify-center items-center w-full
          max-w-[252px]">
          <Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)"
            >{t("home.button")}</Button>
        </Link>
      </Card>
      <Card maxWidth="400px" maxHeight="504px" className="flex flex-col
        items-center justify-evenly p-3">
        <h1 className="font-orbitron text-title text-white font-medium break-all">{t("home.online")}</h1>
        <Link to="/online-pong" className="flex justify-center items-center w-full
          max-w-[252px]">
          <Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)"
            >{t('home.button')}</Button>
        </Link>
      </Card>
      <Card maxWidth="400px" maxHeight="504px" className="flex flex-col
        items-center justify-evenly p-1">
        <h1 className="font-orbitron text-title text-white font-medium break-all">{t("home.cup")}</h1>
        <Link to="/cup" className="flex justify-center items-center max-w-[252px]
          w-full">
          <Button gradientBorder={true} hoverColor="rgba(39, 95, 153, 0.4)"
            >{t("home.button")}</Button>
        </Link>
      </Card>
    </div>
  )
}

export default Home
