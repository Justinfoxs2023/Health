/**
 * @fileoverview TS 文件 social-interaction.entity.ts 的功能描述
 * @author Team
 * @copyright 2024 组织名称
 * @license ISC
 */

@Entity()
export class SocialInteraction {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  targetId: string;

  @Column()
  type: string;

  @Column()
  timestamp: Date;

  @Column()
  metadata: Record<string, any>;

  @ManyToOne() => UserGameProfile)
  user: UserGameProfile;

  @ManyToOne() => UserGameProfile)
  target: UserGameProfile;
}
