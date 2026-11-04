# skill_ai_artwork_generation.md: Asset Production Pipeline (Web-First)

This file covers **how to produce, clean, name, and store game assets**. For the art style and prompt writing rules, see `skill_visual_direction.md`.

## 1. Core principle: from prompt to engine-ready in a few clicks

- **Zero-install by default.** Use web-based tools instead of software that must be installed (for example, Photopea instead of Photoshop).
- **AI does the heavy lifting, you do light touch-ups.** Generate images that are nearly finished, then tidy them with web tools.
- **Consistency over perfection.** Images do not have to be stunning, but size, angle, and style must match across the whole game.
- **Free first, paid only by approval.** If a paid tool would clearly save significant time, the AI must say so, give the cost, and offer a free alternative. The developer decides.

## 2. Generation workflow

### Step 1: Technical specs

Decide these before generating anything:

- **Frame size:** for example 64x64 px for pixel art, 512x512 for HD. Prefer **power-of-two or consistent sizes** across similar assets.
- **Background:** always request `plain white background` or a solid color, so it is easy to remove. Avoid green or white if the character contains the same color.
- **Camera angle:** isometric, side view, or top-down. Keep it the same across the entire game.
- **Aspect ratio and orientation:** match where the asset will appear.

### Step 2: Generate with AI

- Use the 4-layer prompt from `skill_visual_direction.md`.
- For animation, describe each frame's pose explicitly (Frame 1: left foot forward; Frame 2: both feet together; Frame 3: right foot forward; Frame 4: both feet together). AI image tools often struggle with consistent animation frames, so expect to generate several attempts and choose the best, or draw simple frames by hand in a pixel editor.
- Generate 2 to 4 variations, pick one, and use it as the reference for the rest.

### Step 3: Remove the background and clean up

- **Remove the background:** use a web tool such as remove.bg or Adobe Express's background remover (free tiers). Check the current free-tier limits and output resolution before relying on them.
- **For pixel art, avoid auto-removal that blurs edges.** Prefer a magic-wand or fill-based removal in Photopea or Piskel to keep edges crisp.
- **Check edges:** zoom in and look for leftover background fringes (halos). Fix them or regenerate.
- **Resize correctly:** for pixel art, use "nearest neighbor" scaling; smooth scaling blurs the pixels.

### Step 4: Sprite sheets (optional)

- Use a web tool such as Piskel or Ezgif to combine frames or cut a sheet.
- **Key rule:** every frame uses the **same canvas size** with consistent padding, and the character's feet stay at the same position. Otherwise the animation jitters.
- Export as PNG to keep transparency. Note the frame size and frame count in the filename or the Asset Inventory so the code can slice it correctly.

## 3. Color and style consistency

- **Palette lock.** For pixel art, fix the color count (e.g. 16) and use the same palette in every image. Tools like Piskel or Photopea can force an image onto a palette.
- **Outline rule.** If characters have an outline, put it in every prompt (for example, "thick black outline").
- **Light direction.** Light always comes from the same direction (for example, the top left).

## 4. File naming and storage

**Naming pattern:** `type_name_action_frame.ext`, in lowercase with underscores, no spaces or Thai characters (they can break file paths on some systems).

Examples: `char_hero_idle_01.png`, `enemy_slime_attack_02.png`, `bg_forest_layer1.png`, `ui_button_play.png`, `sfx_coin_pickup.ogg`.

**Folder structure:**

```
/assets
  /characters
  /enemies
  /backgrounds
  /ui
  /audio
    /sfx
    /music
```

Keep a simple `assets_log` (a text file or spreadsheet) listing each asset's file name, the prompt or tool used, the date, and the license or terms of use.

## 5. Formats and file size

- Use **PNG** for sprites and UI (transparency, sharp edges), **JPG or WebP** for large photographic backgrounds.
- Keep the total game size small for web play. Compress images (for example with a free web compressor) and avoid unnecessarily large files.
- Test loading on a slow connection or a phone.

## 6. Legal and license notes

- Do not use or modify copyrighted art, characters, or sprites from other games.
- **Check each tool's terms before commercial release.** Free plans of AI image tools may limit commercial use or require attribution. Record the terms in the assets log.
- Fonts, music, and sound effects have licenses too. Keep a note of each source.
- If you plan to sell the game, re-check the license of every asset before release.

## 7. Verification checklist

Before an asset goes into the game, the AI asks:

1. Is the background actually transparent (where needed)?
2. Does the size match the plan?
3. Does the style match the other assets?
4. For animation: do the frames flow smoothly when played in order?
5. Is the file named correctly and saved in the right folder?
6. Is its source and license recorded?

## 8. Anti-patterns

- Generating images with complex backgrounds that cannot be removed (for example, a wood-grain background that blends with the character).
- Changing canvas size midway (first frame 64x64, second frame 70x60).
- Using copyrighted images from other games as a base.
- Recommending paid or subscription tools without asking.
- Smoothing or blurring pixel art when scaling.
- Naming files "final", "final2", "final_really" instead of using the naming pattern.

## 9. Free web tools (verify current terms before use)

Free plans and limits change often. Treat this list as a starting point, not a promise.

| Purpose | Examples |
|---|---|
| Generate images | Bing Image Creator, Leonardo.ai (free tier), Stable Diffusion online services |
| Remove backgrounds | remove.bg, Adobe Express background remover |
| Edit and combine | Photopea (browser-based image editor), Piskel (pixel art editor) |
| Convert and slice | Ezgif, CloudConvert |
| Compress | Squoosh, TinyPNG |
