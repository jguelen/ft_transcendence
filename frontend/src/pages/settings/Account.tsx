import Card from '../../components/Card';
import Navbar from '../../components/Navbar';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { useTranslation } from 'react-i18next'; 
import { validatePassword } from '../auth/Register';
import { useState } from 'react';

function Account()
{
  const [username, setUsername] = useState<string>("JohnDoe42");
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [curPassword, setCurPassword] = useState<string>("");
  const [userError, setUserError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const { t } = useTranslation();

  async function handleUsername(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setIsLoadingUser(true);
    setUserError('');
    if (username)
    {
      setUserError("Username shouldn't be empty");
      setIsLoadingUser(false);
      return;
    }
    try
    {
      const response = await fetch ('')
    }
    catch (error)
    {
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
    const realPassword = "";
    if (username)
    {
      setUserError("Username shouldn't be empty");
      setIsLoadingUser(false);
      return;
    }
    const passwordErrors = validatePassword(password, t);

    if (passwordErrors.length > 0)
    {
      console.log({passwordErrors})
      setPasswordError(passwordErrors.join(' '));
      setIsLoadingPassword(false);
    }

    if (curPassword != realPassword)
    {
      console.log("Current password not equal to real password");
      setPasswordError("Wrong password.");
      setIsLoadingPassword(false);
      return;
    }

    try
    {

    }
    catch (apiError: any)
    {
    }
    finally
    {
      setIsLoadingUser(false);
    }
  }
  return (
    <div className="contents">
      <Navbar activeMenu='account' className="col-start-1 row-start-1"/>
      <Card maxHeight='' maxWidth='' className="col-start-2 row-start-1 row-span-3">
        Friends
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-3 row-start-1 p-[30px]
        flex flex-col justify-evenly items-center">
        <div className="flex justify-center items-center">
          <img src="/icons/user.svg" className="w-[40px] h-[40px]"/>
          <h1 className="font-inter font-semibold text-[32px] text-white">
            Username
          </h1>
        </div>
        {userError && <p className="text-red-500 text-center font-inter text-sm
          w-full max-h-[25%] overflow-y-auto">{userError}</p>}
        <form onSubmit={handleUsername} action="/settings/account" method="POST"
         className="flex flex-col items-center justify-center gap-1 w-full">
          <Input type="text" name="username" id="username" required value={username}
            onChange={(e) => setUsername(e.target.value)} maxWidth=""
            border="border-stroke" className="text-center"/>
          <Button gradientBorder={true} type="submit" disabled={isLoadingUser}
            hoverColor="rgba(39, 95, 153, 0.15)" maxWidth="">
           {isLoadingUser ? "Loading..." : "Save"}
          </Button>
        </form>
      </Card>
      <Card maxHeight='' maxWidth='' className="col-start-3 row-start-2 row-span-2
        p-[30px] flex flex-col justify-evenly items-center">
        <div className="flex justify-center items-center">
          <img src="/icons/lock.svg" className="w-[40px] h-[40px]"/>
          <h1 className="font-inter font-semibold text-[32px] text-white">
            Password
          </h1>
        </div>
        <form onSubmit={handlePassword} action="/settings/account" method="POST"
          className="flex flex-col items-center justify-center gap-1 w-full">
           {passwordError && <p className="text-red-500 text-center font-inter
             text-sm w-full max-h-[25%] overflow-y-auto">{passwordError}</p>}
            <Input type="password" name="password" id="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} maxWidth=""
              border="border-stroke" className="text-center" placeholder="Current Password"/>
            <Input type="password" name="curPassword" id="curPassword" required
              value={curPassword} onChange={(e) => setCurPassword(e.target.value)}
             maxWidth="" placeholder="New Password" className="text-center"/>
          <Button gradientBorder={true} type="submit" disabled={isLoadingPassword}
            hoverColor="rgba(39, 95, 153, 0.15)" maxWidth="">
           {isLoadingPassword ? "Loading..." : "Save"}
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Account
