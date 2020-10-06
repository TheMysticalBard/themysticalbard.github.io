# CS4331-Project1
![](assets/videos/demo.mp4)

[Link to webpage.](https://themysticalbard.github.io/)

## Window opacity slider

The opacity of the window changes when you touch the slider, it moves both upwards and downwards.
![](assets/images/window.png)

    AFRAME.registerComponent('window-slider', {
       init: function() {
        	var entity = this.el;
        	//Adds the state increasing to the slider, so that it knows when to go up/down.
        	entity.addState('increasing');
    
        	entity.addEventListener('click', function (evt) {
        		//If it's increaseing, check if it's too high (hardcoded-ish for now). If so, change states. If not, raise the position and emit the window event.
        		if(entity.is('increasing')) {
        			entity.object3D.position.y += 0.01;
        			entity.emit('raise-opacity');
        			if(entity.object3D.position.y >= 0.1) {
        				entity.removeState('increasing');
        				entity.addState('decreasing');
        			}
        		}
        		//Same thing here but for decreasing.
        		else if(entity.is('decreasing')) {
        			entity.object3D.position.y -= 0.01;
        			entity.emit('lower-opacity');
        			if(entity.object3D.position.y <= 0) {
        				entity.removeState('decreasing');
        				entity.addState('increasing');
        			}
        		}
        	});
       	}
      });
<!-- -->
    //Component needed to listen for the opacity events emitted by the window slider.
      AFRAME.registerComponent('window', {
        init: function() {
        	var entity = this.el;
        	var material = entity.getObject3D('mesh').material;
    
        	//If the event was emitted, raise or lower opacity as requested. Checks in place as failsafe.
        	entity.sceneEl.addEventListener('raise-opacity', function (evt) {
        		if(material.opacity < 1) {
        			material.opacity += 0.1;
       			}
       		});
       		entity.sceneEl.addEventListener('lower-opacity', function (evt) {
       			if(material.opacity > 0) {
       				material.opacity -= 0.1;
       			}
       		});
       	}
      });
<!-- -->
    <!-- window -->
    <a-box window position='0.8125 2 1.8' scale='1.625 4 0.1' rotation='0 0 0' material='color:black; opacity:0.5; transparent: true'></a-box>
     
    <!-- window slider -->
    <a-entity position='-0.1 1.5 1.75'>
      <a-box position='0 0.055 -0.005'scale='0.05 0.16 0.009' material='color:black'></a-box>
      <a-circle window-slider position='0 0.05 -0.01' scale='0.02 0.02 0.02' rotation='0 180 0' material='color: gray'>
      	<a-entity scale='3 3 3'position='5.5 0 0.001' geometry='primitive: plane; width: 3; height: 1' material='color: black; transparent: true; opacity: 0.7' text='value: < Press me!; transparent: true; width: 10; align: center'></a-entity>
      </a-circle>
    </a-entity>

## Fan speed dial

The speed of the fan changes when you use the dial, it rotates from side to side, just like my fan dial in my real room.
![](assets/images/fan.png)

    AFRAME.registerComponent('fan-dial', {
        init: function() {
        	var entity = this.el;
        	const PI_4 = Math.PI / 4;
        
        	//This was all basically copied from the slider, same stuff!
        	//Adds the state increasing to the dial, so that it knows when to go up/down.
        	entity.addState('increasing');
    
          entity.addEventListener('click', function (evt) {
        		//If it's increaseing, check if it's too high (hardcoded-ish for now). If so, change states. If not, raise the position and emit the fan event.
        		if(entity.is('increasing')) {
        			entity.object3D.rotation.z += PI_4;
        			entity.emit('increase-fan-state');
        			if(entity.object3D.rotation.z >= 2 * PI_4) {
       					entity.removeState('increasing');
       					entity.addState('decreasing');
       				}
       			}
      
        		//Same thing here but for decreasing.
        		else if(entity.is('decreasing')) {
        			entity.object3D.rotation.z -= PI_4;
        			entity.emit('decrease-fan-state');
        			if(entity.object3D.rotation.z <= -2 * PI_4) {
        				entity.removeState('decreasing');
        				entity.addState('increasing');
        			}
        		}
        	});
        }
      });
<!-- -->
     //Listener for the fan, this is interesting because the fan states aren't strcitly up/down like the opacity of the window is.
     AFRAME.registerComponent('fan-listener', {
        init: function() {
        	var entity = this.el;
        	var state = 0;
        	var speeds = [1, 2, 3, 4, 0];
        	entity.sceneEl.addEventListener('increase-fan-state', function (evt) {
        		entity.setAttribute('animation-mixer', 'timeScale', speeds[++state]);
        		console.log(entity.object3D);
        	});
        	entity.sceneEl.addEventListener('decrease-fan-state', function (evt) {
        		entity.setAttribute('animation-mixer', 'timeScale', speeds[--state]);
        	})
        }
      });

<!-- -->
    <a-entity fan-listener position='0 4 0' gltf-model='#fan' scale='0.01 0.01 0.01' animation-mixer></a-entity>
    <a-entity fan-dial position='0 1.5 -1.75' rotation='0 0 -90'>
      <a-cylinder scale='0.1 0.1 0.1' rotation='90 0 0' material='color: gray'>
      	<a-box scale='0.1 0.1 1' position='0 0.5 -0.5' material='color:black'></a-box>
      </a-cylinder>
    </a-entity>

## Minecraft bee

There is a large Minecraft bee that zips around outside the window!
![](assets/images/bee.png)

    AFRAME.registerComponent('bee', {
       tick: function() {
        	//I got this bit from a-frame's documentation about best practices, it's performance-focused rotation.
        	var el = this.el;
    			var rotationTmp = this.rotationTmp = this.rotationTmp || {x: 0, y: 0, z: 0};
   				var rotation = el.getAttribute('rotation');
    			rotationTmp.y = rotation.y + 10;
    			el.setAttribute('rotation', rotationTmp);

    			el.object3D.position.x += Math.sin(rotation.y * Math.PI / 180);
    			el.object3D.position.z += Math.cos(rotation.y * Math.PI / 180);
        }
      });

<!-- -->
    <a-entity bee position='0 0 6' gltf-model='#bee' scale='0.05 0.05 0.05' rotation='0 -90 0'></a-entity>

## Sources

### Models

 - [Minecraft Bee](https://sketchfab.com/3d-models/minecraft-bee-751f43a93f40433c9eb6986e45bdb6e8)
 - [Low Poly Trees](https://sketchfab.com/3d-models/low-poly-trees-2e70c34af8994852acd4b9ffce596336)
 - [Ceiling Fan](https://sketchfab.com/3d-models/ceiling-fan-ec2c6087d4824211abc827f2a4c2b578)
 - [Drawer](https://sketchfab.com/3d-models/drawer-8f20bb4809074f50962225aacb5c7df4)
 - [Curved monitor](https://sketchfab.com/3d-models/curved-monitor-1caab76438a54c6b9274794a5c75b7e3)
 - [Desk (veneer)](https://sketchfab.com/3d-models/desk-veneer-c66184828633438b94aabbbf9249e9ad)
 - [Potted Plant](https://sketchfab.com/3d-models/potted-plant-household-props-challenge-day-26-4176123e70e44426be3ba0e65587af90)
 - [Bed](https://sketchfab.com/3d-models/bed-da091edf65ee4ffd82d4ba862ccb0a8b)
 - [Lowpoly Mouse](https://sketchfab.com/3d-models/lowpoly-mouse-e0bc8c1d5c8f4be0af37ea852d42d6d9)
 - [Corsair Strafe RGB](https://sketchfab.com/3d-models/corsair-strafe-rgb-dc170f71703644f9a675ebba196af617)
 - [Dream Computer Setup](https://sketchfab.com/3d-models/dream-computer-setup-82f78bbaf2d34f01af854a52151dbf49)
 
 ### Textures
 
  - [Wood Floor](https://cc0textures.com/view?id=WoodFloor038)
  - [Concrete Ceiling](https://cc0textures.com/view?id=Concrete031)
  - [Brick Walls](https://sketchfab.com/3d-models/brick-wall-material-6ef775e935da4d159e40098b06ad33d3)
