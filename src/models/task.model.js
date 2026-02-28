import { DataTypes, ENUM } from "sequelize";
import sequelize from "../config/database.js";

const Tasks = sequelize.define("Tasks", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  status: {
    type: ENUM('pending', 'in-progress', 'completed'),
    allowNull: false,
    defaultValue: 'pending',
  },
  //relacion con usuario
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
},{
        tableName: 'Tasks',
        timestamps: true,
    }
);

export default Tasks;