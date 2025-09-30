import React, { useEffect, useState } from 'react'
import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useTranslation } from 'react-i18next'; 
import { validatePassword } from '../auth/Register';
import useAuth from '../../context/AuthContext'

import Friends from '../../components/FriendList'

function Account()
{
  const { updateUsername, user }  = useAuth();
  const [username, setUsername] = useState<string>(user ? user.name : "");
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [userError, setUserError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const { t } = useTranslation();

  useEffect(() =>
  {
    if (user)
      setUsername(user.name);
  }, [user]);

  async function handleUsername(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setIsLoadingUser(true);
    setUserError('');
    const trimmedUsername = username.trim();

    if (trimmedUsername.includes('@'))
    {
      setUserError(t("register.error.usernameContainsAt"));
      setIsLoadingUser(false);
      return;
    }
    if (!trimmedUsername)
    {
      setUserError(t("account.error.userError"));
      setIsLoadingUser(false);
      return;
    }
    try
    {
      if (user && trimmedUsername != user.name)
      {
        await updateUsername(trimmedUsername);
        alert(t("account.usernameAlert"));
      }
    }
    catch (error: any)
    {
      setUserError(error.message || t("account.error.unknownError"));
    }
    finally
    {
      setIsLoadingUser(false);
    }
  }

  async function handlePassword(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setIsLoadingPassword(true);
    setPasswordError('');
    const passwordErrors = validatePassword(newPassword, t);

    if (passwordErrors.length > 0)
    {
      // console.log({passwordErrors})
      setPasswordError(passwordErrors.join(' '));
      setIsLoadingPassword(false);
      return;
    }
    try
    {
      const response = await
        fetch(`/api/user/updatepw`,
        {
    			method: 'PUT',
    			credentials: 'include',
      		headers: {'Content-Type': 'application/json'},
    			body: JSON.stringify({pw: password, newpw: newPassword})
    		})
			if (response.status == 401)
			{
        // console.log("Current password not equal to real password");
        setPasswordError(t("account.error.passwordError"));
        setIsLoadingPassword(false);
        return;
			}
			if (response.status == 200)
				return alert(t("account.passwordAlert"))
    }
    catch (error)
    {
      console.error(error)
    }
    finally
    {
      setIsLoadingPassword(false);
    }
  }
  return (
    <div className="contents">
      <Navbar activeMenu='account' className="col-start-1 row-start-1"/>
      <Card maxHeight='' maxWidth='' className="col-start-2 row-start-1 row-span-3">
        <Friends/>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-3 row-start-1 p-[30px]
        flex flex-col justify-evenly items-center">
        <div className="flex justify-center items-center">
          <img src="/icons/user.svg" className="w-[40px] h-[40px]"/>
          <h1 className="font-inter font-semibold text-[32px] text-white">
            {t("account.username")}
          </h1>
        </div>
        {userError && <p className="text-red-500 text-center font-inter text-sm
          w-full max-h-[25%] overflow-y-auto">{userError}</p>}
        <form onSubmit={handleUsername} method="POST"
         className="flex flex-col items-center justify-center gap-1 w-full">
          <Input type="text" name="username" id="username" required value={username}
            onChange={(e) => setUsername(e.target.value)} maxWidth=""
            border="border-stroke" className="text-center"/>
          <Button gradientBorder={true} type="submit" disabled={isLoadingUser}
            hoverColor="rgba(39, 95, 153, 0.15)" maxHeight='' maxWidth='' className='h-[58px] w-full'>
           {isLoadingUser ? t("account.loading") : t("account.button")}
          </Button>
        </form>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-3 row-start-2 row-span-2
        flex flex-col justify-evenly items-center p-[30px]">
        <div className="flex justify-center items-center">
          <img src="/icons/lock.svg" className="w-[40px] h-[40px]"/>
          <h1 className="font-inter font-semibold text-[32px] text-white">
            {t("account.passwordTitle")}
          </h1>
        </div>
        <form onSubmit={handlePassword} method="POST"
          className="flex flex-col items-center justify-center gap-1 w-full">
           {passwordError && <p className="text-red-500 text-center font-inter
             text-sm w-full overflow-y-auto flex-1">{passwordError}</p>}
            <Input type="password" name="password" id="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} maxWidth=""
              border="border-stroke" className="text-center" placeholder={t("account.password")}/>
            <Input type="password" name="curPassword" id="curPassword" required
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
             maxWidth="" placeholder={t("account.newPassword")} className="text-center"/>
          <Button gradientBorder={true} type="submit" disabled={isLoadingPassword}
            hoverColor="rgba(39, 95, 153, 0.15)" maxHeight="" maxWidth='' className='h-[58px] w-full'>
           {isLoadingPassword ? t("account.loading") : t("account.button")}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Account
