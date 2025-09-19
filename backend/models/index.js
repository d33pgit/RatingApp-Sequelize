import { DataTypes } from 'sequelize';
import sequelize from '../db.js';
import defineUser from './user.js';
import defineStore from './store.js';
import defineRating from './rating.js';

const User = defineUser(sequelize, DataTypes);
const Store = defineStore(sequelize, DataTypes);
const Rating = defineRating(sequelize, DataTypes);


User.hasMany(Store, { foreignKey: 'owner_id', as: 'stores' });
Store.belongsTo(User, { foreignKey: 'owner_id', as: 'owner' });

User.belongsToMany(Store, { through: Rating, foreignKey: 'user_id', otherKey: 'store_id', as: 'ratedStores' });
Store.belongsToMany(User, { through: Rating, foreignKey: 'store_id', otherKey: 'user_id', as: 'raters' });

Rating.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Rating.belongsTo(Store, { foreignKey: 'store_id', as: 'store' });

export { sequelize, User, Store, Rating };
