import image001 from "../assets/wall/001.png";
import image002 from "../assets/wall/002.png";
import image003 from "../assets/wall/003.png";
import image004 from "../assets/wall/004.png";

import { convertImportsToImages } from "../renderers/canvas_renderer";

const sprites = convertImportsToImages([
  image001,
  image002,
  image003,
  image004,
]);

export default sprites;
