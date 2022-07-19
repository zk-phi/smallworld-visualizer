export type Color = [number, number, number];

export const RGB2YIQ = (rgb: Color): Color => ([
  (rgb[0] * 0.299 + rgb[1] *  0.587 + rgb[2] *  0.114) / 255,
  (rgb[0] * 0.596 + rgb[1] * -0.274 + rgb[2] * -0.321) / 255,
  (rgb[0] * 0.211 + rgb[1] * -0.523 + rgb[2] *  0.311) / 255,
]);

export const YIQ2RGB = (yiq: Color): Color => ([
  (yiq[0] * 1.000 + yiq[1] *  0.956 + yiq[2] *  0.621) * 255,
  (yiq[0] * 1.000 + yiq[1] * -0.272 + yiq[2] * -0.647) * 255,
  (yiq[0] * 1.000 + yiq[1] * -1.107 + yiq[2] *  1.705) * 255,
]);

export const rotYIQ = (yiq: Color, amount: number): Color => {
  const amountRad = amount / 360 * 2 * Math.PI;
  const newHue = Math.atan2(yiq[2], yiq[1]) + amountRad;
  const chroma = Math.sqrt(yiq[2] ** 2 + yiq[1] ** 2);
  return [yiq[0], chroma * Math.cos(newHue), chroma * Math.sin(newHue)];
};
