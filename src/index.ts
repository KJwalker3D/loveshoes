import { engine } from '@dcl/sdk/ecs'
import { bounceScalingSystem, circularSystem } from './systems'
import { setupUi } from './ui'
import { updateFootsteps } from './footsteps';



export function main() {
  // draw UI
  setupUi();
  engine.addSystem(circularSystem);
  engine.addSystem(bounceScalingSystem);
  engine.addSystem(updateFootsteps);

}
