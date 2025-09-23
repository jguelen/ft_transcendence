import {useState} from 'react';
import Button from '../../components/Button';
import Input from '../../components/Input';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function Register()
{
  const [isLoadingSubmit, setLoadingSubmit] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [repassword, setRepassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const { t } = useTranslation();
  const navigate = useNavigate();

  // function handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>)
  // {
  //   setUsername(event.target.value)
  //   if (usernameError)
  //     setUsernameError("");
  // }

  // async function handleUsernameBlur()
  // {
  //   setCheckingUsername(true);
  //   setUsernameError('');
  //   if (!username)
  //   {
  //     setCheckingUsername(false);
  //     return;
  //   }
  //   else if (username.length < 3)
  //   {
  //     setCheckingUsername(false);
  //     setUsernameError(t("register.error.username"));
  //     return;
  //   }
  //   try
  //   {
  //      const data = await checkUsernameAvailability(username);
  //      if (!data.isAvailable)
  //       setUsernameError(t("register.error.taken"));
  //   }
  //   catch (apiError)
  //   {
  //     console.error("Error during username verification", apiError);
  //     setUsernameError("network error");
  //   }
  //   finally
  //   {
  //     setCheckingUsername(false);
  //   }
  // }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setLoadingSubmit(true);
    setError('');
    if (!email || !password)
    {
      setError(t("register.error.mail/password"));
      setLoadingSubmit(false);
      return;
    }

    const passwordErrors = validatePassword(password, t);

    if (passwordErrors.length > 0)
    {
      console.log({passwordErrors})
      setError(passwordErrors.join(' ')); 
      setLoadingSubmit(false);
      return;
    }

    if (password != repassword)
    {
      console.log("password not equal to repassword");
      setError("both password need to be equal.");
      setLoadingSubmit(false);
      return;
    }
      console.log("initializing connexion with:", {email, password, username});
      fetch('/api/auth/signup', {
  		method: 'POST',
  		credentials: 'include',
  		headers: {'Content-Type': 'application/json'},
  		body: JSON.stringify( { name:username, email:email, password:password } )
  	})
  	.then( function(response) {
  		if (response.status != 200)
  			return response.json()
  		else return null
  	})
  	.then( function(data) {
      console.log(data)
  		if (data)
  			alert(data.msg)
  		else {
        alert("Connexion succeed !");
  			location.href = '/'
  		} 
  	})
  	.catch( (error) => { console.error(error); setError("invalid password or email")})
    .finally(() => { setLoadingSubmit(false)});
  }

  return (
    <form onSubmit={handleSubmit} action="/register" method="POST" className="flex flex-col
      items-center justify-center gap-5 w-full h-full">

      <h1 className="font-orbitron text-title text-white break-all">{t("register.title")}</h1>

        <Input type="email" name="email" id="email" placeholder={t("register.mail")}
          required value={email} onChange={(e) => setEmail(e.target.value)} iconSrc={'/icons/mail.svg'}/>

        <Input type="text" name="username" id="username" placeholder={t("register.username")}
          required value={username} onChange={(e) => setUsername(e.target.value)}
          iconSrc={'/icons/user.svg'}/>

        <Input type="password" name="password" id="password" placeholder={t("register.password")}
          required value={password} onChange={(e) => setPassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>

      <div className={clsx(
            "w-full flex flex-col items-center justify-center",
            {
              "flex-grow h-0": error,
            }
      )}>
        <Input type="password" name="repassword" id="repassword" placeholder={t("register.repassword")}
          required value={repassword} onChange={(e) => setRepassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>
      
        {error && <p className="text-red-500 text-center font-inter text-sm w-full max-h-[25%] overflow-y-auto">{error}</p>}
      </div>

      <Button gradientBorder={true} type='submit' disabled={isLoadingSubmit} hoverColor="rgba(39, 95, 153, 0.4)">
        {isLoadingSubmit ? t("register.loading") : t("register.sign_up")}
      </Button>

    </form>
  )
}

export function validatePassword(password: string, t: Function): string[] {
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

