const Doctor = require("../modules/doctorShema");
const bcrypt = require("bcrypt");
const { genToken } = require("../utils/genToken");
const APPOIMENT = require("../modules/appoimentSchema");

exports.docRegister = async (req, res) => {
  const {
    fullName,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address,
    date,
  } = req.body;

  if (
    (!fullName,
    !email,
    !password,
    !speciality,
    !degree,
    !experience,
    !about,
    !available,
    !fees)
  ) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }

  const hassPass = await bcrypt.hash(password, 10);

  try {
    const doctor = await Doctor.create({
      fullName,
      email,
      password: hassPass,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
      date,
    });

    res.status(201).json({
      success: true,
      message: " Doctor Register successs",
      doctor,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.docLogin = async (req, res) => {
  const { email, password } = req.body;

  if ((!email, !password)) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }

  try {
    const genPass = await Doctor.findOne({ email, role: "Doctor" });
    if (!genPass) {
      return res.status(400).json({
        sucess: false,
        message: "Not authroized",
      });
    }

    const isMatch = bcrypt.compare(password, genPass.password);
    if (!isMatch) {
      return res.status(400).json({
        sucess: false,
        message: "incorrect email/password",
      });
    }

    const doctorData = {
      id: genPass.id,
      fullName: genPass.fullName,
      email: genPass.email,
      password: genPass.password,
      role: genPass.role,
    };

    req.genPass = doctorData;

    genToken(req, res);
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

exports.docProfile = async (req, res) => {
  const dId = req.id;
  const { docId } = req.params;

  if (dId !== docId) {
    return res.status(401).json({
      success: false,
      message: "not have permission",
    });
  }
  if (!dId) {
    return res.status(400).json({
      sucess: false,
      message: "doctor inValid",
    });
  }

  const doctor = await Doctor.findById(docId);
  if (!doctor) {
    return res.status(400).json({
      sucess: false,
      message: "doctor inValid",
    });
  }
  const {
    _id,
    fullName,
    email,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address,
    date,
  } = doctor;
  res.status(201).json({
    success: true,
    doctor: {
      _id,
      fullName,
      email,
      speciality,
      degree,
      experience,
      about,
      available,
      fees,
      address,
      date,
    },
  });
};

exports.docUpdate = async (req, res) => {
  const dId = req.id;
  const { docId } = req.params;

  if (dId !== docId) {
    return res.status(401).json({
      success: false,
      message: "not have permission",
    });
  }

  if (!dId) {
    return res.status(400).json({
      sucess: false,
      message: "doctor inValid",
    });
  }

  const {
    fullName,
    email,
    password,
    speciality,
    degree,
    experience,
    about,
    available,
    fees,
    address,
    date,
  } = req.body;
  if (
    (!fullName,
    !email,
    !password,
    !speciality,
    !degree,
    !experience,
    !about,
    !available,
    !fees,
    !address,
    !date)
  ) {
    return res.status(400).json({
      sucess: false,
      message: "enter full details",
    });
  }

  const doctor = await Doctor.findById(docId);
  if (!doctor) {
    return res.status(400).json({
      sucess: false,
      message: "user inValid",
    });
  }

  const hassPass = await bcrypt.hash(password, 10);

  doctor.fullName = fullName;
  doctor.email = email;
  doctor.password = hassPass;
  (doctor.speciality = speciality),
    (doctor.degree = degree),
    (doctor.experience = experience),
    (doctor.about = about),
    (doctor.available = available),
    (doctor.fees = fees),
    (doctor.address = address),
    (doctor.date = date);

  const updateDoctor = await doctor.save();

  res.status(201).json({
    success: true,
    message: "updated successfully",
    doctor: {
      id: updateDoctor._id,
      fullName: updateDoctor.fullName,
      email: updateDoctor.email,
      password: updateDoctor.password,
      speciality: updateDoctor.speciality,
      degree: updateDoctor.degree,
      experience: updateDoctor.experience,
      about: updateDoctor.about,
      available: updateDoctor.available,
      fees: updateDoctor.fees,
      address: updateDoctor.address,
      date: updateDoctor.date,
    },
  });
};

exports.docDelete = async (req, res) => {
  const dId = req.id;
  const { docId } = req.params;

  if (dId !== docId) {
    return res.status(401).json({
      success: false,
      message: "not have permission",
    });
  }

  if (!dId) {
    return res.status(400).json({
      sucess: false,
      message: "Doctor inValid",
    });
  }

  const doctor = await Doctor.findByIdAndDelete(docId);
  if (!doctor) {
    return res.status(400).json({
      sucess: false,
      message: "Doctor inValid",
    });
  }

  res.status(201).json({
    success: true,
    message: "deleted successfully",
  });
};

exports.veiwAllDoctors = async (req, res) => {
  const doctors = await Doctor.find({ role: "Doctor", available: true }).select(
    "-password" && "-slots_booked"
  );

  if (!doctors || doctors.length === 0) {
    return res.status(404).json({
      succes: false,
      message: "No Doctors Found",
    });
  }

  return res.status(200).json({
    success: true,
    doctors,
  });
};

exports.docPendingAppoiment = async (req, res) => {
  const docId = req.id;

  const appoiment = await APPOIMENT.find({
    doctorId: docId,
    status: "pending",
  });
  if (!appoiment || appoiment.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No pending appoiment",
    });
  }

  return res.status(200).json({
    success: true,
    appoiment,
  });
};

exports.updatePendingAppoiment = async (req, res) => {
  try {
    const { appId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(404).json({
        success: true,
        message: "enter status",
      });
    }

    if (!appId) {
      return res.status(404).json({
        success: true,
        message: "Appoiment not Found",
      });
    }

    const appoimentPend = await APPOIMENT.findById(appId);

    if (!appoimentPend) {
      return res.status(404).json({
        success: true,
        message: "Appoiment not Found",
      });
    }

    appoimentPend.status = status;
    appoimentPend.save();
    res.status(200).json({
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

exports.approvedAppoiment = async (req, res) => {
  const docid = req.id;
  const approved = await APPOIMENT.find({
    doctorId: docid,
    status: "Approved",
  });
  if (!approved || approved.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No approved appoiment",
    });
  }
  return res.status(200).json({
    success: true,
    approved,
  });
};

exports.doctorAllAppoiment = async (req, res) => {
  const docId = req.id;
  const allAppoiment = await APPOIMENT.find({ doctorId: docId });
  if (!allAppoiment || allAppoiment.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No appoiments Found",
    });
  }
  return res.status(200).json({
    success: true,
    allAppoiment,
  });
};
