import Game from '../../../components/PongGame'

function Local1v1() {
	const gameConfig = {
		IA: false,
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

export default Local1v1