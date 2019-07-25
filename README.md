# 生成数据库实体命令
# 需要先安排依赖
npm install -g mysql
npm install -g sequelize-auto
sequelize-auto -h localhost -d unitesys  -u root -x 123456 -p 3306

# 数据库为db first
先在数据库中新建数据库unitesys，再将项目中的unitesys.sql在navicate中运行生成表
