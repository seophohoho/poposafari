import Phaser from 'phaser';
import InputTextPlugin from 'phaser3-rex-plugins/plugins/inputtext-plugin.js';
import UIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import { LoadingScene } from './scenes/load-scene';
import { InGameScene } from './scenes/ingame-scene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  parent: 'app',
  scale: {
    width: 1920,
    height: 1080,
    mode: Phaser.Scale.FIT,
  },
  input: {
    keyboard: true,
  },
  plugins: {
    global: [
      {
        key: 'rexInputTextPlugin',
        plugin: InputTextPlugin,
        start: true,
      },
    ],
    scene: [
      {
        key: 'rexUI',
        plugin: UIPlugin,
        mapping: 'rexUI',
      },
    ],
  },
  dom: {
    createContainer: true,
  },
  fps: {
    target: 60,
    min: 60,
    forceSetTimeOut: false, // true : setTimeout 사용, false : requestAnimationFrame 사용
  },
  pixelArt: true,
  scene: [LoadingScene, InGameScene],
};

const start = () => {
  const game = new Phaser.Game(config);
};

start();
