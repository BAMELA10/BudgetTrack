import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateUserPayload,
  EditUserPayload,
  EditUserSecretPayload,
  UserDto,
  UserWithSecret,
} from '../schema';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace';

@Injectable()
export class UserService {
  constructor(public prisma: PrismaService) {}

  async findByIdentifier(email: string): Promise<UserWithSecret | null> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { secret: true },
    });
  }

  async findOne(id: string): Promise<UserWithSecret> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { id },
      include: { secret: true },
    });
  }
  async setLastSignIn(userId: string) {
    await this.prisma.secrets.update({
      where: { userId },
      data: { lastSignedIn: new Date(Date.now()) },
    });
  }
  async create(payload: CreateUserPayload): Promise<UserDto> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name: payload.name,
          email: payload.email,
          secret: {
            create: {
              password: payload.password,
              lastSignedIn: new Date(Date.now()),
            },
          },
        },
      });
      return user;
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException({
          message: 'UserWithEmailAlreadyExists',
          target: error.meta?.target,
        });
      }
      throw new InternalServerErrorException();
    }
  }

  async updateUser(id: string, payload: EditUserPayload): Promise<UserDto> {
    return await this.prisma.user.update({
      where: { id },
      data: payload,
    });
  }

  async updateSecrets(
    id: string,
    payload: EditUserSecretPayload,
  ): Promise<UserWithSecret> {
    await this.prisma.secrets.update({ where: { userId: id }, data: payload });
    return await this.findOne(id);
  }
}
