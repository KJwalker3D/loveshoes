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


  // Cube Material 


















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



// Function to update the footsteps
export function updateFootsteps(dt: number) {
  // Get the avatar's position
  const avatarTransform = Transform.get(engine.PlayerEntity);
  const avatarPosition = avatarTransform.position;

  // Calculate the distance traveled by the player since the last frame
  const distanceTraveled = Vector3.distance(avatarPosition, lastAvatarPosition);

  // Check if the player is moving
  const isMoving = distanceTraveled > 0.01; // Adjust the threshold as needed

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
  

  // Create random offsets for position and scale
  const positionOffset = Vector3.create(
    Math.random() + 0.5, // Randomize X position within a range (-0.5 to 0.5)
    -0.8 + Math.random() * 0.2, 
    Math.random() + 0.5 // Randomize Z position within a range (-0.5 to 0.5)
  );

  // Ensure the scale is the same on all axes to maintain proportions
  const scaleValue = Math.random() * 0.5; // Randomize scale within a range (0 to 1)
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



  // Set a timer to remove the footprint entity after a certain time
  let removeTime = 10; // Remove the footprint after 10 seconds (adjust as needed)
  engine.addSystem(function removeFootprint() {
    removeTime -= dt;
    if (removeTime <= 0) {
      engine.removeEntity(footprint);
      engine.removeSystem(removeFootprint);
    }
  });
}
}