/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */
 /*
 	这个类被嵌入到了Object3D类的原型对象上
 */

function EventDispatcher() {}

Object.assign( EventDispatcher.prototype, {

	/*
		添加事件监听函数
		@param type 事件类型
		@param listener 要添加的事件处理函数
	*/
	addEventListener: function ( type, listener ) {

		// 所有的事件监听函数都保存在this._listeners对象上
		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;

		// 事件名作为对象的属性名，每种事件可能对应多种处理函数
		if ( listeners[ type ] === undefined ) {

			listeners[ type ] = [];

		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {

			listeners[ type ].push( listener );

		}

	},

	hasEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;

		return listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1;

	},

	removeEventListener: function ( type, listener ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {

			var index = listenerArray.indexOf( listener );

			if ( index !== - 1 ) {

				listenerArray.splice( index, 1 );

			}

		}

	},

	/*
		触发指定类型的事件
		@param event 对象，对象中的type属性表示事件的类型
	*/
	dispatchEvent: function ( event ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array = listenerArray.slice( 0 );
			
			// 按照事件处理函数的添加顺序依次执行
			for ( var i = 0, l = array.length; i < l; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}

} );


export { EventDispatcher };
