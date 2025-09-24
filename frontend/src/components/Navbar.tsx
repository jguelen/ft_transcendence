import clsx from 'clsx';
import { Link } from 'react-router-dom';
import Card from './Card'

type NavItemProps = {
  to: string;
  iconSrc: string;
  label: string;
  isActive: boolean;
};

async function handleLogout()
{
  try
  {
    const response = await	fetch('/api/auth/logout',
      {
				method: 'DELETE',
				credentials: 'include'
			})
		alert(response.status)
		if (response.status == 200)
			location.href = '/'
	}
  catch(error)
  {
    console.error(error)
  }
}

function NavItem({ to, iconSrc, label, isActive }: NavItemProps) {
  return (
    <Link
      to={to}
      className={clsx(
        "w-full max-h-[105px] h-full rounded-small flex justify-start items-center",
        "pl-[10px] gap-[15px] transition-colors border",
        {
          'bg-blue_card border-accent': isActive,
          'hover:border-white border-transparent': !isActive,
        }
      )}
    >
      <img src={iconSrc} className="w-[40px] h-[40px]" alt={`${label} icon`} />
      <h1 className={clsx(
        "font-inter font-semibold text-[32px]",
        {
          'text-white': isActive,
          'text-text': !isActive,
        }
      )
      }>
        {label}
      </h1>
    </Link>
  );
}

type NavbarProps = {
  activeMenu: 'profile' | 'account',
  className?: string
}

function Navbar({activeMenu, className}: NavbarProps)
{
  return (
    <Card maxWidth="" maxHeight="" className={clsx(
      "flex flex-col p-[15px] gap-[10px]", className)
    }>
      <NavItem iconSrc='/icons/shield-user.svg' isActive={activeMenu === 'profile'}
         label="Profile" to="/settings/profile"/>
      <NavItem iconSrc='/icons/user.svg' isActive={activeMenu === 'account'}
         label="Account" to="/settings/account"/>
      <span className="border border-stroke w-full h-[1px]"/>
      <button className="w-full max-h-[105px] h-full rounded-small
        flex justify-start items-center pl-[10px] gap-[15px] border border-transparent
        hover:border-red-500" onClick={() => handleLogout()}>
        <img src="/icons/logout.svg" className="w-[40px] h-[40px]"/>
        <h1 className="font-inter font-semibold text-text text-[32px]">Logout</h1>
      </button>
    </Card>
  )
}

export default Navbar
