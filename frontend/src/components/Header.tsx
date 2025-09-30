import Card from './Card';
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import Avatar from "./AvatarDisplay"
import { ROUTES } from '../App';

const languages =
[
  { code: 'fr', name: 'Français', flag: '/icons/french-icon.svg' },
  { code: 'en', name: 'English', flag: '/icons/english-icon.svg' },
  { code: 'es', name: 'Español', flag: '/icons/spanish-icon.svg' },
];

type HeaderProps = {
  disabled?: boolean;
}

function Header({disabled = false}: HeaderProps)
{
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { i18n } = useTranslation();
  const [currentLanguageCode, setCurrentLanguageCode] = useState(i18n.language.split('-')[0]);
  const activeLanguage = languages.find(lang => lang.code === currentLanguageCode);
  const otherLanguages = languages.filter(lang => lang.code !== currentLanguageCode);

  const logoStyle = `font-bold text-3xl bg-gradient-to-r from-text to-second-accent
        text-transparent bg-clip-text transition-all font-orbitron
        break-all`;
   useEffect(() =>
  {
    if (!isOpen)
       return;
    const handleClickOutside = (event: MouseEvent) =>
    {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
    {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  function handleLanguageChange(code: string)
  {
    i18n.changeLanguage(code);
    setCurrentLanguageCode(code);
    setIsOpen(false);
  }

  return (
    <Card className="flex justify-between p-4 items-center z-10"
      maxWidth="1600px" maxHeight="120px">

      {disabled ? <span className={logoStyle}>FT_TRANSCENDENCE</span> :
      <Link to={ROUTES.HOME} className={clsx(logoStyle, "hover:brightness-110")}>FT_TRANSCENDENCE</Link>}

      <div ref={dropdownRef} className="flex justify-center items-center min-w-fit">

        {!disabled && <Link to={ROUTES.SETTINGS.PROFILE}>
          <Avatar/>
        </Link>}

        <div className="flex flex-col justify-center items-center relative
          w-[91px]">

          <button onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true)}
            className="flex justify-around items-center
             hover:bg-blue_darkend w-full rounded-small">
             {activeLanguage && (<img src={activeLanguage.flag}
               alt={activeLanguage.name} className="w-[50px] h-[50px] shrink-0"/>)}
            <img src="/icons/arrow.svg" alt="arrow div icon" className="w-[15px]
               h-[15px]"/>
          </button>

          {isOpen &&
          (<div className="flex flex-col jusify-center items-center absolute top-12
            bg-main p-2.5 rounded-small shadow-card gap-1">
             {otherLanguages.map((lang) =>
             (
              <button key={lang.code} onClick={() => handleLanguageChange(lang.code)}
               className="flex items-center justify-around gap-1 border border-transparent
               hover:border-white">
                <img src={lang.flag} alt={lang.name} className="w-[50px] h-[50px]
                 max-w-none" />
                <h1 className="text-white font-orbitron">{lang.code.toUpperCase()}</h1>
              </button>
             ))
             }
          </div>)}
        </div>
      </div>
    </Card>
  );
}

export default Header
