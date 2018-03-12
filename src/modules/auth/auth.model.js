import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt-nodejs";
import uniqueValidator from "mongoose-unique-validator";
import validator from "validator";

const AuthSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    validate: {
      validator: email => validator.isEmail(email),
      message: "{VALUE} is not valid email."
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true
  }
});

AuthSchema.plugin(uniqueValidator, {
  message: "{VALUE} is already token!"
});

// hash user password before save in db.
AuthSchema.pre("save", function(next) {
  const user = this;
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }

    bcrypt.hash(user.password, salt, undefined, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

//
AuthSchema.statics.findByCredentials = function(email, password) {
  return this.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          return reject();
        }

        return resolve(user);
      });
    });
  });
};

export default mongoose.model("Auth", AuthSchema);
