import Joi from 'joi';

export const assessmentSchema = Joi.object({
  clientId: Joi.string().required(),
  type: Joi.string().required(),
  results: Joi.object().required(),
  recommendations: Joi.array().items(Joi.string()),
  status: Joi.string().valid('draft', 'completed')
});

export const planSchema = Joi.object({
  clientId: Joi.string().required(),
  type: Joi.string().required(),
  goals: Joi.array().items(Joi.string()).required(),
  activities: Joi.array().items(Joi.object()).required(),
  duration: Joi.number().required(),
  status: Joi.string().valid('active', 'completed', 'cancelled')
});

export const recordSchema = Joi.object({
  clientId: Joi.string().required(),
  type: Joi.string().required(),
  data: Joi.object().required(),
  status: Joi.string().valid('active', 'archived', 'deleted')
});

export const validateAssessment = (data: any) => assessmentSchema.validate(data);
export const validatePlan = (data: any) => planSchema.validate(data);
export const validateRecord = (data: any) => recordSchema.validate(data); 