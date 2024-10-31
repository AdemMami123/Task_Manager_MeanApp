const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

router.post("/register", (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .send({ status: "notok", msg: "Please enter all required data" });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        return res
          .status(400)
          .send({ status: "notokmail", msg: "Email already exists" });
      }

      const newUser = new User({
        username,
        email,
        password,
        role,
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          return res
            .status()
            .send({ status: "error", msg: "Internal server error99" });
        }

        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return res
              .status(500)
              .send({ status: "error", msg: "Internal server error88" });
          }

          newUser.password = hash;
          newUser
            .save()
            .then((user) => {
              jwt.sign(
                { id: user.id },
                config.get("jwtsecret"),
                { expiresIn: config.get("tokenExpire") },
                (err, token) => {
                  if (err) {
                    return res.status(500).send({
                      status: "error",
                      msg: "Internal server error55",
                    });
                  }
                  res.status(200).send({
                    status: "ok",
                    msg: "Successfully registered",
                    token,
                    user,
                  });
                }
              );
            })
            .catch((err) => {
              console.error("Error saving user:", err); // Log the error to the console
              return res
                .status(500)
                .send({ status: "error", msg: "Internal server error33" });
            });
        });
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ status: "error", msg: "Internal server error11" });
    });
});

// Login Backend

/// @route   POST
// @desc    Login user
// @access  Public
router.post("/login-user", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please provide email and password" });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return res.status(401).json({ error: "Incorrect password" });
        } // Ajoutez ici le rôle de l'utilisateur à la réponse

        jwt.sign(
          { id: user.id, role: user.role }, // Incluez le rôle dans le payload du token si nécessaire
          config.get("jwtsecret"),
          { expiresIn: config.get("tokenExpire") },
          (err, token) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ error: "Internal server error" });
            } // Retournez le token et le rôle dans la réponse

            return res.status(200).json({ token, role: user.role });
          }
        );
      });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Internal server error" });
    });
});

//lister les utlisateurs

//tp pour le classe
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//pour classe
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "User not found" });
    }
    res.status(500).send("Server Error");
  }
});
//pour classe
router.put("/:id", async (req, res) => {
  const { username, email, password, role } = req.body;

  // Build user object
  const userFields = {};
  if (username) userFields.username = username;
  if (email) userFields.email = email;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    userFields.password = await bcrypt.hash(password, salt);
  }
  if (role) userFields.role = role;

  try {
    let user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: userFields },
      { new: true }
    );

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
//supprimer un utlisateur pour classe
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression de l'utilisateur",
      error,
    });
  }
});

module.exports = router;
