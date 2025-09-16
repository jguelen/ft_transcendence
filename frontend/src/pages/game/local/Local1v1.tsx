import Game from '../../../components/PongGame'

export default function PongGame() {
	const gameConfig = {
		IA: false,
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