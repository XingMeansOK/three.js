import { Ray } from '../math/Ray.js';

/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */

function Raycaster( origin, direction, near, far ) {

	this.ray = new Ray( origin, direction );
	// direction is assumed to be normalized (for accurate distance calculations)

	this.near = near || 0;
	this.far = far || Infinity;

	this.params = {
		Mesh: {},
		Line: {},
		LOD: {},
		Points: { threshold: 1 },
		Sprite: {}
	};

	Object.defineProperties( this.params, {
		PointCloud: {
			get: function () {

				console.warn( 'THREE.Raycaster: params.PointCloud has been renamed to params.Points.' );
				return this.Points;

			}
		}
	} );

}

function ascSort( a, b ) {

	return a.distance - b.distance;

}

function intersectObject( object, raycaster, intersects, recursive ) {

	if ( object.visible === false ) return;

	object.raycast( raycaster, intersects );

	if ( recursive === true ) {

		var children = object.children;

		for ( var i = 0, l = children.length; i < l; i ++ ) {

			intersectObject( children[ i ], raycaster, intersects, true );

		}

	}

}

Object.assign( Raycaster.prototype, {

	linePrecision: 1,

	set: function ( origin, direction ) {

		// direction is assumed to be normalized (for accurate distance calculations)

		this.ray.set( origin, direction );

	},

	setFromCamera: function ( coords, camera ) {

		/*
			参数coords中包含鼠标的位置，是规格化设备坐标（NDC）下的坐标，-1到1
		*/
		// 透视摄像机
		if ( ( camera && camera.isPerspectiveCamera ) ) {

			// 通过应用摄像机的全局变换矩阵，将射线的原点移动到摄像机的位置（世界坐标系下）
			this.ray.origin.setFromMatrixPosition( camera.matrixWorld );
			/*
				this.ray.direction.set( coords.x, coords.y, 0.5 )返回一个Vector3类型的对象实例V，表示一个NDC坐标点，指示射线的方向，就叫方向点吧
				V.unproject( camera )得到方向点在世界坐标系下的坐标；
				方向点和起点（都在世界坐标系下）确定了射线的方向
				方向向量单位化后保存在direction属性中
			*/
			this.ray.direction.set( coords.x, coords.y, 0.5 ).unproject( camera ).sub( this.ray.origin ).normalize();

		} else if ( ( camera && camera.isOrthographicCamera ) ) {
		// 正射摄像机
			this.ray.origin.set( coords.x, coords.y, ( camera.near + camera.far ) / ( camera.near - camera.far ) ).unproject( camera ); // set origin in plane of camera
			this.ray.direction.set( 0, 0, - 1 ).transformDirection( camera.matrixWorld );

		} else {

			console.error( 'THREE.Raycaster: Unsupported camera type.' );

		}

	},

	// 第二个参数是是否迭代检测object的子节点
	intersectObject: function ( object, recursive ) {

		var intersects = [];

		intersectObject( object, this, intersects, recursive );

		intersects.sort( ascSort );

		return intersects;

	},

	intersectObjects: function ( objects, recursive ) {

		var intersects = [];

		if ( Array.isArray( objects ) === false ) {

			console.warn( 'THREE.Raycaster.intersectObjects: objects is not an Array.' );
			return intersects;

		}

		for ( var i = 0, l = objects.length; i < l; i ++ ) {

			intersectObject( objects[ i ], this, intersects, recursive );

		}

		intersects.sort( ascSort );

		return intersects;

	}

} );


export { Raycaster };
