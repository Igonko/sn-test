import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

// Update entity
// Indexes one, group, with condition
// Uniq contstraint

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index('email')
  email: string;

  @Column({ name: 'username', type: 'varchar', length: 36 })
  username: string;

  @Column()
  password: string;

  @Column()
  cognitoId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
