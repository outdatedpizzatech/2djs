import { renderGameSpace } from "./renderers/game_renderer";
import { addView } from "./renderers/canvas_renderer";
import { loadDebugger } from "./debug/debugger";
import { addMovementSubscriptions } from "./subscriptions/movement";
import { addSessionsSubscriptions } from "./subscriptions/sessions";
import { addMapSubscriptions } from "./subscriptions/map";
import { addSceneSubscriptions } from "./subscriptions/scene";

async function index() {
  const bufferCanvas = addView();
  const { visibleCanvas, gameArea, body } = renderGameSpace();

  addMapSubscriptions();
  addMovementSubscriptions();
  addSessionsSubscriptions();
  addSceneSubscriptions(bufferCanvas, visibleCanvas);

  if (process.env.DEBUG) {
    loadDebugger(body, gameArea);
  }
}

index();
