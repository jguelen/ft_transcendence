import Game from '../../../components/PongGame'

function Online2v2()
{
  const gameConfig = {
    IA: false,
    local: false,
    tournament: false,
    player_nbr: 4,
    custom_mode: false,
    speeding_mode: false,
    IA_diff: 1,
    player1: "",
    player2: "",
    player3: "",
    player4: "",
    start: false
  };
  return (
    <div>
      <Game config={gameConfig}/>
    </div>
  );
}

export default Online2v2
