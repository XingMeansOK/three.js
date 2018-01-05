/**
 * @author mrdoob / http://mrdoob.com/
 * @author Mugen87 / https://github.com/Mugen87
 */

import { Geometry } from '../core/Geometry.js';
import { BufferGeometry } from '../core/BufferGeometry.js';
import { Float32BufferAttribute } from '../core/BufferAttribute.js';
import { Vector3 } from '../math/Vector3.js';

// BoxGeometry

function BoxGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

	Geometry.call( this );

	this.type = 'BoxGeometry';

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	// 本质上构造几何体还是通过BufferGeometry
	this.fromBufferGeometry( new BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) );
	// 剔除掉冗余的重复顶点和没有构成三角形的面
	this.mergeVertices();

}

BoxGeometry.prototype = Object.create( Geometry.prototype );
BoxGeometry.prototype.constructor = BoxGeometry;

// BoxBufferGeometry

function BoxBufferGeometry( width, height, depth, widthSegments, heightSegments, depthSegments ) {

	BufferGeometry.call( this );

	this.type = 'BoxBufferGeometry';

	this.parameters = {
		width: width,
		height: height,
		depth: depth,
		widthSegments: widthSegments,
		heightSegments: heightSegments,
		depthSegments: depthSegments
	};

	var scope = this;

	width = width || 1;
	height = height || 1;
	depth = depth || 1;

	// segments

	widthSegments = Math.floor( widthSegments ) || 1;
	heightSegments = Math.floor( heightSegments ) || 1;
	depthSegments = Math.floor( depthSegments ) || 1;

	// buffers

	var indices = [];
	var vertices = [];
	var normals = [];
	var uvs = [];

	// helper variables

	var numberOfVertices = 0;
	var groupStart = 0;

	// build each side of the box geometry

	/*
		后面注释里的p、n分别是positive和negative
		px也就是垂直于x轴，与x轴正半轴相交的面
	*/
	buildPlane( 'z', 'y', 'x', - 1, - 1, depth, height, width, depthSegments, heightSegments, 0 ); // px
	buildPlane( 'z', 'y', 'x', 1, - 1, depth, height, - width, depthSegments, heightSegments, 1 ); // nx
	buildPlane( 'x', 'z', 'y', 1, 1, width, depth, height, widthSegments, depthSegments, 2 ); // py
	buildPlane( 'x', 'z', 'y', 1, - 1, width, depth, - height, widthSegments, depthSegments, 3 ); // ny
	buildPlane( 'x', 'y', 'z', 1, - 1, width, height, depth, widthSegments, heightSegments, 4 ); // pz
	buildPlane( 'x', 'y', 'z', - 1, - 1, width, height, - depth, widthSegments, heightSegments, 5 ); // nz

	// build geometry

	this.setIndex( indices );
	this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
	this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );
	this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );

	/*
		构建立方体的一个面
		@param width 这个面的宽度
		@param height 这个面的高度
		@param depth 这个面和坐标轴相交的位置
		@param gridX gridY 这个面横向、纵向的节点数
	*/
	function buildPlane( u, v, w, udir, vdir, width, height, depth, gridX, gridY, materialIndex ) {

		// 根据节点数分割面，得到的一小块的宽高
		var segmentWidth = width / gridX;
		var segmentHeight = height / gridY;

		var widthHalf = width / 2;
		var heightHalf = height / 2;
		var depthHalf = depth / 2;

		var gridX1 = gridX + 1;
		var gridY1 = gridY + 1;

		var vertexCounter = 0;
		var groupCount = 0;

		var ix, iy;

		var vector = new Vector3();

		// generate vertices, normals and uvs

		for ( iy = 0; iy < gridY1; iy ++ ) {

			var y = iy * segmentHeight - heightHalf;

			for ( ix = 0; ix < gridX1; ix ++ ) {

				var x = ix * segmentWidth - widthHalf;

				// set values to correct vector component

				/*
					以px面为例，
					这里的x指的是这个面的横向坐标，对应的是世界坐标系里的z轴
					y指的是这个面的纵向坐标，对应世界坐标系里的y轴
					深度对应的是世界坐标系里的x轴。所以，参数uvw分别是zyx
				*/
				vector[ u ] = x * udir;
				vector[ v ] = y * vdir;
				vector[ w ] = depthHalf;

				/*
					构造函数前三个参数对应的就是立方体在xyz方向上的长度，
					并且初始创建出来的立方体的中心是与世界坐标的原点重合的
				*/

				// now apply vector to vertex buffer

				vertices.push( vector.x, vector.y, vector.z );

				// set values to correct vector component

				vector[ u ] = 0;
				vector[ v ] = 0;
				vector[ w ] = depth > 0 ? 1 : - 1;

				// now apply vector to normal buffer

				normals.push( vector.x, vector.y, vector.z );

				// uvs

				uvs.push( ix / gridX );
				uvs.push( 1 - ( iy / gridY ) );

				// counters

				vertexCounter += 1;

			}

		}

		// indices

		// 1. you need three indices to draw a single face
		// 2. a single segment consists of two faces
		// 3. so we need to generate six (2*3) indices per segment

		for ( iy = 0; iy < gridY; iy ++ ) {

			for ( ix = 0; ix < gridX; ix ++ ) {

				var a = numberOfVertices + ix + gridX1 * iy;
				var b = numberOfVertices + ix + gridX1 * ( iy + 1 );
				var c = numberOfVertices + ( ix + 1 ) + gridX1 * ( iy + 1 );
				var d = numberOfVertices + ( ix + 1 ) + gridX1 * iy;

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );

				// increase counter

				groupCount += 6;

			}

		}

		// add a group to the geometry. this will ensure multi material support

		scope.addGroup( groupStart, groupCount, materialIndex );

		// calculate new start value for groups

		groupStart += groupCount;

		// update total number of vertices

		numberOfVertices += vertexCounter;

	}

}

BoxBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
BoxBufferGeometry.prototype.constructor = BoxBufferGeometry;


export { BoxGeometry, BoxBufferGeometry };
