import { IsBoolean, IsNotEmpty, IsString, IsNumber } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '@modules/users/user.entity';

@Entity({ name: 'Posts' })
export class PostEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNumber()
  userId: number;

  @IsString()
  @IsNotEmpty({ message: '제목을 작성해주세요.' })
  @Column({ type: 'varchar', nullable: false })
  title: string;

  @IsString()
  @Column({ type: 'text', nullable: true }) // 임시저장 상태일 경우 콘텐츠는 없을 수 있음!
  content: string;

  @Column({ type: 'varchar', nullable: true })
  thumbnail: string;

  @IsBoolean()
  @Column({ type: 'boolean', default: true })
  isTemp: boolean;

  @Column()
  @CreateDateColumn()
  createdAt!: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt!: Date;

  //* Relation */

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
}
