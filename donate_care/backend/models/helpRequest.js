module.exports = (sequelize, DataTypes) => {
  const HelpRequest = sequelize.define("HelpRequest", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
  type: DataTypes.INTEGER,
  allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    detail: {
      type: DataTypes.STRING
    },
    message: {
      type: DataTypes.TEXT
    }
  });

  return HelpRequest;
};