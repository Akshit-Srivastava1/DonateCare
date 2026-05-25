module.exports = (sequelize, DataTypes) => {
  const Emergency = sequelize.define("Emergency", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // phone: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    hospital: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
    },
    longitude: {
      type: DataTypes.FLOAT,
    },
  });

  return Emergency;
};