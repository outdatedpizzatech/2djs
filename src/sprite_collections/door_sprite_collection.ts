import image001 from "../assets/door/001.png";
import image002 from "../assets/door/002.png";

import { convertImportsToImages } from "../renderers/canvas_renderer";

const sprites = convertImportsToImages([image001, image002]);

export default sprites;
