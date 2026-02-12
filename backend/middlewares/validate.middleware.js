import { ValidationError } from "yup";

export const validate = (schema, source = "body") => async (req, res, next) => {
  try {
    const validated = await schema.validate(req[source], { abortEarly: false, stripUnknown: true });
    req[source] = validated;
    return next();
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ success: false, message: "Validation failed", errors: err.errors });
    }
    return next(err);
  }
};
