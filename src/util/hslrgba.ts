import {colord, Colord, HslaColor, HslColor, RgbaColor, RgbColor} from "colord";

export type HSLRGBA = {
	h: number;
	s: number;
	l: number;
	r: number;
	g: number;
	b: number;
	a: number;
}

export type HSLAOrRGBA = {
	h: number;
	s: number;
	l: number;
	a?: number;
} | {
	r: number;
	g: number;
	b: number;
	a?: number;
};

export function hslrgbaFrom(color: Colord | RgbColor | RgbaColor | HslColor | HslaColor): HSLRGBA {
	const cd = colord(color);
	if (color instanceof Colord) {
		return {...color.toRgb(), ...color.toHsl()};
	}
	if ("h" in color) {
		return {...color, ...cd.toRgb()};
	}
	return {...color, ...cd.toHsl()};
}

export function hslrgbaUpdate(original: HSLRGBA, update: Partial<HSLRGBA>) {
	if ("h" in update || "s" in update || "l" in update) {
		return hslrgbaFrom({ h: original.h, s: original.s, l: original.l, a: original.a, ...update });
	}
	return hslrgbaFrom({ r: original.r, g: original.g, b: original.b, ...update });
}