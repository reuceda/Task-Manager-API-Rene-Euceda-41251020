import sequelize from "../config/database.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";

import Tasks from "./task.model.js";

//relaciones
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });
export { sequelize, User, RefreshToken };

Tasks.hasMany(User, { foreignKey: "userId", as: "tasks", onDelete: "CASCADE" });
User.belongsTo(Tasks, { foreignKey: "userId", as: "user" });
export { Tasks };