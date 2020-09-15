import { Player } from "./player";
import { Camera } from "./camera";
import { Direction } from "./common";

function index() {
  let inputDirections: Set<Direction> = new Set<Direction>();
  var gridInterval = 50;
  const camera = new Camera();

  function handlePlayerMovement(player: Player) {
    if (inputDirections.size > 0) {
      const direction = Array.from(inputDirections.entries())[0][0];
      player.moveBy(direction);
    }

    player.refreshMovement();
  }

  function handleRendering(player: Player, treasure: Player) {
    camera.setPosition(player.renderX, player.renderY);
    player.render(camera);
    treasure.render(camera);
  }

  var body = document.getElementsByTagName("body")[0];
  body.style.backgroundColor = "black";
  var gameArea = document.createElement("div");
  gameArea.style.width = "800px";
  gameArea.style.height = "600px";
  gameArea.style.marginLeft = "auto";
  gameArea.style.marginRight = "auto";
  body.appendChild(gameArea);
  var canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  canvas.style.zIndex = "1";
  canvas.style.position = "absolute";
  gameArea.appendChild(canvas);
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "green";
  for (var x = 0; x < gridInterval; x++) {
    for (var y = 0; y < gridInterval; y++) {
      ctx.fillRect(
        x * gridInterval,
        y * gridInterval,
        gridInterval,
        gridInterval
      );
    }
  }

  const player = new Player({
    color: "red",
    x: 0,
    y: 0,
    icon: "star",
  });
  gameArea.appendChild(player.view());

  const treasure = new Player({
    color: "blue",
    x: 200,
    y: 100,
    icon: "heart",
  });
  gameArea.appendChild(treasure.view());

  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") {
      inputDirections.add(Direction.UP);
    }

    if (e.code === "ArrowRight") {
      inputDirections.add(Direction.RIGHT);
    }

    if (e.code === "ArrowDown") {
      inputDirections.add(Direction.DOWN);
    }

    if (e.code === "ArrowLeft") {
      inputDirections.add(Direction.LEFT);
    }
  });

  document.addEventListener("keyup", (e) => {
    if (e.code === "ArrowUp") {
      inputDirections.delete(Direction.UP);
    }

    if (e.code === "ArrowRight") {
      inputDirections.delete(Direction.RIGHT);
    }

    if (e.code === "ArrowDown") {
      inputDirections.delete(Direction.DOWN);
    }

    if (e.code === "ArrowLeft") {
      inputDirections.delete(Direction.LEFT);
    }
  });

  setInterval(() => {
    handlePlayerMovement(player);
    handleRendering(player, treasure);
  }, 16);
}

index();
