import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import { db } from "./db.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + path.extname(file.originalname);
    cb(null, unique);
  },
});

const upload = multer({ storage });


app.post("/register", (req, res) => {
  const user = req.body;

  const sql = `
    INSERT INTO drivers (fname, email, phoneNumber, password, locations, description, imageUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user.fname,
      user.email,
      user.phoneNumber,
      user.password,
      (user.locations || []).join(","),
      user.description,
      user.imageUrl,
    ],
    (err) => {
      if (err) return res.status(500).send({ message: "DB Error" });
      res.send({ message: "User registered successfully!" });
    }
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM drivers WHERE email=? AND password=?",
    [email, password],
    (err, result) => {
      if (err) return res.json({ success: false, message: "DB Error" });
      if (result.length === 0)
        return res.json({ success: false, message: "Wrong credentials" });

      res.json({ success: true, user: result[0] });
    }
  );
});

app.post("/updateDriver", (req, res) => {
  const { fname, email, phoneNumber, locations, description, payPerDay } =
    req.body;

  const sql = `
    UPDATE drivers
    SET fname=?, phoneNumber=?, locations=?, description=?, payPerDay=?
    WHERE email=?
  `;

  db.query(
    sql,
    [fname, phoneNumber, (locations || []).join(","), description, payPerDay, email],
    (err) => {
      if (err) res.status(500).json({ status: "error" });
      else res.json({ status: "success" });
    }
  );
});

app.post("/uploadImage", upload.single("image"), (req, res) => {
  const email = req.body.email;
  const imagePath = `uploads/${req.file.filename}`;

  db.query(
    "UPDATE drivers SET imageUrl=? WHERE email=?",
    [imagePath, email],
    (err) => {
      if (err) return res.status(500).json({ status: "error" });

      res.json({
        status: "success",
        imageUrl: imagePath,
      });
    }
  );
});

app.get("/getDriver", (req, res) => {
  const email = req.query.email;

  db.query("SELECT * FROM drivers WHERE email=?", [email], (err, result) => {
    if (err) return res.json({ status: "error" });
    if (result.length === 0) return res.json({ status: "not_found" });
    res.json(result[0]);
  });
});

app.get("/driver/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT id, fname, payPerDay, locations FROM drivers WHERE id=?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ status: "error" });
      if (result.length === 0) return res.json({ status: "not_found" });

      const driver = result[0];
      driver.locations = driver.locations ? driver.locations.split(",") : [];
      res.json(driver);
    }
  );
});

app.get("/drivers", (req, res) => {
  db.query("SELECT * FROM drivers", (err, result) => {
    if (err) return res.status(500).json({ status: "error" });

    const drivers = result.map((d) => ({
      ...d,
      locations: d.locations ? d.locations.split(",") : [],
    }));

    res.json(drivers);
  });
});

app.post("/createOrder", (req, res) => {
  const { driver_id, customerName, customerPhone, region, days } = req.body;

  db.query(
    "SELECT payPerDay FROM drivers WHERE id = ?",
    [driver_id],
    (err, result) => {
      if (err || result.length === 0) {
        return res.status(500).json({ status: "error" });
      }

      const payPerDay = result[0].payPerDay;
      const totalPrice = payPerDay * days;

      const sqlInsert = `
        INSERT INTO orders
        (driver_id, customerName, customerPhone, region, days, totalPrice)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      db.query(
        sqlInsert,
        [driver_id, customerName, customerPhone, region, days, totalPrice],
        (err) => {
          if (err) return res.status(500).json({ status: "error" });
          res.json({ status: "success" });
        }
      );
    }
  );
});

app.post("/orders/accept", (req, res) => {
  const { orderId } = req.body;

  db.query("UPDATE orders SET status='ready' WHERE id=?", [orderId], (err) => {
    if (err) return res.status(500).json({ status: "error" });
    res.json({ status: "success" });
  });
});

app.post("/orders/reject", (req, res) => {
  const { orderId } = req.body;

  db.query("DELETE FROM orders WHERE id=?", [orderId], (err) => {
    if (err) return res.status(500).json({ status: "error" });
    res.json({ status: "success" });
  });
});

app.get("/orders/ready/:driverId", (req, res) => {
  const driverId = req.params.driverId;

  db.query(
    "SELECT * FROM orders WHERE driver_id=? AND status='ready'",
    [driverId],
    (err, result) => {
      if (err) return res.status(500).json({ status: "error" });
      res.json(result);
    }
  );
});

app.get("/orders/pending/:driverId", (req, res) => {
  const driverId = req.params.driverId;

  db.query(
    "SELECT * FROM orders WHERE driver_id=? AND status='pending'",
    [driverId],
    (err, result) => {
      if (err) return res.status(500).json([]);
      res.json(result);
    }
  );
});

const PORT = Number(process.env.PORT);

app.listen(PORT, '0.0.0.0', () => {
  console.log("Server running on", PORT);
});
