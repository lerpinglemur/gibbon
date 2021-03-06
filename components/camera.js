import { Point } from 'pixi.js';
import Component from '../src/component';

export default class Camera extends Component {

	/**
	 * @property {DisplayObject}
	 */
	get target() { return this._target; }
	set target(v) {

		if ( v ) {
			this._target = v;
			this._viewRect.x = v.x - this._halfWidth;
			this._viewRect.y = v.y  - this._halfHeight;
			this._panClip.position.set( this._halfWidth - v.x, this._halfHeight - v.y );
		}

	}

	/**
	 * @property {number}
	 */
	get minScale() { return this._minScale || 1; }
	set minScale(v ) { this._minScale = v; }

	/**
	 * @property {number}
	 */
	get maxScale() {return this._maxScale || 1; }
	set maxScale( v ) { this._maxScale = v; }

	/**
	* @property {number}
	*/
	get viewScale() {
		return this._viewScale;
	}
	set viewScale(v) {

		this._viewScale = v;
		this._panClip.scale.set(v,v);

	}

	/**
	 * @property {number}
	 */
	get x(){return -this._panClip.x; }
	set x(v) {
		this._viewRect.x = v*this._viewScale;
		this._panClip.x = -this._viewRect.x;
	}

	/**
	 * @property {number}
	 */
	get y(){return -this._panClip.x;}
	set y(v) {

		this._viewRect.y = v*this._viewScale;
		this._panClip.y = -this._viewRect.x;

	}

	/**
	 * @property {Rectangle} Visible rectangle in the Camera's coordinate system.
	 */
	get viewRect() { return this._viewRect; }

	/**
	 * @property {Rectangle} Size of the Canvas.
	 */
	get screen() { return this._screen; }
	set screen(v) { this._screen = v;}

	/**
	 * @property {PIXI.Point}
	 */
	get centerX() { return this._viewRect.x + this._halfWidth; }
	get centerY() { return this._viewRect.y + this._halfHeight; }

	/**
	 * @property {PIXI.Point}
	 */
	get center() { return new Point( this._viewRect.x + this._halfWidth, this._viewRect.y + this._halfHeight );}

	/**
	 * @property {number}
	 */
	get left() { return this._viewRect.left; }
	/**
	 * @property {number}
	 */
	get right() { return this._viewRect.right; }
	/**
	 * @property {number}
	 */
	get top() { return this._viewRect.top; }
	/**
	 * @property {number}
	 */
	get bottom() { return this._viewRect.bottom; }

	constructor() {

		super();

	}

	/**
	 * Determines if an item is completely within the view.
	 * @param {*} it
	 * @returns true if item is completely onscreen, false otherwise.
	 */
	containsItem(it) {
		return false;
	}

	/**
	 *
	 * @param {*} it
	 * @returns true if item is within the camera view, false otherwise.
	 */
	itemInView( it ) {
		return false;
	}

	/**
	 *
	 * @param {PIXI.Point} p
	 */
	ptInView(p) {
		return this._viewRect.contains(p);
	}

	/**
	 *
	 * @param {Rectangle} r
	 * @returns true if a rectangle falls within the camera view, false otherwise.
	 */
	rectInView( r ) {
		return r.x < this._viewRect.right && r.right > this._viewRect.x && r.y < this._viewRect.bottom && r.bottom > this._viewRect.y;
	}

	/**
	 *
	 * @param {PIXI.Point} global
	 * @param {PIXI.Point} [dest=null]
	 * @returns {PIXI.Point}
	 */
	toCameraPoint( global, dest=null ) {

		dest = dest || new Point();
		return this._panClip.toLocal( global, null, dest );

	}

	init(){

		this._target = null;
		this._panClip = this.gameObject.clip;

		this._viewScale = 1;

		this._screen = this.game.screen;
		this._viewRect = this._screen.clone();

		this._halfWidth = this._screen.width/2;
		this._halfHeight = this._screen.height/2;

	}

	update( delta ) {

		if ( this._target === null ) return;

		let targPos = this._target.position;

		let destX = this._halfWidth - targPos.x;
		let destY = this._halfHeight - targPos.y;

		let pos = this._panClip.position;
		pos.set(
			pos.x + (destX- pos.x)/4,
			pos.y + (destY- pos.y)/4
		);

		//console.log('cam pos: ' + pos.x + ', '+ pos.y );

		this._viewRect.x = -pos.x;
		this._viewRect.y = -pos.y;

	}

}