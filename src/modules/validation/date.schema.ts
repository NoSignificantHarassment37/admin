import * as z from 'zod';
const fechaISO8601Schema = z.string().refine(
  (value) => {
    // ISO 8601 completo con hora y zona: YYYY-MM-DDTHH:mm:ssZ
    const isoRegex =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

    return isoRegex.test(value);
  },
  {
    message: "La fecha DEBE estar en formato ISO 8601 (ej: 2025-11-13T00:00:00Z)"
  }
);
export { fechaISO8601Schema };