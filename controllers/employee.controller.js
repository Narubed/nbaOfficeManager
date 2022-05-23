// const db = require("../../models");
// const User = db.user;
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const { Employee, validate } = require("../models/employee.model");

const { google } = require("googleapis");
const CLIENT_ID = process.env.GOOGLE_DRIVE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_DRIVE_REDIRECT_URI;
const REFRESH_TOKEN = process.env.GOOGLE_DRIVE_REFRESH_TOKEN;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
const drive = google.drive({
  version: "v3",
  auth: oauth2Client,
});

// Create and Save a new user
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.create = async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  try {
    let upload = multer({ storage: storage }).single("emp_pic");
    upload(req, res, function (err) {
      if (!req.file) {
        return res.send("กรุณาส่งไฟล์รูปภาพด้วย");
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      }
      uploadFileCreate(req, res);
    });

    async function uploadFileCreate(req, res) {
      const filePath = req.file.path;
      let fileMetaData = {
        name: req.file.originalname,
        parents: ["11d-9OGIFDFotiF9w6K9DEP1MLepC4nec"],
      };
      let media = {
        body: fs.createReadStream(filePath),
      };
      try {
        const response = await drive.files.create({
          resource: fileMetaData,
          media: media,
        });
        generatePublicUrl(response.data.id);
        const { error } = validate(req.body);
        if (error)
          return res
            .status(400)
            .send({ message: error.details[0].message, status: false });

        const user = await Employee.findOne({
          emp_username: req.body.emp_username,
        });
        if (user) {
          await drive.files.delete({
            fileId: response.data.id.toString(),
          });
          return res
            .status(409)
            .send({ message: "ชื่อผู้ใช้งานนี้ มีอยู่ในระบบเเล้ว" });
        }
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.emp_password, salt);

        await new Employee({
          ...req.body,
          emp_password: hashPassword,
          emp_pic: response.data.id,
        }).save();

        res
          .status(201)
          .send({ message: "เพิ่มข้อมูลผู้ใช้งานสำเร็จ", status: true });
      } catch (error) {
        res.status(500).send({ message: "มีบ่างอย่างผิดพลาด", status: false });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
};
exports.update = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).send({
        message: "ข้อมูลไม่ถูกต้อง",
      });
    }
    let upload = multer({ storage: storage }).single("emp_pic");
    upload(req, res, async function (err) {
      if (!req.file) {
        const id = req.params.id;
        if (!req.body.emp_password) {
          Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then((data) => {
              if (!data) {
                res.status(404).send({
                  message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
                  status: false,
                });
              } else
                res.send({
                  message: "การเเก้ไขข้อมูลสำเร็จ.",
                  status: true,
                });
            })
            .catch((err) => {
              res.status(500).send({
                message: "ไม่สามารถเเก้ไขข้อมูลได้",
                status: false,
              });
            });
        } else {
          const salt = await bcrypt.genSalt(Number(process.env.SALT));
          const hashPassword = await bcrypt.hash(req.body.emp_password, salt);
          Employee.findByIdAndUpdate(
            id,
            { ...req.body, emp_password: hashPassword },
            { useFindAndModify: false }
          )
            .then((data) => {
              if (!data) {
                res.status(404).send({
                  message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
                  status: false,
                });
              } else
                res.send({
                  message: "การเเก้ไขข้อมูลสำเร็จ",
                  status: true,
                });
            })
            .catch((err) => {
              res.status(500).send({
                message: "ไม่สามารถแก้ไขข้อมูลนี้ได้",
                status: false,
              });
            });
        }
      } else if (err instanceof multer.MulterError) {
        return res.send(err);
      } else if (err) {
        return res.send(err);
      } else {
        console.log("มีไฟล์เเล้ว");
        uploadFileCreate(req, res);
      }
      async function uploadFileCreate(req, res) {
        const filePath = req.file.path;
        let fileMetaData = {
          name: req.file.originalname,
          parents: ["11d-9OGIFDFotiF9w6K9DEP1MLepC4nec"],
        };
        let media = {
          body: fs.createReadStream(filePath),
        };
        try {
          const response = await drive.files.create({
            resource: fileMetaData,
            media: media,
          });
          generatePublicUrl(response.data.id);
          const id = req.params.id;
          // START
          if (!req.body.emp_password) {
            console.log("มีไฟล์ ไม่มีรหัสผ่าน");
            Employee.findByIdAndUpdate(
              id,
              { ...req.body, emp_pic: response.data.id },
              { useFindAndModify: false }
            )
              .then(async (data) => {
                console.log("data ==>>>", data);
                if (!data) {
                  await drive.files.delete({
                    fileId: response.data.id.toString(),
                  });
                  res.status(404).send({
                    message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
                    status: false,
                  });
                } else
                  res.send({
                    message: "การเเก้ไขข้อมูลสำเร็จ",
                    status: true,
                  });
              })
              .catch(async (err) => {
                await drive.files.delete({
                  fileId: response.data.id.toString(),
                });
                res.status(500).send({
                  message: "ไม่สามารถแก้ไขข้อมูลนี้ได้",
                  status: false,
                });
              });
          } else {
            const salt = await bcrypt.genSalt(Number(process.env.SALT));
            const hashPassword = await bcrypt.hash(req.body.emp_password, salt);
            console.log("มีไฟล์ มีรหัสผ่าน");
            Employee.findByIdAndUpdate(
              id,
              {
                ...req.body,
                emp_pic: response.data.id,
                emp_password: hashPassword,
              },
              { useFindAndModify: false }
            )
              .then(async (data) => {
                if (!data) {
                  await drive.files.delete({
                    fileId: response.data.id.toString(),
                  });
                  res.status(404).send({
                    message: `ไม่สามารถแก้ไขข้อมูลนี้ได้`,
                    status: false,
                  });
                } else
                  res.send({
                    message: "การเเก้ไขข้อมูลสำเร็จ",
                    status: true,
                  });
              })
              .catch(async (err) => {
                await drive.files.delete({
                  fileId: response.data.id.toString(),
                });
                res.status(500).send({
                  message: "ไม่สามารถแก้ไขข้อมูลนี้ได้",
                  status: false,
                });
              });
          }
          // END
        } catch (error) {
          res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
        }
      }
    });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
};

exports.findAll = async (req, res) => {
  try {
    Employee.find()
      .then(async (data) => {
        res.send({ data, message: "success", status: true });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "มีบ่างอย่างผิดพลาด.",
        });
      });
  } catch (error) {
    res.status(500).send({ message: "มีบ่างอย่างผิดพลาด" });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;
  Employee.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "ไม่สามารถหาข้อมูลได้", status: false });
      else res.send({ data, status: true });
    })
    .catch((err) => {
      res.status(500).send({
        message: "มีบ่างอย่างผิดพลาด",
        status: false,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Employee.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `ไม่สามารถลบผู้ใช้งานนี้ได้`,
          status: true,
        });
      } else {
        res.send({
          message: "ลบผู้ใช้งานสำเร็จ",
          status: false,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "ไม่สามารถลบผู้ใช้งานนี้ได้",
        status: false,
      });
    });
};

async function generatePublicUrl(res) {
  try {
    const fileId = res;
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });
    const result = await drive.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
    // console.log(result.data);
  } catch (error) {
    console.log(error.message);
  }
}
