import {
  type Matrix,
  type MapLayout,
  weightedRandom,
  randomInt
} from '@dotz/shared';
import path from 'path';
import Jimp from 'jimp';
import fs from 'fs-extra';
import chalk from 'chalk';

type Angle = 0 | 90 | 180 | 270;
type Direction = 'top' | 'bottom' | 'left' | 'right';

type TileMeta = {
  pixels: Matrix<number>;
  angle: Angle;
  index: number;
  repeatX: boolean;
  repeatY: boolean;
  weight: number;
};

type LayoutMeta = TileMeta[];

type Constraints = {
  top: string[];
  bottom: string[];
  left: string[];
  right: string[];
};

type ConstraintsMap = Map<string, Constraints>;

const WIDTH = 100;
const HEIGHT = 100;

const parseLayoutMeta = async (): Promise<LayoutMeta> => {
  const LAYOUTS_PATH = path.join(
    process.cwd(),
    '../sdk/assets/tilesets/base-layout.png'
  );

  const png = await Jimp.read(LAYOUTS_PATH);
  const width = png.getWidth();
  const height = png.getHeight();

  const chunks: LayoutMeta = [];

  const getPixel = (x: number, y: number) => {
    return png.getPixelColor(x, y);
  };

  const getPixelRedValue = (x: number, y: number) => {
    return Jimp.intToRGBA(getPixel(x, y)).r;
  };

  const CHUNK_SIZE = 4;

  for (let y = 0; y < height; y += CHUNK_SIZE) {
    for (let x = 0; x < width; x += CHUNK_SIZE) {
      const pixels: Matrix<number> = [
        // prettier-ignore
        [getPixel(x, y),     getPixel(x + 1, y),     getPixel(x + 2, y)],
        [getPixel(x, y + 1), getPixel(x + 1, y + 1), getPixel(x + 2, y + 1)],
        [getPixel(x, y + 2), getPixel(x + 1, y + 2), getPixel(x + 2, y + 2)]
      ];

      chunks.push({
        pixels,
        angle: ((x / CHUNK_SIZE) * 90) as Angle,
        repeatX: getPixelRedValue(x + 3, y) === 255,
        repeatY: getPixelRedValue(x, y + 3) === 255,
        weight: getPixelRedValue(x + 3, y + 3),
        index: y / CHUNK_SIZE
      });
    }
  }

  return chunks.filter(chunk => chunk.weight > 0);
};

const getConstraintKey = (tile: TileMeta) => `${tile.index}:${tile.angle}`;

const createConstraintsMap = (layout: LayoutMeta): ConstraintsMap => {
  const map: ConstraintsMap = new Map();

  const getConstraints = (tile: TileMeta, direction: Direction) => {
    return layout
      .filter(otherTile => {
        const isSameTile =
          tile.index === otherTile.index && tile.angle === otherTile.angle;
        const isRepeatX = isSameTile && ['left', 'right'].includes(direction);
        const isRepeatY = isSameTile && ['top', 'bottom'].includes(direction);

        if (isRepeatX && !tile.repeatX) return false;
        if (isRepeatY && !tile.repeatY) return false;
        let pixels: number[], otherPixels: number[];

        switch (direction) {
          case 'top':
            pixels = [tile.pixels[0][0], tile.pixels[0][1], tile.pixels[0][2]];
            //prettier-ignore
            otherPixels = [ otherTile.pixels[2][0], otherTile.pixels[2][1], otherTile.pixels[2][2]];
            break;
          case 'bottom':
            pixels = [tile.pixels[2][0], tile.pixels[2][1], tile.pixels[2][2]];
            //prettier-ignore
            otherPixels = [ otherTile.pixels[0][0], otherTile.pixels[0][1], otherTile.pixels[0][2]];
            break;
          case 'left':
            pixels = [tile.pixels[0][0], tile.pixels[1][0], tile.pixels[2][0]];
            //prettier-ignore
            otherPixels = [ otherTile.pixels[0][2], otherTile.pixels[1][2], otherTile.pixels[2][2]];
            break;
          case 'right':
            pixels = [tile.pixels[0][2], tile.pixels[1][2], tile.pixels[2][2]];
            //prettier-ignore
            otherPixels = [ otherTile.pixels[0][0], otherTile.pixels[1][0], otherTile.pixels[2][0]];
            break;
        }

        return otherPixels.every((pixel, index) => pixels[index] === pixel);
      })
      .map(tile => `${tile.index}:${tile.angle}`);
  };

  layout.forEach(tileMeta => {
    map.set(getConstraintKey(tileMeta), {
      top: getConstraints(tileMeta, 'top'),
      bottom: getConstraints(tileMeta, 'bottom'),
      left: getConstraints(tileMeta, 'left'),
      right: getConstraints(tileMeta, 'right')
    });
  });

  fs.writeJSONSync(
    path.join(process.cwd(), 'debug.json'),
    Object.fromEntries(map.entries())
  );
  return map;
};

const createMapLayout = (
  layoutMap: LayoutMeta,
  constraintsMap: ConstraintsMap
) => {
  const layout: Matrix<TileMeta> = Array.from(
    { length: WIDTH * HEIGHT },
    () => [...layoutMap]
  );
  const lockedIndices: number[] = [];

  const updateLayoutAt = (index: number, newTiles: TileMeta[]) => {
    if (index < 0 || index > layout.length - 1) {
      // console.log(`cell ${index} is out of bound. Skipping update`);
      return;
    }
    if (newTiles.length === 1) {
      if (layout[index].length === 1) {
        // console.log(
        //   chalk.yellow(
        //     `replacing tile ${newTiles[0].index}:${newTiles[0].angle} from tile ${layout[index][0].index}:${layout[index][0].angle} on cell ${index}. This should not happen.`
        //   )
        // );
      } else {
        // console.log(
        //   chalk.green(
        //     `Locked tile ${newTiles[0].index}:${newTiles[0].angle} on cell ${index}`
        //   )
        // );
      }
      lockedIndices.push(index);
    } else {
      // console.log(
      //   `constrained cell ${index} from ${layout[index].length} to ${newTiles.length} possibilities.`
      // );
    }
    layout[index] = newTiles;
  };

  const getNeighbors = (index: number) => {
    const isEdgeLeft = index % WIDTH === 0;
    const isEdgeRight = index % WIDTH === WIDTH - 1;
    const isEdgeTop = index < WIDTH;
    const isEdgeBottom = layout.length - 1 - index < WIDTH;

    return {
      // prettier-ignore
      left: isEdgeLeft ? null : { index: index - 1, cell: layout[index - 1] },
      // prettier-ignore
      right: isEdgeRight ? null : { index: index + 1, cell: layout[index + 1] },
      // prettier-ignore
      top: isEdgeTop ? null : { index: index - WIDTH, cell: layout[index - WIDTH] },
      // prettier-ignore
      bottom: isEdgeBottom ? null : { index: index + WIDTH, cell: layout[index + WIDTH] },
      // prettier-ignore
      topLeft: (isEdgeLeft ||isEdgeTop) ? null: { index: index - WIDTH - 1, cell: layout[index - WIDTH - 1] },
      // prettier-ignore
      topRight: (isEdgeRight || isEdgeTop) ? null: { index: index - WIDTH + 1, cell: layout[index - WIDTH + 1]},
      // prettier-ignore
      bottomLeft: (isEdgeLeft || isEdgeBottom) ? null : { index: index + WIDTH - 1, cell: layout[index + WIDTH - 1] },
      // prettier-ignore
      bottomRight: (isEdgeRight || isEdgeBottom) ? null : { index: index + WIDTH + 1, cell: layout[index + WIDTH + 1] }
    };
  };

  const getIntersection = (baseCell: TileMeta[], ...otherCells: string[][]) => {
    const filtered = otherCells.filter(t => t.length);

    const intersection = baseCell.filter(tile =>
      filtered.every(otherCell =>
        otherCell.some(otherTile => otherTile === getConstraintKey(tile))
      )
    );

    if (intersection.length === 0) {
      throw new Error(`Empty intersection on cell ${layout.indexOf(baseCell)}`);
    }
    return intersection;
  };

  const constrainCell = (index: number) => {
    if (isLocked(index)) {
      // console.log(
      //   `Cell ${index} is already locked and cannot be constrained anymore. skipping.`
      // );
      return false;
    }

    const { top, bottom, left, right } = getNeighbors(index);
    const oldLength = layout[index].length;

    const constraints = {
      top:
        top?.cell.map(tile => constraintsMap.get(getConstraintKey(tile))!) ??
        [],
      bottom:
        bottom?.cell.map(tile => constraintsMap.get(getConstraintKey(tile))!) ??
        [],
      left:
        left?.cell.map(tile => constraintsMap.get(getConstraintKey(tile))!) ??
        [],
      right:
        right?.cell.map(tile => constraintsMap.get(getConstraintKey(tile))!) ??
        []
    };

    const sets = {
      top: [
        ...new Set(constraints.top.map(constraint => constraint.bottom).flat())
      ],
      bottom: [
        ...new Set(constraints.bottom.map(constraint => constraint.top).flat())
      ],
      left: [
        ...new Set(constraints.left.map(constraint => constraint.right).flat())
      ],
      right: [
        ...new Set(constraints.right.map(constraint => constraint.left).flat())
      ]
    };

    // console.log('getting intersection of cells', {
    //   top: {
    //     index: top?.index,
    //     constraints:
    //       sets.top.length === constraintsMap.size
    //         ? 'any tile'
    //         : sets.top.join(', ')
    //   },
    //   bottom: {
    //     index: bottom?.index,
    //     constraints:
    //       sets.bottom.length === constraintsMap.size
    //         ? 'any tile'
    //         : sets.bottom.join(', ')
    //   },
    //   left: {
    //     index: left?.index,
    //     constraints:
    //       sets.left.length === constraintsMap.size
    //         ? 'any tile'
    //         : sets.left.join(', ')
    //   },
    //   right: {
    //     index: right?.index,
    //     constraints:
    //       sets.right.length === constraintsMap.size
    //         ? 'any tile'
    //         : sets.right.join(', ')
    //   }
    // });
    const intersection = getIntersection(layout[index], ...Object.values(sets));

    // console.log(
    //   'intersection is',
    //   intersection.map(t => getConstraintKey(t)).join(', ')
    // );

    updateLayoutAt(index, intersection);

    return oldLength > intersection.length;
  };

  const updateNeighbors = (index: number) => {
    const cell = layout[index];
    if (!cell) return;

    let needNewPass = true;
    const updatePass = () => {
      // console.log(chalk.bold('=== New update pass for cell', index));
      needNewPass = false;
      const neighbors = getNeighbors(index);

      Object.entries(neighbors).forEach(([direction, neighbor]) => {
        if (!neighbor) return;
        // console.log(
        //   `constraining neighbor ${chalk.blueBright(
        //     direction
        //   )} on cell ${chalk.blueBright(neighbor.index)}`
        // );
        const hasChangd = constrainCell(neighbor.index);
        if (hasChangd) needNewPass = true;
      });
    };

    while (needNewPass) {
      updatePass();
      // if (needNewPass)
      //   console.log(
      //     'Some neighbors have been constrained. A new update pass is necessary'
      //   );
    }
  };

  const placeTile = (index: number) => {
    // console.log('============ PLACE TILE', index, '======================');
    if (lockedIndices.includes(index)) {
      // console.log(`tile ${index} has already been locked. Skipping.`);
      return;
    }

    const cell = layout[index];
    const tile = weightedRandom(
      cell.map(tileMeta => ({ value: tileMeta, weight: tileMeta.weight }))
    );

    updateLayoutAt(index, [tile]);
    updateNeighbors(index);
  };

  const queue = [randomInt(layout.length - 1)];

  const isLocked = (index: number) => lockedIndices.includes(index);
  while (queue.length > 0) {
    const index = queue.shift()!;
    try {
      placeTile(index);
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      layout[index][0].isError = true;
      console.log(chalk.red(err));
    }

    console.log(`${layout.length - lockedIndices.length} tiles remaining.`);

    const { top, bottom, left, right } = getNeighbors(index);
    const checkValidity = (index: number) =>
      index >= 0 &&
      index < layout.length &&
      !isLocked(index) &&
      !queue.includes(index);

    if (top && checkValidity(top.index)) {
      queue.push(top.index);
    }
    if (bottom && checkValidity(bottom.index)) {
      queue.push(bottom.index);
    }
    if (left && checkValidity(left.index)) {
      queue.push(left.index);
    }
    if (right && checkValidity(right.index)) {
      queue.push(right.index);
    }
  }

  return layout;
};

export const createMap = async (): Promise<any> => {
  const layoutMeta = await parseLayoutMeta();
  const constraintsMap = createConstraintsMap(layoutMeta);

  try {
    const rawLayout = createMapLayout(layoutMeta, constraintsMap);
    return rawLayout.map(cell => {
      return cell.length === 1
        ? {
            tileIndex: cell[0].index,
            angle: cell[0].angle
          }
        : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        cell[0].isError
        ? 'ERROR'
        : null;
    });
  } catch (err) {
    console.log(err);
    throw err;
  }

  // return {
  //   constraints: Object.fromEntries(constraintsMap.entries()),
  //   layoutMeta
  // };
};
