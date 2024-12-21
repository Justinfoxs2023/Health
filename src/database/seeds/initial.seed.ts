import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { User } from '../../entities/user/user.entity';

export default class InitialDatabaseSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<void> {
    // 创建管理员用户
    await connection
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([
        {
          username: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          profile: {
            nickname: '系统管理员',
            avatar: 'default_admin.png',
          },
        },
      ])
      .execute();

    // 创建测试用户
    await factory(User)().createMany(10);
  }
}
