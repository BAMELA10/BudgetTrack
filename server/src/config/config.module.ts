import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { envSchema } from './config-schema';
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../../env',
      validationSchema: envSchema,
      //validationOptions: { abortEarly: false },
    }),
  ],
  exports: [],
})
export class ConfigModule {}
