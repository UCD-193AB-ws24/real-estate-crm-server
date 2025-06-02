const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

console.log("🔥 DB_URL:", process.env.DB_URL);


const Lead = sequelize.define(
  "Lead",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    state: { type: DataTypes.STRING, allowNull: false },
    zip: { type: DataTypes.STRING, allowNull: false },
    owner: { type: DataTypes.STRING, allowNull: true },
    images: { 
      type: DataTypes.JSONB, 
      allowNull: true, 
      defaultValue: [],
      validate: {
        maxImages(value) {
          if (value && value.length > 10) {
            throw new Error('Maximum 10 images allowed');
          }
        }
      },
      get() {
        const rawImages = this.getDataValue('images');
        return rawImages || [];
      }
    },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "Lead" },
    userId: { type: DataTypes.STRING, allowNull: false, references: { model: "users", key: "id" } },
    notes: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "leads", timestamps: false }
);

module.exports = Lead; 