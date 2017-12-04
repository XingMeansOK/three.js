import { Object3D } from '../core/Object3D.js';

/**
 * @author mrdoob / http://mrdoob.com/
 */

function Scene() {

	/*
		构造函数新建一个对象o，在o的作用域下执行Object3D构造函数，
		这样o就有属于自己（hasOwnProperty）的和Object3D一样的属性
	*/
	Object3D.call( this );

	this.type = 'Scene';

	this.background = null;
	this.fog = null;
	this.overrideMaterial = null;

	this.autoUpdate = true; // checked by the renderer

}

/*
	定义Scene类的原型对象，同时继承Object3D和后面自定义的这个对象字面量
	Object.assign() 方法将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。第一个参数就是目标对象
	Object.create( Object3D.prototype )以Object3D的原型对象为原型创建了一个新的对象
	相当于:
	var obj=new Object();
  Object.setPrototypeOf(obj,Object3D.prototype);
  //如果有第二个参数的话
  Object.defineProperties(obj,props); // 注意是添加到了新建的obj对象上，是自身的属性，而不是原型上

	为什么不直接用Object.create()第二个参数？？？？
*/
Scene.prototype = Object.assign( Object.create( Object3D.prototype ), {

	constructor: Scene,

	copy: function ( source, recursive ) {

		Object3D.prototype.copy.call( this, source, recursive );

		if ( source.background !== null ) this.background = source.background.clone();
		if ( source.fog !== null ) this.fog = source.fog.clone();
		if ( source.overrideMaterial !== null ) this.overrideMaterial = source.overrideMaterial.clone();

		this.autoUpdate = source.autoUpdate;
		this.matrixAutoUpdate = source.matrixAutoUpdate;

		return this;

	},

	toJSON: function ( meta ) {

		var data = Object3D.prototype.toJSON.call( this, meta );

		if ( this.background !== null ) data.object.background = this.background.toJSON( meta );
		if ( this.fog !== null ) data.object.fog = this.fog.toJSON();

		return data;

	}

} );



export { Scene };
