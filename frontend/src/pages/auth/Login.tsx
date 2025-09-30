import {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { useTranslation } from 'react-i18next';
import { FaGithub } from 'react-icons/fa';
import useAuth from '../../context/AuthContext'
import { ROUTES } from '../../App';

function Login()
{
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>)
  {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !password)
    {
      setError(t("login.error.requiredFields"));
      setLoading(false);
      return;
    }
    try
    {
      await login(email, password);
      alert(t("login.success"));
      navigate(ROUTES.HOME);

    }
    catch (error: any)
    {
      console.error("Échec de la connexion:", error);
      setError(error.message);

    }
    finally
    {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="font-orbitron text-title text-white break-all">{t("login.title")}</h1>
      <form onSubmit={handleSubmit} method="POST" className="flex flex-col items-center justify-center gap-5">

        <Input type="text" name="email" id="email" placeholder={t("login.mail")}
          required value={email} onChange={(e) => setEmail(e.target.value)}
          iconSrc={'/icons/mail.svg'}/>

        <Input type="password" name="password" id="password" placeholder={t("login.password")}
           required value={password} onChange={(e) => setPassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <Button gradientBorder={true} type='submit' disabled={isLoading}
          hoverColor="rgba(39, 95, 153, 0.4)" maxHeight='' className='h-[58px]'>
          {isLoading ? t("login.loading") : t("login.button")}
        </Button>

      </form>
      <div className="flex justify-center items-center gap-3">
        <h2 className="text-text font-inter text-[18px]">{t("login.text")}</h2>
        <Link to={ROUTES.REGISTER} className="text-accent font-inter text-[18px]
         hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
         focus-visible:ring-offset-2 rounded-[4px]">{t("login.link")}
        </Link>
      </div>
      <a 
       href="api/auth/login/github"
       className="flex items-center justify-center gap-3 w-full max-w-xs px-4
       py-2 font-semibold text-white bg-[#24292e] rounded-md hover:bg-[#333]
       transition-colors"
      >
        <FaGithub size={20} />
         {t("login.githubButton")}
      </a>
    </div>
  )
}

export default Login
