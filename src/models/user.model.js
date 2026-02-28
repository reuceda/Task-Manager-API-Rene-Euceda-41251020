import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import sequelize from "../config/database.js";

const Users = sequelize.define("Users", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
        name: 'unique_name',
        msg: 'Name already exists',
    },
    validate: {
      notEmpty: {
        msg: "Name cannot be empty",
      },
      len: {
        args: [3, 50],
        msg: "Name must be between 3 and 50 characters",
      },
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: {
        name: 'unique_email',
        msg: 'Email already exists',
    },
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
      notEmpty: {
        msg: "Email cannot be empty",
      },
    },
  },
  password: {
    type: DataTypes.STRING(225),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "Password cannot be empty",
      },
      len: {
        args: [6, 225],
        msg: "Password must be at least 6 characters",
      },
    },
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
},{
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        hooks: {
            beforeCreate: async (user) => {
                if (user.password) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    user.password = await bcrypt.hash(user.password, 12);
                }
            },
        },
    }
);

Users.prototype.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

Users.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.deletedAt;
    delete values.password;
    return values;
};
export default Users;