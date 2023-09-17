
import ReactEcs, { Button, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs';
import { toggleFootsteps } from './footsteps';
import { changeHeartColor } from './randomColor';
import { Color4 } from '@dcl/sdk/math';



export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent);
}

const heartButtonImageSrc = 'assets/heart3.png'; // Replace with the actual path




const uiComponent = () => (
  <UiEntity
    uiTransform={{ 
      positionType: 'relative',
      width: 250,
      height: 100,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      position: {
        top: '90%', 
        right: '1%',
        bottom: '1%', 
        left: '80%'
      }
    }}
  >

    <UiEntity
      uiTransform={{
        width: '100%',
        margin: '8px 8px 0 0', // Push to the bottom-right corner
        flexDirection: 'row', // Stack in reverse order
        justifyContent: 'flex-end',
        alignItems: 'flex-end', // Align items to the right
      }}
    >
      <Button
        uiTransform={{ width: 100, height: 100, margin: '0 0 8px 0' }}
        value="On \nOff" 
        variant='secondary'
        fontSize={16}
        color={Color4.Black()}
        onMouseDown={() => toggleFootsteps()}
        uiBackground={{
          color: Color4.Teal(),
          textureMode: 'nine-slices',
          texture: {
            src: heartButtonImageSrc,
          },
          textureSlices: {
            top: -0.05,
            bottom: -0.05,
            left: -0.02,
            right: -0.02,
          },
        }}
      />
    </UiEntity>

    <UiEntity
      uiTransform={{
        width: '100%',
        //height: 100,
        margin: '8px 8px 0 0',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
      }}
    >
      <Button
        uiTransform={{ width: 100, height: 100, margin: '0 0 8px 0' }}
        value="Change \n Color"
        variant='primary'
        fontSize={16}
        onMouseDown={() => changeHeartColor()}
        uiBackground={{
          textureMode: 'nine-slices',
          texture: {
            src: heartButtonImageSrc,
          },
          textureSlices: {
            top: -0.05,
            bottom: -0.05,
            left: -0.02,
            right: -0.02,
          },
        }}
      />
    </UiEntity>


  </UiEntity>
);


