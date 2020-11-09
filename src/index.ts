import { renderGameSpace } from "./renderers/game_renderer";
import { addView } from "./renderers/canvas_renderer";
import { loadDebugger } from "./debug/debugger";
import { addMovementSubscriptions } from "./subscriptions/movement";
import { addSessionsSubscriptions } from "./subscriptions/sessions";
import { addMapSubscriptions } from "./subscriptions/map";
import { addSceneSubscriptions } from "./subscriptions/scene";
import { addTransitionSubscriptions } from "./subscriptions/transition";
import { getRenderDictionary } from "./renderers/render_dictionary";

async function index() {
  const bufferCanvas = addView();
  const { visibleCanvas, gameArea, body, tempCanvas } = renderGameSpace();

  // TODO: learn more about this. can't images be loaded sync?

  setTimeout(() => {
    const imageCache = getRenderDictionary();

    addMapSubscriptions();
    addMovementSubscriptions();
    addSessionsSubscriptions();
    addSceneSubscriptions(bufferCanvas, visibleCanvas, tempCanvas, imageCache);
    addTransitionSubscriptions();

    if (process.env.DEBUG) {
      loadDebugger(body, gameArea);
    }
  }, 1000);
}

index();
