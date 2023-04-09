const express = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const path = require("path");
app.use(express.static("public"));
app.use("/assets", express.static("assets"));
const bodyparser = require("body-parser");
const mysql = require("mysql");

app.use(
  cors({
    origin: ["http://localhost:3001"],
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(bodyparser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "assets");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const upload = multer({ storage: storage });

var mysqlConnection = mysql.createConnection({
  host: process.env.DB_HOST, 
  user: process.env.DB_USERNAME, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
});

// ============ Services Endpoint Apis =======================

app.get("/getServices", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from services", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateServices/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE services SET image=?, title=?, description=? WHERE id=?";
  const values = [req.file.path, req.body.title, req.body.description];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getSevicesById/:id", (req, res) => {
  const servicesID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM services WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        title: record.title,
        description: record.description,
        image: record.image,
      });
    }
  );
});

app.delete("/deleteServices/:id", (req, res) => {
  const servicesID = req.params.id;
  console.log(servicesID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM services WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/Services", upload.single("image"), (req, res) => {
  // Get form data
  const title = req.body.title;
  const description = req.body.description;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO services SET ?",
    { image, title, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ About us Endpoint Apis =======================

app.get("/getAboutUs", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from about_us", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateAboutUs/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE about_us SET image=?, title=?, description=? WHERE id=?";
  const values = [req.file.path, req.body.title, req.body.description];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getAboutUsById/:id", (req, res) => {
  const servicesID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM about_us WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        title: record.title,
        description: record.description,
        image: record.image,
      });
    }
  );
});

app.delete("/deleteAboutUs/:id", (req, res) => {
  const servicesID = req.params.id;
  console.log(servicesID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM about_us WHERE id = ?",
    [servicesID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/AboutUs", upload.single("image"), (req, res) => {
  // Get form data
  const title = req.body.title;
  const description = req.body.description;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO about_us SET ?",
    { image, title, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ==================================== Inquiery API ==============================

app.post("/create", (req, res) => {
  const sql = "insert into inquiries (`name`,`email`,`description`) values (?)";
  const values = [req.body.name, req.body.email, req.body.description];
  mysqlConnection.query(sql, [values], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

// ============ Slider Endpoint Apis =======================

app.get("/getSlider", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from slider", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateSlider/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE slider SET image=?, title=? WHERE id=?";
  const values = [req.file.path, req.body.title];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getSliderById/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM slider WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        title: record.title,
        image: record.image,
      });
    }
  );
});

app.delete("/deleteSlider/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM slider WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/Slider", upload.single("image"), (req, res) => {
  // Get form data
  const title = req.body.title;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO slider SET ?",
    { image, title },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Team Endpoint Apis =======================

app.get("/getSocialMedia", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from socialMedia", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateSocialMedia/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE socialMedia SET image=?, title=? WHERE id=?";
  const values = [req.file.path, req.body.title];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getsocialMediaById/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM socialMedia WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        title: record.title,
        image: record.image,
      });
    }
  );
});

app.delete("/deletesocialMedia/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM socialMedia WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/socialMedia", upload.single("image"), (req, res) => {
  // Get form data
  const name = req.body.name;
  const url = req.body.url;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO socialMedia SET ?",
    { image, name, url },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Team Endpoint Apis =======================

app.get("/getTeam", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from team", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateTeam/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql =
    "UPDATE team SET image=?, name=?,position=?,description=? WHERE id=?";
  const values = [
    req.file.path,
    req.body.name,
    req.body.position,
    req.body.description,
  ];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getTeamId/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM team WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        name: record.name,
        position: record.position,
        description: record.description,
        image: record.image,
      });
    }
  );
});

app.delete("/deleteTeam/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM team WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/team", upload.single("image"), (req, res) => {
  // Get form data
  const name = req.body.name;
  const position = req.body.position;
  const description = req.body.description;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO team SET ?",
    { image, name, position, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Header Endpoint Apis =======================

app.get("/getHeader", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from header", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateHeader/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql = "UPDATE team SET logo=?, company=? WHERE id=?";
  const values = [req.file.path, req.body.company];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getHeaderId/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM header WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        company: record.company,
        image: record.logo,
      });
    }
  );
});

app.delete("/deleteHeader/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM header WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/header", upload.single("image"), (req, res) => {
  // Get form data
  const company = req.body.company;
  const logo = req.file.path;

  mysqlConnection.query(
    "INSERT INTO header SET ?",
    { logo, company },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Team Endpoint Apis =======================

app.get("/getTeam", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from team", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateTeam/:id", upload.single("image"), (req, res) => {
  console.log(req.params.id);
  const sql =
    "UPDATE team SET image=?, name=?,position=?,description=? WHERE id=?";
  const values = [
    req.file.path,
    req.body.name,
    req.body.position,
    req.body.description,
  ];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getTeamId/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM team WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        name: record.name,
        position: record.position,
        description: record.description,
        image: record.image,
      });
    }
  );
});

app.delete("/deleteTeam/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM team WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/team", upload.single("image"), (req, res) => {
  // Get form data
  const name = req.body.name;
  const position = req.body.position;
  const description = req.body.description;
  const image = req.file.path;

  mysqlConnection.query(
    "INSERT INTO team SET ?",
    { image, name, position, description },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

// ============ Footer Endpoint Apis =======================

app.get("/getFooter", (req, res) => {
  console.log("check");
  mysqlConnection.query("select * from footer", (err, data) => {
    if (err) console.log(err);
    else return res.json(data);
  });
});

app.put("/updateFooter/:id", (req, res) => {
  console.log(req.params.id);
  const sql =
    "UPDATE team SET company=?, address=?, email=?, phone=? WHERE id=?";
  const values = [
    req.body.company,
    req.body.address,
    req.body.email,
    req.body.phone,
  ];
  mysqlConnection.query(sql, [...values, req.params.id], (err, data) => {
    if (err) return res.json(err);
    else return res.json(data);
  });
});

app.get("/getFooterId/:id", (req, res) => {
  const sliderID = req.params.id;

  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "SELECT * FROM footer WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json({
        id: record.id,
        company: record.company,
        address: record.address,
        email: record.email,
        phone: record.phone,
      });
    }
  );
});

app.delete("/deleteFooter/:id", (req, res) => {
  const sliderID = req.params.id;
  console.log(sliderID);
  // Query the database to retrieve the record with the specified ID
  mysqlConnection.query(
    "delete  FROM footer WHERE id = ?",
    [sliderID],
    (error, results) => {
      if (error) {
        // Return an error response if there was an error querying the database
        return res.status(500).json({
          error: "Error retrieving record from database",
        });
      }

      if (results.length === 0) {
        // Return a 404 error response if no record was found with the specified ID
        return res.status(404).json({
          error: "Record not found",
        });
      }

      // Return the retrieved record as a JSON response
      const record = results[0];
      res.json("Delete Successfull");
    }
  );
});

app.post("/footer", (req, res) => {
  // Get form data
  const company = req.body.company;
  const address = req.body.address;
  const email = req.body.email;
  const phone = req.body.phone;

  mysqlConnection.query(
    "INSERT INTO footer SET ?",
    { company, address, email, phone },
    (error, results) => {
      if (error) {
        console.error(error);
        res.sendStatus(500);
      } else {
        res.json({ message: "Item added successfully" });
      }
    }
  );
});

app.listen(process.env.PORT || 8081, () => {
  console.log("listening");
});
