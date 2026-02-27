import * as joi from 'joi';

process.loadEnvFile();

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
}

const envVarsSchema = joi
  .object<EnvVars>({
    PORT: joi.number().default(3000),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

function validateSchema<T>(
  schema: joi.ObjectSchema<T>,
  input: Record<string, unknown>,
): T {
  const result = schema.validate(input, { abortEarly: false });

  if (result.error) {
    throw new Error(`Config validation error: ${result.error.message}`);
  }

  return result.value;
}

const rawEnv: Record<string, unknown> = process.env;

export const envs: EnvVars = validateSchema(envVarsSchema, rawEnv);
