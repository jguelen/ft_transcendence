import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import ImageLoader from '../../components/ImageLoader';
import { useState, useEffect } from 'react';
import clsx from 'clsx'

interface ListItem
{
  victory: boolean;
  playerName: string;
  score: string;
  time_since: string;
}

interface ScrollableListProps
{
  items: ListItem[];
}

const ScrollableList = ({ items }: ScrollableListProps) => {
  return (
    <div className="flex flex-col justify-start items-center w-full h-full
     gap-[10px] p-[10px] overflow-y-auto">
     {items.map((item) =>
       (
        <div className="flex justify-between items-center w-full h-[79px] border
         border-cyan_darkend rounded-small p-[10px]">
          <div className="flex w-full h-full justify-start items-center gap-2">
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
               {item.victory === true ? "Victory" : "Defeat"}
              </h1>
            </span>
            <h2 className="font-inter font-semibold text-subtitle text-white">
             VS {item.playerName}</h2>
          </div>
          <div className="flex flex-col justify-center items-end pr-[10px]">
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

const fetchItemsFromAPI = async (): Promise<ListItem[]> => {
  console.log("Appel API simule...");
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(
        Array.from({ length: 20 }, (_, i) => ({
          victory: i % 2 == 0 ? true : false,
          playerName: i % 2 == 0 ? "Winner" : "Loser",
          score: i % 2 == 0 ? "2-0" : "0-9",
          time_since: "2h"
        }))
      );
    }, 1000);
  });
};

function Profile()
{
  const [items, setItems] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchItemsFromAPI()
      .then(data =>
      {
        setItems(data);
        setIsLoading(false);
      })
      .catch(error =>
      {
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
           JohnDoe42</h1>
         <ImageLoader/>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-1 row-start-2
        flex justify-center items-center gap-3">
        <img src="/icons/lightning.svg" className="w-[66px] h-[66px]"/>
        <span className="flex flex-col justify-center items-center">
          <h1 className="font-inter text-white font-semibold text-[32px]">58</h1>
          <h2 className="font-inter text-text font-semibold text-subtitle">Defeats</h2>
        </span>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-1 row-start-3 flex
        justify-center items-center gap-3">
        <img src="/icons/trophy.svg" className="w-[66px] h-[66px]"/>
        <span className="flex flex-col justify-center items-center">
          <h1 className="font-inter text-white font-semibold text-[32px]">
            156
          </h1>
          <h2 className="font-inter text-text font-semibold text-subtitle">
            Victories
          </h2>
        </span>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-2 row-start-2
        row-span-2 col-span-2 flex flex-col justify-center items-center p-[10px]">
        <h1 className="font-inter font-semibold text-[32px] text-white">
          Recent History</h1>
        {isLoading ? (<div className="font-inter text-subtitle text-text font-medium">
          Data is loading...</div>) : <ScrollableList items={items} />}
      </Card>
    </div>
  )
}

export default Profile
