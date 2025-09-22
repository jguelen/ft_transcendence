import Game from '../../../components/PongGame'

function Ai1v1()
{
	const gameConfig = {
		IA: true,
		local: true,
		tournament: false,
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

export default Ai1v1
