import { Application, Assets, Renderer, Sprite, Texture, triangulateWithHoles } from "pixi.js";
import { createCube, createBackdrop } from "./sprites";
import { set_app, init_board, move } from "./board";
(async () => {
  // Create a new application
  const app = new Application();
  // Initialize the application
  await app.init({ background: "#000000", resizeTo: window });
  set_app(app);
  const renderer: Renderer = app.renderer;
  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);
  init_board(3,4);

  // create backdrop
  // const container = createBackdrop(3,3);
  // const texture = renderer.generateTexture(container);
  // const backdrop = new Sprite(texture);
  // backdrop.anchor.set(0.5,0.5);
  // backdrop.position.set(app.screen.width / 2, app.screen.height / 2);
  // app.stage.addChild(backdrop);

  // const cube_container = createCube(2, "white");
  // const cube_texture = renderer.generateTexture(cube_container);
  // const cube = new Sprite(cube_texture);
  // cube.anchor.set(0.5,0.5);
  // cube.position.set(app.screen.width / 2, app.screen.height / 2);
  // app.stage.addChild(cube);
  // const container = createCube();
  // // Load the bunny texture
  // const texture = renderer.generateTexture(container);

  // // Create a bunny Sprite
  // const bunny = new Sprite(texture);

  // // Center the sprite's anchor point
  // bunny.anchor.set(0.5);

  // // Move the sprite to the center of the screen
  // bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // // Add the bunny to the stage
  // app.stage.addChild(bunny);

  // Listen for animate update
  // app.ticker.add((time) => {
  //   // Just for fun, let's rotate mr rabbit a little.
  //   // * Delta is 1 if running at 100% performance *
  //   // * Creates frame-independent transformation *
  //   bunny.rotation += 0.1 * time.deltaTime;
  // });
  const keys: Record<string,boolean> = {};
  window.addEventListener("keydown", (e) => {
    console.log(e.code);
    switch(e.code) {
      case 'ArrowLeft':
        move('left');
      break;
      case 'ArrowRight':
        move('right');
      break;
      case 'ArrowUp':
        move('up');
      break;
      case 'ArrowDown':
        move('down');
      break;
    }
    keys[e.code] = true;
  });
  // window.addEventListener("keyup", (e) => {
  //   keys[e.code] = false;
  // });
  // app.ticker.add(() => {
  //   const speed = 5;
  //   if (keys['ArrowLeft']) {
  //     move('left');
  //   }
  //   if (keys['ArrowRight']) {
  //     move('right');
  //   }
  //   if (keys['ArrowUp']) {
  //     move('up');
  //   }
  //   if (keys['ArrowDown']) {
  //     move('down');
  //   }
  // });
})();
