import image001 from "../assets/player/001.png";
import image002 from "../assets/player/002.png";
import image003 from "../assets/player/003.png";
import image004 from "../assets/player/004.png";
import image005 from "../assets/player/005.png";
import image006 from "../assets/player/006.png";
import image007 from "../assets/player/007.png";
import image008 from "../assets/player/008.png";

import { convertImportsToImages } from "../renderers/canvas_renderer";

const sprites = convertImportsToImages([
  image001,
  image002,
  image003,
  image004,
  image005,
  image006,
  image007,
  image008,
]);

export default sprites;
