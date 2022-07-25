import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as jwt from 'jsonwebtoken';
import { PostEntity } from '@modules/posts/post.entity';
import { AccessTokenPayload, RefreshTokenPayload } from './types';

@Index('email', ['email'], { unique: true })
@Entity({ name: 'Users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty({ message: '이름을 작성해주세요.' })
  @Column({ length: 10, type: 'varchar', nullable: false })
  name: string;

  @IsString()
  @Column({ type: 'varchar', nullable: true, select: false }) // social 로그인일 경우 비밀번호 없을 수도 있음!
  password: string;

  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isSeceder: boolean;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  //* Relation */

  @OneToMany(() => PostEntity, (post) => post.user, {
    cascade: true,
  })
  posts: PostEntity[];

  //* Instance Method */

  async generateAccessToken() {
    const payload: AccessTokenPayload = {
      id: this.id,
      email: this.email,
      name: this.name,
      isAdmin: this.isAdmin,
      isSeceder: this.isSeceder,
    };
    const accessToken = await this.generateToken(payload, '24h');
    return { accessToken };
  }

  async generateRefreshToken() {
    const payload: RefreshTokenPayload = {
      id: this.id,
      email: this.email,
    };
    const refreshToken = await this.generateToken(payload, '30d');
    return { refreshToken };
  }

  private generateToken(
    payload: AccessTokenPayload | RefreshTokenPayload,
    expiresIn: string | number,
  ): Promise<string> {
    const apiHost = process.env.API_HOST;
    const jwtSecret = process.env.SECRET_KEY;

    const jwtOptions: jwt.SignOptions = {
      issuer: apiHost,
      expiresIn,
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, jwtSecret, jwtOptions, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
  }
}
