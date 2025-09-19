import bcrypt from 'bcrypt';

export default function defineUser(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(60), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true, validate: { isEmail: true } },
    address: { type: DataTypes.STRING(400), allowNull: true, defaultValue: '' },
    role: { type: DataTypes.ENUM('admin', 'user', 'owner'), allowNull: false, defaultValue: 'user' },
    password_hash: { type: DataTypes.STRING(200), allowNull: false }
  }, {
    tableName: 'users',
    timestamps: false,
  });

  User.prototype.verifyPassword = function (plain) {
    return bcrypt.compare(plain, this.password_hash);
  };

  User.beforeCreate(async (user) => {
    if (user.password_hash && user.password_hash.length < 60) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  User.beforeUpdate(async (user) => {
    if (user.changed('password_hash')) {
      const salt = await bcrypt.genSalt(10);
      user.password_hash = await bcrypt.hash(user.password_hash, salt);
    }
  });

  return User;
}
