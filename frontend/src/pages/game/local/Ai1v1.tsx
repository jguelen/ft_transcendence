import Game from '../../../components/PongGame'

function Ai1v1()
{
	const gameConfig = {
		IA: true,
		local: true,
		tournament: false,
		player_nbr: 2,
		custom_mode: true,
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

export default Ai1v1
