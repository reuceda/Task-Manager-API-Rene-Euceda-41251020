import sequelize from "../config/database.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";

import Task from "./task.model.js";

//relaciones
User.hasMany(RefreshToken, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
RefreshToken.belongsTo(User, { foreignKey: "userId", as: "user" });
export { sequelize, User, RefreshToken };

Task.hasMany(User, { foreignKey: "userId", as: "tasks", onDelete: "CASCADE" });
User.belongsTo(Task, { foreignKey: "userId", as: "user" });
export { Task };