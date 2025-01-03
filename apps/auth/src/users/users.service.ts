import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

import * as bcrypt from 'bcryptjs';
import { GetUsertDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    await this.validateCreateUserDto(createUserDto);

    return this.usersRepository.create({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });
  }

  private async validateCreateUserDto(createUserDto: CreateUserDto) {
    try {
      await this.usersRepository.findOne({ email: createUserDto.email });
    } catch (error) {
      console.log(error);
      return;
    }
    throw new UnauthorizedException('Email already exists.');
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }

    return user;
  }

  async getUser(getUserDto: GetUsertDto) {
    return this.usersRepository.findOne(getUserDto);
  }
}
