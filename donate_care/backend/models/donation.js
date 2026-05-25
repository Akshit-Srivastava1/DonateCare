module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define("Donation", {

    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false
    },

    // 💰 MONEY
    amount: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    // 🩸 BLOOD
    bloodGroup: {
      type: DataTypes.STRING,
      allowNull: true
    },

    // 🎁 OTHER
    item: {
      type: DataTypes.STRING,
      allowNull: true
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: true
    }

  });

  return Donation;
};