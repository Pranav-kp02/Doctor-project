const User = require("../modules/userSchema");
const bcrypt = require("bcrypt");
const { genToken } = require("../utils/genToken");
const Doctor = require("../modules/doctorShema");
const APPOIMENT = require("../modules/appoimentSchema");

exports.userRegister = async (req, res) => {
  const { fullName, email, password, age, gender, dob, phone } = req.body;

  if ((!fullName, !email, !password)) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return res.status(400).json({
      sucess: false,
      message: "Email already used",
    });
  }

  const hassPass = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      fullName,
      email,
      password: hassPass,
      age,
      gender,
      dob,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Registered successsfully",
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }

  try {
    const genPass = await User.findOne({ email });
    if (!genPass) {
      return res.status(400).json({
        sucess: false,
        message: "user not found",
      });
    }

    const banCheck = genPass.active;

    if (banCheck === "inActive") {
      return res.status(400).json({
        sucess: false,
        message: "user not allowed login",
      });
    }

    const isMatch = await bcrypt.compare(password, genPass.password);

    if (!isMatch) {
      return res.status(400).json({
        sucess: false,
        message: "incorrect email/password",
      });
    }

    const userdata = {
      id: genPass.id,
      fullName: genPass.fullName,
      email: genPass.email,
      role: genPass.role,
      gender: genPass.gender,
      dob: genPass.dob,
      phone: genPass.phone,
      active: genPass.active,
    };

    req.genPass = userdata;

    genToken(req, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.userProfile = async (req, res) => {
  const uId = req.id;
  // const { userId } = req.params;

  // if (uId !== userId) {
  //   return res.status(401).json({
  //     success: false,
  //     message: "user not have permission",
  //   });
  // }

  if (!uId) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }

  const user = await User.findById(uId);
  if (!user) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }
  const { _id, fullName, email, age, gender, dob, phone } = user;
  res.status(201).json({
    success: true,
    user: {
      _id,
      fullName,
      email,
      age,
      gender,
      dob,
      phone,
    },
  });
};

exports.userUpdate = async (req, res) => {
  const uId = req.id;

  const { userId } = req.params;

  if (uId !== userId) {
    return res.status(401).json({
      success: false,
      message: "user not have permission",
    });
  }

  if (!uId) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }

  const { fullName, email, age, gender, dob, phone } = req.body;
  if ((!fullName, !email, !age, !gender, !dob, !phone)) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }

  // const hassPass = await bcrypt.hash(password, 10);

  user.fullName = fullName;
  user.email = email;
  // user.password = hassPass;
  user.age = age;
  user.gender = gender;
  user.dob = dob;
  user.phone = phone;

  const updateUser = await user.save();

  res.status(201).json({
    success: true,
    message: "updated successfully",
    user: {
      id: updateUser._id,
      fullName: updateUser.fullName,
      email: updateUser.email,
      // password: updateUser.password,
      age: updateUser.age,
      gender: updateUser.gender,
      dob: updateUser.dob,
      phone: updateUser.phone,
    },
  });
};

exports.userDelete = async (req, res) => {
  const uId = req.id;
  const { userId } = req.params;

  if (uId !== userId) {
    return res.status(401).json({
      success: false,
      message: "user not have permission",
    });
  }

  if (!uId) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }

  const user = await User.findByIdAndDelete(userId);
  if (!user) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }

  res.status(201).json({
    success: true,
    message: "deleted successfully",
  });
};

exports.veiwAllUsers = async (req, res) => {
  const users = await User.find({ role: "user" });

  if (!users || users.length === 0) {
    return res.status(404).json({
      succes: false,
      message: "No user Found",
    });
  }

  return res.status(200).json({
    success: true,
    users,
  });
};

exports.bookAppoiment = async (req, res) => {
  const { docId } = req.params;
  const uId = req.id;
  const { bookTime, bookDate } = req.body;

  if (!uId) {
    return res.status(400).json({
      sucess: false,
      message: "pls login to book appoiment",
    });
  }

  if (!bookTime || !bookDate) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }

  const userData = await User.findById(uId).select("-password");
  if (!userData) {
    return res.status(400).json({
      sucess: false,
      message: "pls login to book appoiment",
    });
  }

  const doctor = await Doctor.findById(docId).select("-password");
  if (!doctor) {
    return res.status(404).json({
      succes: false,
      message: "doctor not found",
    });
  }

  let slots_booked = doctor.slots_booked;

  if (slots_booked[bookDate]) {
    if (slots_booked[bookDate].includes(bookTime)) {
      return res.json({ success: false, message: "slot not avilable" });
    } else {
      slots_booked[bookDate].push(bookTime);
    }
  } else {
    slots_booked[bookDate] = [];
    slots_booked[bookDate].push(bookTime);
  }

  const fee = doctor.fees;

  delete doctor.slots_booked;

  const appoimentData = {
    userId: uId,
    doctorId: docId,
    userData,
    docData: doctor,
    fees: doctor.fees,
    slotBookedDate: bookDate,
    slotBookedTime: bookTime,
  };

  const newAppoiment = new APPOIMENT(appoimentData);
  await newAppoiment.save();

  await Doctor.findByIdAndUpdate(docId, { slots_booked });

  return res.status(200).json({
    success: true,
    message: "Booked appoiment successfully",
    fee,
  });
};
