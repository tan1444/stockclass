import * as Sequelize from 'sequelize';
import { providerWrapper } from 'midway';

providerWrapper([
  {
    id: 'dictModel',
    provider: setupModel,
  },
]);

export default async function setupModel(context) {
  const db = await context.getAsync('mysqlDB');
  const { STRING, DATE } = Sequelize;

  return db.sequelize.define('dict', {
    id: {
      type: STRING(8),
      allowNull: false,
      primaryKey: true
    },
    parentid: {
      type: STRING(8),
      allowNull: false,
      defaultValue: ''
    },
    cname: {
      type: STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    ename: {
      type: STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    createdAt: {
      type: DATE,
      allowNull: true
    },
    updatedAt: {
      type: DATE,
      allowNull: true
    }
  }, {
      tableName: 'dict'
    });
}
