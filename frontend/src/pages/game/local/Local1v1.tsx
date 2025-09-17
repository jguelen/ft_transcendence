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

export default Local1v1