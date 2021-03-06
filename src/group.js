import { GameObject } from "..";

/**
 * If a clip is supplied to the Group, it will act as the parent
 * of all GameObject clips added to the group.
 */
export default class Group {

	/**
	 * @property {DisplayObject} clip - clip associated with group, if any.
	 * Objects added to the group are added to clip's child clips.
	 */
	get clip() { return this._clip; }

	/**
	 * @property {string} name
	 */
	get name() { return this._name; }
	set name(v) { this._name =v;}

	/**
	 * @property {GameObject[]} objects
	 */
	get objects() { return this._objects; }

	/**
	 * @property {Game} game
	 */
	get game() { return this._game;}

	/**
	 * @property {Engine} engine
	 */
	get engine() { return this._engine;}

	/**
	 * @property {boolean} paused
	 */
	get paused() { return this._paused; }

	/**
	 * @property {Group[]} [subgroups=undefined]
	 */
	get subgroups() { return this._subgroups; }

	/**
	 *
	 * @param {Game} game
	 * @param {DisplayObject} [clip=null]
	 * @param {boolean} [paused=false]
	 */
	constructor( game, clip=null, paused=false ) {

		this._paused = paused;

		this._clip = clip;

		this._game = game;
		this._engine = game.engine;

		this._objects = [];
		this._subgroups = [];

	}

	pause() {

		if ( this._paused ) return;
		this._paused = true;

		for( let obj of this._objects ) {
			if ( obj.pause ) obj.pause();
			obj.active = false;
		}

		for( let g of this._subgroups ) {
			g.pause();
		}

	}

	unpause() {

		if ( this._paused === false ) return;

		for( let obj of this._objects ) {
			if ( obj.unpause ) obj.unpause();
			obj.active = true;
		}
		for( let g of this._subgroups ) {
			g.unpause();
		}

		this._paused = false;

	}

	/**
	 * Show all the objects in the group and subgroups.
	 */
	show() {

		if ( this._clip ) this._clip.visible = false;

		for( let i = this.subgroups.length-1; i>=0; i-- ) {
			this.subgroups[i].show();
		}

	}

	hide() {

		if ( this._clip ) this._clip.visible = true;

		for( let i = this.subgroups.length-1; i>=0; i-- ) {
			this.subgroups[i].hide();
		}

	}

	/**
	 *
	 * @param {string} gname
	 */
	findGroup( gname ) {

		for( let i = subgroups.length-1; i >= 0; i-- ) {
			if ( this.subgroups[i].name == gname ) return subgroups[i];
		}

		return null;
	}

	/**
	 *
	 * @param {Group} g
	 */
	addGroup( g ) {
		this._subgroups.push(g);
	}

	/**
	 *
	 * @param {Group} g
	 */
	removeGroup( g ) {

		for( var i = this._subgroups.length-1; i>= 0; i-- ) {
			if ( this._subgroups[i] == g ){
				this._subgroups.splice(i,1 );
				return;
			}
		}
	}

	/**
	 * Remove GameObject from group, but not Engine.
	 * @param {GameObject} obj
	 */
	remove(obj, removeClip=true) {

		let ind = this._objects.indexOf(obj);
		if ( ind < 0 ) return;

		this._objects.splice( ind, 1 );

		obj.removeListener( 'destroy', this.remove, this );
		if ( this._clip && obj.clip && removeClip ) this._clip.removeChild( obj.clip );
		obj.group = null;

		//obj.emitter.removeListener('destroy', this.remove, this );


	}

	/**
	 *
	 * @param {GameObject} obj
	 * @returns {GameObject} the object.
	 */
	add( obj ) {

		if ( this._clip && obj.clip ) this._clip.addChild( obj.clip );

		obj.group = this;
		obj.on('destroy', this.remove, this );

		this._objects.push( obj );
		this._engine.add( obj )

		return obj;

	}

	destroy() {

		this._paused = true;

		if ( this._subgroups ) {

			for( let i = this._subgroups.length-1; i>= 0; i-- ) {
				this._subgroups[i].destroy();
			}
		}

		for( let i = this._objects.length-1; i>= 0; i-- ) {
			this._objects[i].removeListener( 'destroy', this.remove, this );
			this._objects[i].Destroy();
		}

		this._engine = null;
		this._clip = null;
		this._game = null;
		this._subgroups = null;
		this._objects = null;

	}

}