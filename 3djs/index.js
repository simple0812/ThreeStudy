var camera, scene, renderer;
var controls;

var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };
var showType = 'table';

$(function() {
	init();
	animate();
});

function convertTo3DCoordinate(clientX,clientY){
    var mv = new THREE.Vector3(
        (clientX / window.innerWidth) * 2 - 1,
        -(clientY / window.innerHeight) * 2 + 1,
        0.5 );
    mv.unproject(this.camera);   //这句将一个向量转成threejs坐标
    return mv;
}



function hideCover(obj) {
	transform(targets[showType], 50);
	$(obj).hide(200);
}

function move( targets, duration ) {
	//TWEEN.removeAll();
	duration = duration || 1000;
	console.log(camera, camera.up, targets.up);

	new TWEEN.Tween( targets.position )
		.to( { x: camera.position.x * 0.92 , y:camera.position.y * 0.92, z: camera.position.z * 0.92 },  duration  )
		.onComplete(function() {
			$('.cover').show(200);
		})
		.start();

	new TWEEN.Tween( targets.rotation )
		.to( { x: camera.rotation.x, y:camera.rotation.y, z: camera.rotation.z + 2 * 5 *Math.PI}, duration * 0.8 )
		.start();

	new TWEEN.Tween( targets )
		.to( {}, duration )
		.onUpdate( render )
		.start();
}


function init() {

	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.z = 3000;

	scene = new THREE.Scene();
	scene.add(camera);
	// table

	for ( var i = 0; i < table.length; i ++ ) {
		var item = table[i];
		var element = document.createElement( 'div' );
		element.className = 'element';
		element.dataModel = item;
		element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

		element.addEventListener( 'click', function (event ) {
			var object = objects[ this.dataModel.id ];
			move(object, 2000);
		}, false );



		var number = document.createElement( 'div' );
		number.className = 'number';
		number.textContent = (i/5) + 1;
		element.appendChild( number );

		var symbol = document.createElement( 'img' );
		symbol.className = 'symbol';
		symbol.width = 120;
		symbol.height = 60;
		symbol.src = "https://www.baidu.com/img/bd_logo1.png";
		element.appendChild( symbol );

		var details = document.createElement( 'div' );
		details.className = 'details';
		details.innerHTML = item.fullName + '<br>' + item.desc;
		element.appendChild( details );

		var object = new THREE.CSS3DObject( element );
		object.position.x = Math.random() * 4000 - 2000;
		object.position.y = Math.random() * 4000 - 2000;
		object.position.z = Math.random() * 4000 - 2000;
		scene.add( object );

		objects.push( object );

		//

		var object = new THREE.Object3D();
		object.position.x = ( item.x * 140 ) - 1330;
		object.position.y = - ( item.y * 180 ) + 990;

		targets.table.push( object );

	}

	// sphere

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = Math.acos( -1 + ( 2 * i ) / l );
		var theta = Math.sqrt( l * Math.PI ) * phi;

		var object = new THREE.Object3D();

		object.position.x = 800 * Math.cos( theta ) * Math.sin( phi );
		object.position.y = 800 * Math.sin( theta ) * Math.sin( phi );
		object.position.z = 800 * Math.cos( phi );

		vector.copy( object.position ).multiplyScalar( 2 );

		object.lookAt( vector );

		targets.sphere.push( object );

	}

	// helix

	var vector = new THREE.Vector3();

	for ( var i = 0, l = objects.length; i < l; i ++ ) {

		var phi = i * 0.175 + Math.PI;

		var object = new THREE.Object3D();

		object.position.x = 900 * Math.sin( phi );
		object.position.y = - ( i * 8 ) + 450;
		object.position.z = 900 * Math.cos( phi );

		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;

		object.lookAt( vector );

		targets.helix.push( object );
	}

	// grid

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = new THREE.Object3D();

		object.position.x = ( ( i % 5 ) * 400 ) - 800;
		object.position.y = ( - ( Math.floor( i / 5 ) % 5 ) * 400 ) + 800;
		object.position.z = ( Math.floor( i / 25 ) ) * 1000 - 2000;

		targets.grid.push( object );

	}

	//

	renderer = new THREE.CSS3DRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = 'absolute';
	document.getElementById('container').appendChild( renderer.domElement );

	//

	controls = new THREE.TrackballControls( camera, renderer.domElement );
	controls.rotateSpeed = 0.5;
	controls.minDistance = 500;
	controls.maxDistance = 6000;
	controls.addEventListener( 'change', render );

	var button = document.getElementById( 'table' );
	button.addEventListener( 'click', function ( event ) {
		showType = 'table';
		transform( targets.table, 2000 );

	}, false );

	var button = document.getElementById( 'sphere' );
	button.addEventListener( 'click', function ( event ) {
		showType = 'sphere';
		transform( targets.sphere, 2000 );

	}, false );

	var button = document.getElementById( 'helix' );
	button.addEventListener( 'click', function ( event ) {
		showType = 'helix';
		transform( targets.helix, 2000 );

	}, false );

	var button = document.getElementById( 'grid' );
	button.addEventListener( 'click', function ( event ) {
		showType = 'grid';
		transform( targets.grid, 2000 );

	}, false );

	transform( targets.table, 5000 );

	//

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener('mousemove', function() {
		console.log(convertTo3DCoordinate(15, 20));
	}, false);

}

function transform( targets, duration ) {

	TWEEN.removeAll();

	for ( var i = 0; i < objects.length; i ++ ) {

		var object = objects[ i ];
		var target = targets[ i ];

		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();

	}

	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();

}


function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

	render();

}

function animate() {

	requestAnimationFrame( animate );

	TWEEN.update();

	controls.update();

}

function render() {
	renderer.render( scene, camera );

}