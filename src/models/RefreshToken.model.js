import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
const RefreshToken = sequelize.define(
    "RefreshToken",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        isRevoked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        ipAddress: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        userAgent: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
    },
    {
        timestamps: true,
        tableName: "refresh_tokens",
        indexes: [
            {fields: ["userId"]},
            {fields: ["token"], type: 'FULLTEXT'},
            {fields: ["expiresAt"]},
        ],
    }
);
RefreshToken.isValid = function(tokenRecord) {
    return !tokenRecord.isRevoked && new Date() < new Date(tokenRecord.expiresAt);
};
export default RefreshToken;