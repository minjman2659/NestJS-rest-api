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
import { PostEntity } from '../posts/post.entity';

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
  @Column({ length: 10, type: 'varchar', nullable: true, select: false }) // social 로그인일 경우 비밀번호 없을 수도 있음!
  password: string;

  @IsEmail({}, { message: '올바른 이메일을 작성해주세요.' })
  @IsNotEmpty({ message: '이메일을 작성해주세요.' })
  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: false })
  isAdmin: boolean;

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
}
