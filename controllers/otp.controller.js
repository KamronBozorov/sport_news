const config = require("config");
const { encode, decode } = require("../helpers/crypt.js");
const pool = require("../config/db.js");
const otpGenerator = require("otp-generator");
const uuid = require("uuid");
const errorHandler = require("../helpers/error-handler");
const { addM } = require("../helpers/add_minute.js");

const createOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Telefon raqami kerak" });
    }

    const otp = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const now = new Date();

    const expirationTime = addM(now, config.get("expiration_time"));

    const newOtp = await pool.query(
      `
      INSERT INTO otp (id, otp, expiration_date) VALUES ($1, $2, $3) RETURNING id
      `,
      [uuid.v4(), otp, expirationTime],
    );

    const detail = {
      timestamp: now,
      phone_number: phone,
      otp_id: newOtp.rows[0].id,
    };

    const encodedData = await encode(JSON.stringify(detail));

    res.status(201).json({
      message: "OTP muvaffaqiyatli yaratildi",
      otp, // Faqat test uchun qoldiring, prod uchun chiqarib tashlang!
      encodedData,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { verification_key, phone_number, otp } = req.body;

    if (!verification_key || !phone_number || !otp) {
      return res
        .status(400)
        .json({ message: "Verification key, phone number va otp kerak" });
    }

    const decodedData = await decode(verification_key);
    const detail = JSON.parse(decodedData);

    console.log(decodedData);

    if (detail.phone_number !== phone_number) {
      return res.status(400).json({ message: "Telefon raqam mos emas" });
    }

    const otpResult = await pool.query(
      "SELECT * FROM otp WHERE id = $1 AND otp = $2",
      [detail.otp_id, otp],
    );

    if (otpResult.rows.length > 0) {
      const now = new Date();
      const expirationDate = otpResult.rows[0].expiration_date;

      if (now > expirationDate) {
        const response = {
          Status: "Failure",
          Message: "OTP muddati tugagan",
        };

        return res.status(200).send(response);
      }

      if (otpResult.otp !== otp) {
        const response = {
          Status: "Failure",
          Message: "OTP noto'g'ri",
        };

        return res.status(200).send(response);
      }

      const response = {
        Status: "Success",
        Message: "OTP muvaffaqiyatli tasdiqlandi",
      };

      return res.status(200).send(response);
    }

    if (otpResult.rows.length === 0) {
      const response = {
        Status: "Failure",
        Message: "OTP topilmadi",
      };

      return res.status(200).send(response);
    }

    await pool.query(`UPDATE otp SET verified = true WHERE id = $1`, [
      otpResult.id,
    ]);

    //Yangi usermi yoki eski usermi tekshirish

    const userData = await pool.query(
      `SELECT * FROM users WHERE phone_number=$1`,
      [phone_number],
    );

    if (userData.rows.length === 0) {
      const newUser = await pool.query(
        `
            INSERT INTO users(phone_number, is_active) VALUES ($1, true)
        `,
        [phone_number],
      );
    }

    const response = {
      Status: "Success",
    };
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  createOtp,
  verifyOtp,
};
