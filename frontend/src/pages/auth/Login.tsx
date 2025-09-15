import {useState} from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext'

function Login()
{
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { login } = useAuth();
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
    try
    {
      console.log("initializing connexion with:", {email, password});
      await login({ email, password });
      alert("Connexion succeed !");
    }
    catch (err)
    {
      setError("invalid password or email");
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

export default Login
