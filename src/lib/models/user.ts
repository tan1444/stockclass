import * as Sequelize from 'sequelize';
import { providerWrapper } from 'midway';

providerWrapper([
  {
    id: 'userModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context) {
  const db = await context.getAsync('mysqlDB');
  const { STRING, INTEGER, DATE } = Sequelize;

  return db.sequelize.define('user', {
    id: {
      type: INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    loginname: {
      type: STRING,
      allowNull: false,
      defaultValue: ''
    },
    password: {
      type: STRING,
      allowNull: false,
      defaultValue: ''
    }, 
    createdAt: {
      type: DATE
    },
    updatedAt: {
      type: DATE
    }
  }, {
      tableName: 'user'
    });
}
