const j5 = require('johnny-five');

module.exports = (pin, onData) => {
	const board = new j5.Board();
	let canSave = true;

	const intervalId = setInterval(() => {
		canSave = true;
	}, 1000);

	board.on('ready', () => {
		if (!pin) {
			return;
		}

		const sensor = new j5.Sensor({pin});
		
		sensor.on('data', () => {
			if (canSave) {
				console.log(`sensor ${pin}:`, sensor.value);
				if (onData) {
					onData(sensor.value);
				}
				canSave = false;
			}
		});
	});
};