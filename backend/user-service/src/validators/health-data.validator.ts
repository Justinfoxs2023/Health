import Joi from 'joi';

export const HealthDataValidation = Joi.object({
  type: Joi.string()
    .valid('vital', 'activity', 'sleep', 'nutrition')
    .required(),

  metrics: Joi.object({
    heartRate: Joi.number()
      .min(30)
      .max(220),

    bloodPressure: Joi.object({
      systolic: Joi.number()
        .min(70)
        .max(200),
      diastolic: Joi.number()
        .min(40)
        .max(130)
    }),

    bloodSugar: Joi.number()
      .min(2)
      .max(30),

    weight: Joi.number()
      .min(1)
      .max(500),

    height: Joi.number()
      .min(30)
      .max(300),

    temperature: Joi.number()
      .min(35)
      .max(43),

    oxygenSaturation: Joi.number()
      .min(50)
      .max(100),

    sleepDuration: Joi.number()
      .min(0)
      .max(24),

    steps: Joi.number()
      .min(0)
      .max(100000)
  }).required(),

  source: Joi.string()
    .required(),

  deviceInfo: Joi.object({
    deviceId: Joi.string(),
    deviceType: Joi.string(),
    manufacturer: Joi.string()
  }),

  tags: Joi.array()
    .items(Joi.string()),

  notes: Joi.string()
    .max(1000)
}); 