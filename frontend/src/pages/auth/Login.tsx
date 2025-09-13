import {useState} from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useTranslation } from 'react-i18next';

function Login()
{
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { t } = useTranslation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setLoading(true);
    setError('');
    if (!email || !password)
    {
      setError("incorrect email/password");
      setLoading(false);
      return;
    }

    const passwordErrors = validatePassword(password, t);

    if (passwordErrors.length > 0) {
      setError(passwordErrors.join(' ')); 
      setLoading(false);
      return;
    }
    
    try
    {
      console.log("initializing connexion with:", {email, password});
      await new Promise(r => setTimeout(r, 2000));
      // throw new Error("invalid identifiers");
      alert("Connexion succeed !");
    }
    catch (apiError)
    {
      setError("incorrect email or password.")
    }
    finally
    {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="font-orbitron text-title text-white break-all">{t("login.title")}</h1>
      <form onSubmit={handleSubmit} action="/login" method="POST" className="flex flex-col items-center justify-center gap-5">

        <Input type="email" name="email" id="email" placeholder={t("login.mail")}
          required value={email} onChange={(e) => setEmail(e.target.value)} iconSrc={'/icons/mail.svg'}/>

        <Input type="password" name="password" id="password" placeholder={t("login.password")}
           required value={password} onChange={(e) => setPassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <Button gradientBorder={true} type='submit' disabled={isLoading} hoverColor="rgba(39, 95, 153, 0.4)">
          {isLoading ? t("login.loading") : t("login.button")}
        </Button>

      </form>
      <div className="flex justify-center items-center gap-3">
        <h2 className="text-text font-inter text-[18px]">{t("login.text")}</h2>
        <Link to="/register" className="text-accent font-inter text-[18px]
         hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
         focus-visible:ring-offset-2 rounded-[4px]">{t("login.link")}
        </Link>
      </div>
    </div>
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

export default Login
