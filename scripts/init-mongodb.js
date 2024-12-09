db = db.getSiblingDB('admin');

// 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "password",  // 请使用安全的密码
  roles: [
    { role: "userAdminAnyDatabase", db: "admin" },
    { role: "readWriteAnyDatabase", db: "admin" }
  ]
});

// 切换到应用数据库
db = db.getSiblingDB('health_management_dev');

// 创建应用数据库用户
db.createUser({
  user: "dev_user",
  pwd: "dev_password",  // 使用 .env 中配置的密码
  roles: [
    { role: "readWrite", db: "health_management_dev" }
  ]
});

// 创建基础集合
db.createCollection("users");
db.createCollection("health_records");
db.createCollection("settings"); 