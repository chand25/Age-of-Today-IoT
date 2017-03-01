  //open /Applications/Google\ Chrome.app --args --allow-file-access-from-files if to open locally
// Assistance from oreilly-japan/learning-three-js-2e-ja-support

  if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
      var container;
      var camera, scene, renderer;
      var video, texture, material, mesh;
      var composer;
      var mouseX = 0;
      var mouseY = 0;
      var windowHalfX = window.innerWidth / 2;
      var windowHalfY = window.innerHeight / 2;
      var cube_count,
        meshes = [],
        materials = [],
        xgrid = 20,
        ygrid = 10;
      init();
      animate();
      function init() {
        container = document.createElement( 'div' );
        document.body.appendChild( container );
        camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 500;
        scene = new THREE.Scene();
        var light = new THREE.DirectionalLight( 0x3366FF,2 );
        light.position.set( 0.5, 1, 1 ).normalize();
        scene.add( light );
        renderer = new THREE.WebGLRenderer( { antialias: false } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );
        video = document.getElementById( 'video' );
        texture = new THREE.VideoTexture( video );
        //texture.minFilter = THREE.LinearFilter;
        //texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.format = THREE.RGBFormat;
        //

        // cubes on screen
        var i, j, ux, uy, ox, oy,
          geometry,
          xsize, ysize;
        ux = 1 / xgrid;
        uy = 1 / ygrid;
        xsize = 480 / xgrid;
        ysize = 204 / ygrid;
        var parameters = { color: 0xffffff, map: texture };
        cube_count = 0;
        for ( i = 0; i < xgrid; i ++ )
        for ( j = 0; j < ygrid; j ++ ) {
          ox = i;
          oy = j;
          //vertices into a face and add that to the geometry:
          geometry = new THREE.BoxGeometry( xsize, ysize, xsize );
          change_uvs( geometry, ux, uy, ox, oy );
          //cubes are being set as material. Lambert is a type of material
          //remember the texture is set to video
          //adding cubes to screen as it loops
          materials[ cube_count ] = new THREE.MeshLambertMaterial( parameters );
          //each instance  of materials array is set to MeshLambertMateria
          material = materials[ cube_count ];
          material.hue = i/xgrid;
          material.saturation = 1 - j/ygrid;
          material.color.setHSL( material.hue, material.saturation, 0.5 );
          //Mesh is a Class representing triangular polygon mesh based objects.
          //params are geometry and material
          //
          mesh = new THREE.Mesh( geometry, material );
          mesh.position.x =   ( i - xgrid/2 ) * xsize;
          mesh.position.y =   ( j - ygrid/2 ) * ysize;
          mesh.position.z = 0;
          //for me, scaling shld be the same along x, y, z
          //scale is a property
          //change ratio if you to resize the 3d objects using
          //mouse dragging events or by scaling the 3d object by clicking on a button
          mesh.scale.x = mesh.scale.y = mesh.scale.z = 1;
          scene.add( mesh );
          mesh.dx = 0.001 * ( 0.5 - Math.random() );
          mesh.dy = 0.001 * ( 0.5 - Math.random() );
          meshes[ cube_count ] = mesh;
           //adding cubes to
          cube_count += 1;
        }

        renderer.autoClear = false;
        document.addEventListener( 'mousemove', onDocumentMouseMove, false );
        // postprocessing files that can be found on three.js
        var renderModel = new THREE.RenderPass( scene, camera );
        var effectBloom = new THREE.BloomPass( 2.3 );
        var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
        //var rbgEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
        //rbgEffect.uniforms['amount'].value = 0.0015
        //rbgEffect.renderToScreen = true;
        effectCopy.renderToScreen = true;
        composer = new THREE.EffectComposer( renderer );
        composer.addPass( renderModel );
        composer.addPass( effectBloom );
        // composer.addPass( rbgEffect );
        composer.addPass( effectCopy );

        //don't change
        window.addEventListener( 'resize', onWindowResize, true );
      }
      function onWindowResize() {
        windowHalfX = window.innerWidth / 2;
        windowHalfY = window.innerHeight / 2;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
        composer.reset();
      }
      function change_uvs( geometry, unitx, unity, offsetx, offsety ) {
        var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
        //shuffle function
        for ( var i = 0; i < faceVertexUvs.length; i ++ ) {
          var uvs = faceVertexUvs[ i ];
          for ( var j = 0; j < uvs.length; j ++ ) {
            var uv = uvs[ j ];
            uv.x = ( uv.x + offsetx ) * unitx;
            uv.y = ( uv.y + offsety ) * unity;
          }
        }
      }
      function onDocumentMouseMove(event) {
        mouseX = ( event.clientX - windowHalfX );
        mouseY = ( event.clientY - windowHalfY ) * 0.5;
      }
      //
      function animate() {
        requestAnimationFrame( animate );
        render();
      }
      var h, counter = 1;
      function render() {
        var time = Date.now() * 0.00005;
        camera.position.x += ( mouseX - camera.position.x ) * 0.05;
        camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
        camera.lookAt( scene.position );
        for ( i = 0; i < cube_count; i ++ ) {
          material = materials[ i ];
          h = ( 360 * ( material.hue + time ) % 360 ) / 360;
          material.color.setHSL( h, material.saturation, 0.5 );
        }

        //concept from Three.js documentation
        if ( counter % 1000 > 200 ) {
          for ( i = 0; i < cube_count; i ++ ) {
            mesh = meshes[ i ];
            mesh.rotation.x += 10 * mesh.dx;
            mesh.rotation.y += 10 * mesh.dy;
            mesh.position.x += 200 * mesh.dx;
            mesh.position.y += 200 * mesh.dy;
            mesh.position.z += 400 * mesh.dx;
          }
        }
        if ( counter % 1000 === 0 ) {
          for ( i = 0; i < cube_count; i ++ ) {
            mesh = meshes[ i ];
            mesh.dx = mesh.dx * -1;
            mesh.dy = mesh.dy * -1;
          }
        }
        counter ++;
        renderer.clear();
        composer.render();
      }