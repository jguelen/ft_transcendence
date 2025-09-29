import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import ImageLoader from '../../components/ImageLoader';
import { useState, useEffect } from 'react';
import useAuth from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx'

// const token = localStorage.getItem('ft_transcendance_jwt');

interface ListItem
{
  victory: boolean;
  oponentName: string;
  score: string;
  time_since: string;
  team: boolean;
}

interface ScrollableListProps
{
  items: ListItem[];
  t: Function
}

const ScrollableList = ({ items, t }: ScrollableListProps) => {
  return (
    <div className="flex flex-col justify-start items-center w-full h-full
     gap-[10px] p-[10px] overflow-y-auto">
     {items.map((item) =>
       (
        <div className="flex justify-between items-center w-full h-[79px] border
         border-cyan_darkend rounded-small p-[10px]">
          <div className="flex w-[280px] h-full justify-start items-center gap-2 flex-1">
            <span className={clsx
              (
                "rounded-small w-[120px] h-[47px]",
                "flex justify-center items-center",
                {
                  'bg-cyan_darkend': item.victory,
                  'bg-blue_darkend': !item.victory
                }
              )}>
              <h1 className="font-inter font-semibold text-subtitle text-white">
               {item.victory === true ? t("profile.victory") : t("profile.defeat")}
              </h1>
            </span>
            <h2 className="font-inter font-semibold text-subtitle text-white flex-1">
             VS {item.oponentName}{item.team ? "’s teams" : ""}</h2>
          </div>
          <div className="flex flex-col justify-center items-end pr-[10px] flex-1">
            <h2 className="font-inter font-semibold text-subtitle text-white">
            {item.score}
            </h2>
            <h3 className="font-inter font-semibold text-[15px] text-text">
             {item.time_since}
            </h3>
          </div>
        </div>
       )
     )}
    </div>
  );
};

async function fetchUserNameById(id: number): Promise<string> {
  const res = await fetch(`/api/user/${id}`, {
    credentials: 'include'
  });
  if (!res.ok) throw new Error("User API error");
  const data = await res.json();
  return data.name;
}

async function oponentName(oponent: any): Promise<string> {
  if (!oponent) return "Unknown";
  if (oponent.id === -1) {
    return oponent.name;
  } else if (oponent.id >= 0) {
    try {
      return await fetchUserNameById(oponent.id);
    } catch {
      return "Unknown";
    }
  }
  return "Unknown";
}

export async function fetchItemsFromAPI(
  playerId: string
  ): Promise<{ items: ListItem[], win_nbr: number, loose_nbr: number }> {
  if (playerId == null)
    throw new Error("No user id");
  const response = await fetch(`/api/game/matches/${playerId}`, {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
  });

  if (!response.ok) {
    throw new Error("API error: " + response.status);
  }
  // console.log("token :", token);
  const data = await response.json();
  
  const items: ListItem[] = await Promise.all(
    data.iddata_array.map(async (item: any) => ({
      victory: item.victory,
      oponentName: await oponentName(item.oponent),
      score: item.score,
      time_since: item.time_since,
      team: item.team
    }))
  );

  return ({
      items,
      win_nbr: data.win_nbr,
      loose_nbr: data.loose_nbr
  });
}

function Profile()
{
  const { user } = useAuth();
  const [items, setItems] = useState<ListItem[]>([]);
  const [win_nbr, setWinNbr] = useState<number>(0);
  const [loose_nbr, setLooseNbr] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetchItemsFromAPI(String((user ? user?.id : null)))
      .then(data => {
        setItems(data.items);
        setWinNbr(data.win_nbr);
        setLooseNbr(data.loose_nbr);
        setIsLoading(false);
      })
        .catch(error => {
          console.error("Error during data fetch", error);
          setIsLoading(false);
        });
  }, []);

  return (
    <div className="contents">
      <Navbar activeMenu='profile' className='col-start-1 row-start-1'/>
      <Card maxHeight='' maxWidth='' className="col-start-2 row-start-1
         col-span-2 flex flex-col justify-center items-center gap-2">
         <h1 className="font-orbitron text-white font-medium text-[36px]">
           {(user) ? user.name : "Player"}</h1>
         <ImageLoader/>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-1 row-start-2
        flex justify-center items-center gap-3">
        <img src="/icons/lightning.svg" className="w-[66px] h-[66px]"/>
        <span className="flex flex-col justify-center items-center">
          <h1 className="font-inter text-white font-semibold text-[32px]">{String(loose_nbr)}</h1>
          <h2 className="font-inter text-text font-semibold text-subtitle">{t("profile.defeats")}</h2>
        </span>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-1 row-start-3 flex
        justify-center items-center gap-3">
        <img src="/icons/trophy.svg" className="w-[66px] h-[66px]"/>
        <span className="flex flex-col justify-center items-center">
          <h1 className="font-inter text-white font-semibold text-[32px]">
            {String(win_nbr)}
          </h1>
          <h2 className="font-inter text-text font-semibold text-subtitle">
            {t("profile.victories")}
          </h2>
        </span>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-2 row-start-2
        row-span-2 col-span-2 flex flex-col justify-center items-center p-[10px] min-h-0">
        <h1 className="font-inter font-semibold text-[32px] text-white">
          {t("profile.history")}</h1>
        {isLoading ? (<div className="font-inter text-subtitle text-text font-medium">
          {t("profile.loading")}</div>) : <ScrollableList t={t} items={items} />}
      </Card>
    </div>
  )
}

export default Profile
