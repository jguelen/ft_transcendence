import Card from './Card';

function Header()
{
  return (
    <Card className="flex justify-between p-4 items-center"
      maxWidth="1600px" maxHeight="120px">
      <a href="/" className="font-bold text-3xl bg-gradient-to-r from-text to-second-accent
        text-transparent bg-clip-text hover:brightness-110 transition-all font-orbitron">FT_TRANSCENDENCE</a>
      <div className="flex justify-center items-center gap-5">
        <img src='./futuristic-avatar.svg' alt="User icone" width="50" height="50"/>
        <img src='/icons/french-icon.svg' alt="French flag icone" width="50" height="50"/>
      </div>
    </Card>
  );
}

export default Header
