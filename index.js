require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

const connection = require("./config/db");
const employeeRoutes = require("./routes/employee");
const login_Employee = require("./routes/login_employee");
const delete_image = require("./routes/deleteImage");
const partnerRoutes = require("./routes/partner");
// database connection
connection();
// middlewares
app.use(express.json());
app.use(cors());

// routes
// app.use("/v1/office/employee", employeeRoutes);
app.use("/v1/office/delete_image", delete_image);
app.use("/v1/office/employee", employeeRoutes);
app.use("/v1/office/login_employee", login_Employee);
app.use("/v1/office/partner", partnerRoutes);

const port = process.env.PORT || 8004;
app.listen(port, console.log(`Listening on port ${port}...`));
