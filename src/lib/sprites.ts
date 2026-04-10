import fs from "node:fs";
import path from "node:path";

export interface SpriteFrame {
  x: number;
  duration: number;
}

export interface SpriteData {
  frames: SpriteFrame[];
  sheetW: number;
  sheetH: number;
  frameW: number;
  frameH: number;
  tags: Record<string, SpriteFrame[]>;
}

export function loadSprite(name: string): SpriteData {
  const jsonPath = path.join(process.cwd(), "public", "images", "sprites", `${name}.json`);
  const raw = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

  const allFrames: SpriteFrame[] = Object.values(raw.frames).map((f: any) => ({
    x: f.frame.x,
    duration: f.duration,
  }));

  const firstFrame = Object.values(raw.frames)[0] as any;
  const frameW: number = firstFrame.frame.w;
  const frameH: number = firstFrame.frame.h;
  const { w: sheetW, h: sheetH } = raw.meta.size;

  const tags: Record<string, SpriteFrame[]> = {};
  for (const tag of raw.meta.frameTags) {
    tags[tag.name] = allFrames.slice(tag.from, tag.to + 1);
  }

  return { frames: allFrames, sheetW, sheetH, frameW, frameH, tags };
}
