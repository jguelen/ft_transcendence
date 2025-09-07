import Card from '../../components/Card'

function Login()
{
  return (
    <Card>
      <style>{`
        .input-email:not(:placeholder-shown) {
          background-image: none !important;
          padding-left: 1rem !important;
        }
        
        .input-password:not(:placeholder-shown) {
          background-image: none !important;
          padding-left: 1rem !important;
        }
         .gradient-ring {
          position: relative;
          overflow: hidden;
        }
        .gradient-ring::before {
          content: "";
          position: absolute;
          inset: 0;
          padding: 1px;
          border-radius: inherit;
          background: linear-gradient(90deg, #275F99, #00F9EC);
          -webkit-mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask:
            linear-gradient(#000 0 0) content-box,
            linear-gradient(#000 0 0);
          mask-composite: exclude;
          pointer-events: none;
          }
      `}</style>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="font-orbitron text-title text-white break-all">Login</h1>
        <form action="/login" method="POST" className="flex flex-col items-center justify-center gap-5">
          <input type="text" name="login" id="login" placeholder="Email or Username" required
            className="input-email text-white rounded-small max-w-[252px] w-full h-[58px]
             bg-transparent border border-stroke font-inter text-subtitle bg-[url('/../../assets/mail.svg')]
             bg-no-repeat bg-[length:24px_24px] bg-[position:11px_center] pl-10 focus:outline-none focus:border-accent
             transition-all duration-200 placeholder:text-text"/>
          <input type="password" name="password" id="password" placeholder="Password" required
            className="input-password text-white rounded-small max-w-[252px] w-full h-[58px] bg-transparent border border-stroke
            font-inter text-subtitle bg-[url('/../../assets/lock.svg')] bg-no-repeat
            bg-[length:24px_24px] bg-[position:11px_center] pl-10 focus:outline-none focus:border-accent transition-all duration-200
            placeholder:text-text"/>
          <button type="submit" className="gradient-ring relative overflow-hidden gradient-border text-white font-inter text-subtitle
            rounded-small max-w-[252px] w-full h-[58px] hover:bg-[rgba(39,_95,_153,_0.4)]">
            Sign In
          </button>
        </form>
        <div className="flex justify-center items-center gap-3">
          <h2 className="text-text font-inter text-[18px]">Not a member ?</h2>
          <a href="/register" className="text-accent font-inter text-[18px]
           hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent
           focus-visible:ring-offset-2 rounded-[4px]">Sign Up
          </a>
        </div>
      </div>
    </Card>
  )
}

export default Login
