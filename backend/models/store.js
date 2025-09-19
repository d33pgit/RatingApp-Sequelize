export default function defineStore(sequelize, DataTypes) {
  const Store = sequelize.define('Store', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: true },
    address: { type: DataTypes.STRING(400), allowNull: true, defaultValue: '' },
    owner_id: { type: DataTypes.INTEGER, allowNull: true }
  }, {
    tableName: 'stores',
    timestamps: false,
  });

  return Store;
}
