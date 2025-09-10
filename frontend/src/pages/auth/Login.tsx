import Card from '../../components/Card'
import {useState} from 'react'
import Button from '../../components/Button'
import Input from '../../components/Input'

function Login()
{
  const [isLoading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  async function handleSubmit()
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

    const passwordErrors = validatePassword(password);

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
      <h1 className="font-orbitron text-title text-white break-all">Login</h1>
      <form onSubmit={handleSubmit} action="/login" method="POST" className="flex flex-col items-center justify-center gap-5">

        <Input type="email" name="email" id="email" placeholder="Email"
          required value={email} onChange={(e) => setEmail(e.target.value)} iconSrc={'/icons/mail.svg'}/>

        <Input type="password" name="password" id="password" placeholder="Password"
           required value={password} onChange={(e) => setPassword(e.target.value)} iconSrc={'/icons/lock.svg'}/>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <Button gradientBorder={true} type='submit' disabled={isLoading} hoverColor="rgba(39, 95, 153, 0.4)">
          {isLoading ? "Connexion..." : "Sign In"}
        </Button>

      </form>
      <div className="flex justify-center items-center gap-3">
        <h2 className="text-text font-inter text-[18px]">Not a member ?</h2>
        <a href="/register" className="text-accent font-inter text-[18px]
         hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
         focus-visible:ring-offset-2 rounded-[4px]">Sign Up
        </a>
      </div>
    </div>
  )
}

function validatePassword(password: string): string[] {
  const errors: string[] = [];
  if (password.length < 12) {
    errors.push("Le mot de passe doit contenir au moins 12 caractères.");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Il doit contenir au moins une lettre minuscule.");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Il doit contenir au moins une lettre majuscule.");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Il doit contenir au moins un chiffre.");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push("Il doit contenir au moins un caractère spécial (!@#$%^&*).");
  }
  return errors;
}

export default Login
