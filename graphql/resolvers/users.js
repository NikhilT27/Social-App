const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { validateRegisterInput } = require("../../util/validators");
const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      //TODO: Validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }
      //TODO: Make sure user doesn't exist already
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError("Username is taken", {
          error: {
            username: "This username is already taken",
          },
        });
      }
      //hashing password
      password = await bcrypt.hash(password, 12);

      //enter data to User model
      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      //save to MongoDB database
      const res = await newUser.save();

      const token = jwt.sign(
        {
          id: res.id,
          username: res.username,
          email: res.email,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};
