/**
 * Uniform Utilities
 */

var UniformsUtils = {

	merge: function ( uniforms ) {

		var merged = {};

		for ( var u = 0; u < uniforms.length; u ++ ) {

			var tmp = this.clone( uniforms[ u ] );

			for ( var p in tmp ) {

				merged[ p ] = tmp[ p ];

			}

		}

		return merged;

	},

	/*
		@param object uniforms_src源对象
		拷贝源对象，返回拷贝得到的新对象
		源对象的成员属性是将传递给着色器的uniform变量
	*/
	clone: function ( uniforms_src ) {

		var uniforms_dst = {};

		// 遍历源对象的每个成员属性
		for ( var u in uniforms_src ) {

			// 源对象的每个成员属性的属性值都是一个对象
			uniforms_dst[ u ] = {};

			for ( var p in uniforms_src[ u ] ) {

				var parameter_src = uniforms_src[ u ][ p ];

				// 如果是THREE中的对象实例
				if ( parameter_src && ( parameter_src.isColor ||
					parameter_src.isMatrix3 || parameter_src.isMatrix4 ||
					parameter_src.isVector2 || parameter_src.isVector3 || parameter_src.isVector4 ||
					parameter_src.isTexture ) ) {

					uniforms_dst[ u ][ p ] = parameter_src.clone();

				} else if ( Array.isArray( parameter_src ) ) {

					/*
						slice的参数分别指定开始位置和结束位置，
						原始数组中这两个位置之间的元素将作为一个新的数组返回
						如果两个参数都没指定，则将原始数据浅拷贝赋值给新数组
					*/
					uniforms_dst[ u ][ p ] = parameter_src.slice();

				} else {

					uniforms_dst[ u ][ p ] = parameter_src;

				}

			}

		}

		return uniforms_dst;

	}

};


export { UniformsUtils };
