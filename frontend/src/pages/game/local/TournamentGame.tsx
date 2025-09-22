import Game from '../../../components/PongGame'

function TournamentGame()
{
  const gameConfig = {
    IA: false,
    local: true,
    tournament: true,
    player_nbr: 2,
    custom_mode: false,
    speeding_mode: false,
    IA_diff: 1,
    start: false
  };
  return (
    <div>
      <Game config={gameConfig}/>
    </div>
  );
}

export default TournamentGame
