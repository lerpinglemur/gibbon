import Component from "../src/component";
import { Point } from "pixi.js";

export default class Mover extends Component {

	/**
	 * @property {number} rotation - wraps gameObject rotation in radians.
	 */
	get rotation() { return this._clip.rotation; }
	set rotation(v) {
		if ( v > Math.PI ) v-= 2*Math.PI;
		else if ( v < -Math.PI) v += 2*Math.PI;
		this._clip.rotation = v;
	}

	/**
	 * @property {PIXI.Point} position
	 */
	get position() { return this._clip.position; }
	set position(v) { this._clip.position = v;}

	/**
	 * @property {PIXI.Point} velocity
	 */
	get velocity() { return this._velocity; }
	set velocity(v) { this._velocity.set(v.x, v.y); }

	/**
	 * @property {PIXI.Point} accel
	 */
	get accel() { return this._accel;}
	set accel(v) { this._accel.set(v.x,v.y );}

	/**
	 * @property {number} velocityMax - Maximum absolute value of velocity.
	 */
	get velocityMax() { return this._velocityMax; }
	set velocityMax(v) { this._velocityMax = v;}

	/**
	 * @property {number} accelMax
	 */
	get accelMax() { return this._accelMax; }
	set accelMax(v) { this._accelMax = v; }

	/**
	 * @property {number} omegaAcc
	 */
	get omegaAcc() { return this._omegaAcc; }
	set omegaAcc(v) { this._omegaAcc = v;}

	/**
	 * @property {number} omega - angular velocity in radians/frame.
	 */
	get omega() { return this._omega;}
	set omega(v) { this._omega=v;}

	/**
	 * @property {number} omegaMax
	 */
	get omegaMax() { return this._omegaMax;}
	set omegaMax(v) { this._omegaMax = v;}

	init(){

		this._velocity = new Point();
		this._accel = new Point();

		/**
		 * {number} Angular velocity in radians per frame, and angular acceleration.
		 */
		this._omega = this._omegaAcc = 0;

		/**
		 * Maximum angular velocity in radians.
		 */
		this.omegaMax = Math.PI/40;

		this._accelMax = 1;
		this._velocityMax = 4;

	}

	/**
	 * Set mover velocity.
	 * @param {number} vx
	 * @param {number} vy
	 */
	set(vx,vy) {
		this.velocity.set(vx,vy);
	}

	update(delta) {

		//this.clip.position = pos;
		if ( this._omegaAcc !== 0 ) this._omega += this._omegaAcc*delta;
		if ( this._omega > this._omegaMax ) this._omega = this._omegaMax;
		else if ( this._omega < -this._omegaMax ) this._omega = -this._omegaMax;

		this.rotation += this._omega*delta;
		console.assert( Math.abs(this.clip.rotation) <= 2*Math.PI, 'ERR: Large Mover Rotation: ' + this.clip.rotation );


		let vel = this._velocity;
		vel.x += this._accel.x*delta;
		vel.y += this._accel.y*delta;

		let vabs = vel.x*vel.x + vel.y*vel.y;
		if ( vabs > this.velocityMax*this.velocityMax ) {
			vabs = this.velocityMax/Math.sqrt(vabs);
			vel.set( vabs*vel.x, vabs*vel.y );
		}

		let pos = this.position;
		pos.set( pos.x + vel.x*delta, pos.y +vel.y*delta );

	}

}