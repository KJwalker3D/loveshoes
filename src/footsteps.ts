import { engine, Transform, MeshRenderer, Material, MaterialTransparencyMode } from '@dcl/sdk/ecs'
import { Quaternion, Vector3 } from '@dcl/sdk/math'
import { BounceScaling, Spinner } from './components'
import { emission, colors } from './randomColor';
import { MessageBus } from '@dcl/sdk/message-bus';



const sceneMessageBus = new MessageBus();



// Declare a variable to store the last avatar position
let lastAvatarPosition = Vector3.Zero(); // Initialize with a zero vector
let isPlayerMoving = false;
let footstepsShowing = true; // initiate on





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
let lastFootprintTime: number | 0;
let isLeftFoot = true; // Variable to track left and right alternation

// Function to update the footsteps
export function updateFootsteps() {
  // Get the avatar's position
  const avatarTransform = Transform.get(engine.PlayerEntity);
  const avatarPosition = avatarTransform.position;
  const avatarRotation = avatarTransform.rotation;
  const avatarRotationEuler = Quaternion.toEulerAngles(avatarRotation);

  // Calculate the distance traveled by the player since the last frame
  const distanceTraveled = Vector3.distance(avatarPosition, lastAvatarPosition);

  // Check if the player is moving
  const isMoving = distanceTraveled > 0.03; // Adjust the threshold as needed

  // Update the last avatar position
  lastAvatarPosition.x = avatarPosition.x; // Update the X coordinate
  lastAvatarPosition.y = avatarPosition.y; // Update the Y coordinate
  lastAvatarPosition.z = avatarPosition.z; // Update the Z coordinate

  // Rotation to account for left right at different rots
  const footprintRotation = Vector3.add(avatarRotationEuler, Vector3.create( 90,
    Math.random() * 360,
    0));
  // Stop generating cubes when the player is still
  if (isMoving && !isPlayerMoving) {
    isPlayerMoving = true;
  } else if (!isMoving && isPlayerMoving) {
    isPlayerMoving = false;
  }

  if (isPlayerMoving) {

   if (!lastFootprintTime || Date.now() - lastFootprintTime >= 35) {
    // Generate a footprint
    lastFootprintTime++
    
    let forwardOffset = 0.2;
    let positionOffset = Vector3.Zero();
  
    if (isLeftFoot) {
      // Calculate the position offset for the left foot based on avatar rotation
      const leftFootRotation = avatarRotationEuler.y + 90; // Offset by 90 degrees
      const leftFootX = avatarPosition.x + Math.cos(leftFootRotation * (Math.PI / 180)) * forwardOffset;
      const leftFootZ = avatarPosition.z + Math.sin(leftFootRotation * (Math.PI / 180)) * forwardOffset;
      positionOffset = Vector3.create(leftFootX, avatarPosition.y - 0.78, leftFootZ);
    
    } else {
      // Calculate the position offset for the right foot based on avatar rotation
      const rightFootRotation = avatarRotationEuler.y - 90; // Offset by -90 degrees
      const rightFootX = avatarPosition.x + Math.cos(rightFootRotation * (Math.PI / 180)) * forwardOffset;
      const rightFootZ = avatarPosition.z + Math.sin(rightFootRotation * (Math.PI / 180)) * forwardOffset;
      positionOffset = Vector3.create(rightFootX, avatarPosition.y - 0.79, rightFootZ);
     
    }
    
    // Toggle between left and right for the next step
    isLeftFoot = !isLeftFoot;
    
    // Calculate the position for the new footprint with randomness
    const footprintPosition = Vector3.add(avatarPosition, positionOffset);
    const footprintRotationQuat = Quaternion.fromEulerDegrees(footprintRotation.x, footprintRotation.y, footprintRotation.z)

    // Determine scale
    const scaleOffset = Vector3.create(0.5, 0.5, 0.5);
    let selectedColor = colors[Math.floor(Math.random() * colors.length)];

    // Create a new footprint entity and set its position and scale
    const footprint = engine.addEntity();

    // Create the material for the cube with the selected color and emission
    Material.setPbrMaterial(footprint, {
      texture: Material.Texture.Common({
        src: 'assets/heart2.png'
      }),
      emissiveTexture: Material.Texture.Common({
        src: 'assets/heart2.png'
      }),
      emissiveColor: selectedColor,
      emissiveIntensity: emission,
      roughness: 1,
      specularIntensity: 0,
      alphaTexture: Material.Texture.Common({
        src: 'assets/heart2.png'
      }),
      transparencyMode: MaterialTransparencyMode.MTM_ALPHA_TEST,
      alphaTest: 0.1
    });
    Transform.create(footprint, {
      position: positionOffset,
      scale: scaleOffset,
      rotation: footprintRotationQuat
    });
    MeshRenderer.setPlane(footprint);
  
  
    
    Spinner.create(footprint, {
      speed: 0.3
    });
    BounceScaling.create(footprint);
    
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

