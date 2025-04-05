import Matter from "matter-js";

const targetElement = document.getElementById('canvas');

function initMatter() {

// Create engine and world
const engine = Matter.Engine.create();
const world = engine.world;
engine.timing.timeScale = 1;

// Create renderer (the canvas)
const render = Matter.Render.create({
  element: targetElement,
  engine: engine,
  options: {
    width: 800,
    height: 600,
    wireframes: false,
  },
});

const space = 40;

const startPegX = 400;
const startPegY = 100;

const pegSize = 20;

const restitution = 0.8;

let marbles = [];

// Create ground (static object)
const ground = Matter.Bodies.rectangle(400, 580, 800, 40, {
  isStatic: true,
  render: { fillStyle: "darkgrey" },
});

// Convert RGB to hexadecimal (Matter.js uses hex for colors)
function rgbToHex(r, g, b) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Create a peg
const createPeg = (x, y, size, probability) => {
    const red = Math.floor(probability * 255);
    const color = rgbToHex(red,0,255 - red);
    return Matter.Bodies.rectangle(x,y,size * 1.6, size,{
        isStatic: true,
        render: { fillStyle: color },
        bounceRightProbability: probability,
    });
};

// Create a peg with a bounce probability
let pegs = [];

let probs = [
  0.5, 0.9, 0.1, 0.5, 0.99, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
];

let probNum = 0;

for (let i = 0; i < 36; i++) {
  probs[i] = Math.random();
}

for (let i = 0; i < 8; i++) {
    for (let j = 0; j < i + 1; j++) {
      pegs.push(createPeg(startPegX - space * i + space * j * 2, startPegY + 1.5 * space * i, pegSize, probs[probNum]));
      probNum++;
    }
}

const bounds = [40,120,200,280,360,440,520,600,680,760];

const boundaries = bounds.map(bound => Matter.Bodies.rectangle(bound,550,5,20,{
    isStatic: true,
    render: {fillStyle: "lightgrey"},
}));

// Function to drop a marble
const dropMarble = () => {
  const marble = Matter.Bodies.circle(400, startPegY - 25, 2, {
    restitution: restitution,
    render: { fillStyle: "red" },
  });
  Matter.World.add(world, marble);
  marbles.push(marble);
};

// Function to clear all marbles
const clearMarbles = () => {
  marbles.forEach(marble => {
    Matter.World.remove(world, marble);
  });
  marbles = []; // Clear the marbles array
};

// Function to determine bounce direction
const applyBounceDirection = (marble, bounceRightProbability) => {
  const xVelocity = Math.random() < bounceRightProbability ? 1.65 : -1.65;
  
  // Small velocity adjustment
  const newVelocity = {
    x: xVelocity, // Small shift left or right
    y: 5 // Maintain current downward velocity
  };

  Matter.Body.setVelocity(marble, newVelocity);
};

// Collision detection for all pegs
Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach(({ bodyA, bodyB }) => {
      pegs.forEach(peg => {
        if (bodyA === peg || bodyB === peg) {
          const marble = bodyA === peg ? bodyB : bodyA;
          applyBounceDirection(marble, peg.bounceRightProbability);
        }
      });
    });
  });

// Get the button element
const startBtn = document.getElementById('startBtn');

// Variable to store the interval ID (for clearing later if needed)
let dropInterval;

// Function to start dropping marbles
function startDropping() {
  // Set the interval to call dropMarble every 0.5 seconds (500 milliseconds)
  dropInterval = setInterval(dropMarble, 150);
}

// Function to stop dropping marbles.
function stopDropping() {
  clearInterval(dropInterval);
}

// Event listener for the button click
startBtn.addEventListener('click', function() {
  if (dropInterval) { //Check if dropping is already in progress.
    stopDropping(); //If it is, stop it.
    this.textContent = "Start Dropping"; //Change button text.
  }
  else {
    startDropping();
    this.textContent = "Stop Dropping"; //Change button text.
  }
});  
  
  // Add all objects to the world
  Matter.World.add(world, [ground, ...pegs, ...boundaries]);

// Run the engine and renderer
const runner = Matter.Runner.create();
Matter.Runner.run(runner, engine);
Matter.Render.run(render);

// Drop a marble when clicking
const dropBtn = document.getElementById("drop-one");
dropBtn.addEventListener("click",dropMarble);

// Reset button functionality
const resetBtn = document.getElementById("resetBtn");
resetBtn.addEventListener("click", () => {
    clearMarbles();
});

const randomizeBtn = document.getElementById("randomize");
randomizeBtn.addEventListener("click", () => {
  Matter.World.clear(world); //Clear all bodies from world
    Matter.Engine.clear(engine); //Clear the engine.
    Matter.Render.stop(render); //stop the renderer.
    render.canvas.remove(); //remove canvas from DOM.
    render.canvas = null;
    render.context = null;
    render.textures = {};
    initMatter(); //reinitialize the matter world.
});

}

initMatter();

//bank

//simple sim
let sim1 = [
  0.5, 0.9, 0.1, 0.5, 0.99, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
  0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 
];
