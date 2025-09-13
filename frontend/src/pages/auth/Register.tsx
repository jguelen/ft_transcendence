import {useState} from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next'; 

function Register()
{
  const [isLoadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [passwordError, setPasswordError] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [repassword, setRepassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [isCheckingUsername, setCheckingUsername] = useState<boolean>(false)
  const [usernameError, setUsernameError] = useState<string>("")
  const { t } = useTranslation();

  function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>)
  {
    setUsername(event.target.value)
    if (usernameError)
      setUsernameError("");
  }

  async function handleUsernameBlur()
  {
    setCheckingUsername(true);
    setUsernameError('');
    if (!username)
    {
      setCheckingUsername(false);
      return;
    }
    else if (username.length < 3)
    {
      setCheckingUsername(false);
      setUsernameError(t("register.error.username"));
      return;
    }
    try
    {
       // const response = await fetch(`/api/check-username?username=${username}`);
       // const data = await response.json();
       // if (!data.isAvailable)
        // setUsernameError("This username has already been taken.");
    }
    catch (apiError)
    {
      console.error("Error during username verification", apiError);
    }
    finally
    {
      setCheckingUsername(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setLoadingSubmit(true);
    setPasswordError('');
    if (!email || !password)
    {
      setPasswordError(t("register.error.mail/password"));
      setLoadingSubmit(false);
      return;
    }

    const passwordErrors = validatePassword(password, t);

    if (passwordErrors.length > 0)
    {
      console.log({passwordErrors})
      setPasswordError(passwordErrors.join(' ')); 
      setLoadingSubmit(false);
      return;
    }

    if (password != repassword)
    {
      console.log("password not equal to repassword");
      setPasswordError("both password need to be equal.");
      setLoadingSubmit(false);
      return;
    }
    
    try
    {
      console.log("initializing connexion with:", {email, password});
      await new Promise(r => setTimeout(r, 2000));
      // throw new Error("invalid identifiers");
      alert(t("register.alert"));
    }
    catch (apiError)
    {
      setPasswordError(t("register.error.mail/password"))
    }
    finally
    {
      setLoadingSubmit(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} action="/register" method="POST" className="flex flex-col
      items-center justify-center gap-5 w-full h-full">

      <h1 className="font-orbitron text-title text-white break-all">{t("register.title")}</h1>

        <Input type="email" name="email" id="email" placeholder={t("register.mail")}
          required value={email} onChange={(e) => setEmail(e.target.value)} iconSrc={'/icons/mail.svg'}/>

      <div className="w-full flex flex-col items-center justify-center">
        <Input type="text" name="username" id="username" placeholder={t("register.username")}
          required value={username} onChange={handleUsernameChange}
          iconSrc={'/icons/user.svg'} onBlur={handleUsernameBlur}/>

        {isCheckingUsername && <p className="text-gray-400 text-xs mt-1">{t("register.check_username")}</p>}
          {usernameError && <p className="text-red-500 text-xs mt-1 flex-initial">{usernameError}</p>}
      </div>

        <Input type="password" name="password" id="password" placeholder={t("register.password")}
          required value={password} onChange={(e) => setPassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>

      <div className={clsx(
            "w-full flex flex-col items-center justify-center",
            {
              "flex-grow h-0": passwordError,
            }
      )}>
        <Input type="password" name="repassword" id="repassword" placeholder={t("register.repassword")}
          required value={repassword} onChange={(e) => setRepassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>
      
        {passwordError && <p className="text-red-500 text-center font-inter text-sm w-full max-h-[25%] overflow-y-auto">{passwordError}</p>}
      </div>

      <Button gradientBorder={true} type='submit' disabled={isLoadingSubmit || !!usernameError} hoverColor="rgba(39, 95, 153, 0.4)">
        {isLoadingSubmit ? t("register.loading") : t("register.sign_up")}
      </Button>

    </form>
  )
}

function validatePassword(password: string, t: Function): string[] {
  const errors: string[] = [];

  if (password.length < 12) {
    errors.push(t("error.length"));
  }
  if (!/[a-z]/.test(password)) {
    errors.push(t("error.minuscule"));
  }
  if (!/[A-Z]/.test(password)) {
    errors.push(t("error.majuscule"));
  }
  if (!/[0-9]/.test(password)) {
    errors.push(t("error.number"));
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(t("error.special"));
  }
  return errors;
}

export default Register

