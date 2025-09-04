import { getPlaiceholder } from "plaiceholder";
import fs from "fs";

async function makeBlur() {
  const file = fs.readFileSync("./public/estudio.webp");
  const { base64 } = await getPlaiceholder(file);
  console.log(base64); 
}

makeBlur();
