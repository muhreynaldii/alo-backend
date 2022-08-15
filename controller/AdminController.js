import Admin from "../models/AdminModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const getAdmin = async (req, res) => {
  try {
    const response = await Admin.findAll({
      attributes: ["id", "nama", "email"],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const Register = async (req, res) => {
  const { nama, email, password, confPassword } = req.body;
  if (password !== confPassword)
    return res.status(400).json({ msg: "Password tidak sama" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);

  const isExist1 = await Admin.findOne({ where: { email: email } });
  if (isExist1) {
    return res.status(400).json({
      status: "fail",
      message: "user has already exist",
      data: null,
    });
  }

  try {
    await Admin.create({
      nama: nama,
      email: email,
      password: hashPassword,
    });
    res.json({ msg: "Berhasil Register" });
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req, res) => {
  try {
    const user = await Admin.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });
    const userId = user[0].id;
    const nama = user[0].nama;
    const email = user[0].email;
    const accessToken = jwt.sign(
      { userId, nama, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );
    const refreshToken = jwt.sign(
      { userId, nama, email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    await Admin.update(
      { refresh_token: refreshToken },
      {
        where: {
          id: userId,
        },
      }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24,
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(404).json({ msg: "email tidak ditemukan" });
  }
};

export const Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await Admin.findAll({
    where: {
      refresh_token: refreshToken,
    },
  });
  if (!user[0]) return res.sendStatus(204);
  const userId = user[0].id;
  await Admin.update({ refresh_token: null }, { where: { id: userId } });
  res.clearCookie("refreshToken");
  return res.sendStatus(200);
};
