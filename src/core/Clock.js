/**
 * @author alteredq / http://alteredqualia.com/
 */

function Clock( autoStart ) {

	this.autoStart = ( autoStart !== undefined ) ? autoStart : true;

	this.startTime = 0;
	this.oldTime = 0;
	this.elapsedTime = 0;

	this.running = false;

}

Object.assign( Clock.prototype, {

	start: function () {

		/*
			window.performance.now()的精度要高于Date.now()，
			另外，window.performance.now()是以一个恒定的速率慢慢增加的,它不会受到系统时间的影响(可能被其他软件调整)。
			performance.timing.navigationStart + performance.now() 约等于 Date.now()
		*/
		this.startTime = ( typeof performance === 'undefined' ? Date : performance ).now(); // see #10732

		this.oldTime = this.startTime;
		this.elapsedTime = 0;
		this.running = true;

	},

	stop: function () {

		this.getElapsedTime();
		this.running = false;
		this.autoStart = false;

	},

	getElapsedTime: function () {

		this.getDelta();
		return this.elapsedTime;

	},

	getDelta: function () {

		var diff = 0;

		if ( this.autoStart && ! this.running ) {

			this.start();
			return 0;

		}

		if ( this.running ) {

			var newTime = ( typeof performance === 'undefined' ? Date : performance ).now();

			diff = ( newTime - this.oldTime ) / 1000;
			this.oldTime = newTime;

			this.elapsedTime += diff;

		}

		return diff;

	}

} );


export { Clock };
