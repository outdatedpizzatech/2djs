import image001 from "../assets/wall/001.png";
import image002 from "../assets/wall/002.png";

import { convertImportsToImages } from "../renderers/canvas_renderer";

const sprites = convertImportsToImages([image001, image002]);

export default sprites;
