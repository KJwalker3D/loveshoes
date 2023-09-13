import {
    engine,
    Transform,
    Schemas,
    AvatarAttach,
    AvatarAnchorPointType,
    MeshRenderer,
    Material,
    PBMaterial,
    PBMaterial_PbrMaterial,
    MaterialTransparencyMode
  } from '@dcl/sdk/ecs'
  import { Quaternion, Vector3 } from '@dcl/sdk/math'
  import { BounceScaling, Spinner } from './components'
  import { selectedColor, emission, colors } from './randomColor';
import { bounceScalingSystem, circularSystem } from './systems';
import { MessageBus } from '@dcl/sdk/message-bus';



const sceneMessageBus = new MessageBus();
// Footstep behaviour 

// Create a new system for footsteps
//engine.addSystem(updateFootsteps)

// Declare a variable to store the last avatar position
let lastAvatarPosition = Vector3.create(0, 0, 0); // Initialize with a zero vector


let isPlayerMoving = false;
let footstepsShowing = true; // reset to false





export function toggleFootsteps() {
 

  if (!footstepsShowing) {
    engine.addSystem(updateFootsteps);
    footstepsShowing = true;

  } else if (footstepsShowing) {

    footstepsShowing = false;
    engine.removeSystem(updateFootsteps);
  }

}

// Store the last time a footprint was created
let lastFootprintTime: number | undefined;
let lastFootprintPosition: Vector3 | undefined;

// Function to update the footsteps
export function updateFootsteps() {
  // Get the avatar's position
  const avatarTransform = Transform.get(engine.PlayerEntity);
  const avatarPosition = avatarTransform.position;

  // Calculate the distance traveled by the player since the last frame
  const distanceTraveled = Vector3.distance(avatarPosition, lastAvatarPosition);

  // Check if the player is moving
  const isMoving = distanceTraveled > 0.05; // Adjust the threshold as needed

  // Update the last avatar position
  lastAvatarPosition.x = avatarPosition.x; // Update the X coordinate
  lastAvatarPosition.y = avatarPosition.y; // Update the Y coordinate
  lastAvatarPosition.z = avatarPosition.z; // Update the Z coordinate

  // Stop generating cubes when the player is still
  if (isMoving && !isPlayerMoving) {
    //player is moving create footprincts
    isPlayerMoving = true;
    //engine.removeEntity()
  } else if (!isMoving && isPlayerMoving) {
    //stopped moving
    isPlayerMoving = false;
  }

  if (isPlayerMoving) {

  //fixed distance between footprints
  //const distanceBetweenFootprints = 1;
  //if (Math.random() < 0.2) changing to below
   // Check if enough time has passed since the last footprint creation
   if (!lastFootprintTime || Date.now() - lastFootprintTime >= 100) {
    // Generate a footprint
    let positionOffset: Vector3;

    // Ensure the new footprint is not too close to the previous one
    do {
      positionOffset = Vector3.create(
        Math.random() * 0.7 - 0.1,
        -0.8 + Math.random() * 0.02,
        Math.random() * 0.7 - 0.1
      );
    } while (
      lastFootprintPosition &&
      Vector3.distance(avatarPosition, Vector3.add(avatarPosition, positionOffset)) <
        .2 // Adjust the distance as needed
    );
    // Ensure the scale is the same on all axes to maintain proportions
    const scaleValue =  0.1 + Math.random() * 0.1; // Randomize scale within a range (0.1 to 0.2)
    const scaleOffset = Vector3.create(scaleValue, scaleValue, scaleValue);
  
    // Calculate the position for the new footprint with randomness
    const footprintPosition = Vector3.add(avatarPosition, positionOffset);

    // Create a new footprint entity and set its position and scale
    const footprint = engine.addEntity();
    Transform.create(footprint, {
      position: footprintPosition,
      scale: scaleOffset, // Apply the randomized scale
      rotation: Quaternion.fromEulerDegrees(
        90,
        Math.random() * 360,
        0
      ), // Randomize rotation
    });
    MeshRenderer.setPlane(footprint);
  
  
    // Create the material for the cube with the selected color and emission
    const selectedColor = colors[Math.floor(Math.random() * colors.length)]

    Material.setPbrMaterial(footprint, {
      texture: Material.Texture.Common({
        src: 'assets/heart.png'
      }),
      emissiveTexture: Material.Texture.Common({
        src: 'assets/heart.png'
      }),
      emissiveColor: selectedColor,
      emissiveIntensity: emission,
      roughness: 1,
      specularIntensity: 0,
      alphaTexture: Material.Texture.Common({
        src: 'assets/heart.png'
      }),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
      alphaTest: 0.1
    })
    
    Spinner.create(footprint, {
      speed: 0.3
    })
    BounceScaling.create(footprint)
    
       // Use the Message Bus to notify other players about the new footprint
       sceneMessageBus.emit('newFootprint', {
        position: footprintPosition,
        scale: scaleOffset,
        color: selectedColor,
        emission: emission,
      });

        // Set the last footprint time
        lastFootprintTime = Date.now();
      
      // Set a timer to remove the footprint entity after a certain time
      let removeTime = 15; // Remove the footprint after 10 seconds (adjust as needed)
      engine.addSystem(function removeFootprint() {
       // removeTime -= dt;
        if (removeTime <= 0) {
          engine.removeEntity(footprint);
          engine.removeSystem(removeFootprint);
        }
      });
  }



 






}
}

/*
// Handle messages from other players to create new footprints
sceneMessageBus.on('newFootprint', (info: any) => {
  const { position, scale, color, emission } = info;

  const footprint = engine.addEntity();
  Transform.create(footprint, {
    position: position,
    scale: scale,
    rotation: Quaternion.fromEulerDegrees(90, Math.random() * 360, 0),
  });
  MeshRenderer.setPlane(footprint);

  Material.setPbrMaterial(footprint, {
    texture: Material.Texture.Common({
      src: 'assets/heart.png',
    }),
    emissiveTexture: Material.Texture.Common({
      src: 'assets/heart.png',
    }),
    emissiveColor: color,
    emissiveIntensity: emission,
    roughness: 1,
    specularIntensity: 0,
    alphaTexture: Material.Texture.Common({
      src: 'assets/heart.png',
    }),
    transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
    alphaTest: 0.1,
  });

  Spinner.create(footprint, {
    speed: 0.3,
  });
  BounceScaling.create(footprint);
});
*/