module.exports = (sequelize, DataTypes) => {
  const Campaign = sequelize.define("Campaign", {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    goal: DataTypes.INTEGER,
    status: {
      type: DataTypes.STRING,
      defaultValue: "active"
    }
  });

  return Campaign;
};