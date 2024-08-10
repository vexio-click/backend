import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AppellantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: number;

  @Column()
  interest: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value == null ? undefined : value))
  image: string;
}
