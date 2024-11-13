const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

// Set Storage Engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');  // กำหนดโฟลเดอร์สำหรับเก็บไฟล์ที่อัปโหลด
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // ตั้งชื่อไฟล์ใหม่ไม่ให้ซ้ำกัน
    }
});

// กำหนดตัวแปร upload ที่ใช้ Multer
const upload = multer({ storage: storage });


// Check File Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}




app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'secret', // ควรเปลี่ยนเป็นคีย์ลับจริงๆ
    resave: false,
    saveUninitialized: true
})); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'culture'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

app.set('view engine', 'ejs');

// หน้า Login เป็นค่าตั้งต้น
app.get('/', (req, res) => {
    res.render('login', { error: null });
});

app.get('/index', (req,res) => {
    res.render('index');
})


// Post
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    let sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const user = results[0];
            if (password === user.password) {
                req.session.user = user;
                res.redirect('/index');
            } else {
                res.render('login', { error: 'Incorrect password' });
            }
        } else {
            res.render('login', { error: 'User not found' });
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    const id = req.params.id; // Get the ID from the URL
    const sql = 'SELECT * FROM traditions WHERE id = ?';

    db.query(sql, [id], (err, results) => {
        if (err) {
            throw err;
        }

        // Check if there is a result
        if (results.length > 0) {
            res.render('edit', { tradition: results[0] });
        } else {
            res.status(404).send('Tradition not found');
        }
    });
});


app.get('/index2', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ดึงข้อมูลประเพณีของภาคกลาง (region 'C')
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['N'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('index2', { traditions: results, region: 'C' });
    });
});


app.get('/index3', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ดึงข้อมูลประเพณีของภาคกลาง (region 'C')
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['C'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('index3', { traditions: results, region: 'C' });
    });
});

app.get('/index4', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ดึงข้อมูลประเพณีของภาคกลาง (region 'C')
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['E'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('index4', { traditions: results, region: 'C' });
    });
});

app.get('/index5', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ดึงข้อมูลประเพณีของภาคกลาง (region 'C')
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['S'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('index5', { traditions: results, region: 'C' });
    });
});

app.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ดึงข้อมูลประเพณีของภาคกลาง (region 'C')
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['E'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('edit-info', { traditions: results, region: 'C' });
    });
});

app.get('/add', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    res.render('add');  // Make sure 'add.ejs' exists in your 'views' directory
});

app.get('/edit-info', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    let sql = 'SELECT * FROM traditions';
    db.query(sql, (err, results) => {
        if (err) throw err;
        res.render('edit-info', { traditions: results });
    });
});


app.get('/edit-info/delete/:id', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    let sql = `DELETE FROM traditions WHERE id = ${req.params.id}`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.redirect('/edit-info');
    });
});

app.post('/tradition/update/:id', upload.single('image'), (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ข้อมูลที่ต้องการอัปเดต
    let updatedtraditions = req.body;

    // ตรวจสอบว่ามีการอัปโหลดไฟล์หรือไม่
    if (req.file) {
        updatedtraditions.image = req.file.filename;  // บันทึกชื่อไฟล์ในฐานข้อมูล
    }

    // อัปเดตข้อมูลในฐานข้อมูล
    let sql = `UPDATE traditions SET ? WHERE id = ${req.params.id}`;
    db.query(sql, updatedtraditions, (err, result) => {
        if (err) throw err;
        res.redirect('/edit-info');
    });
});



app.post('/add', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }

    // ใช้ฟังก์ชัน upload.single('image') เพื่ออัปโหลดไฟล์จากฟิลด์ input ที่ชื่อ 'image'
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.log('Error during file upload:', err);
            return res.render('add', { error: 'Error uploading file: ' + err });
        }

        const { name, history, description, region, date } = req.body;
        const image = req.file ? req.file.filename : null;  // ตรวจสอบว่ามีไฟล์ถูกอัปโหลด

        console.log('Form Data:', { name, history, description, region, date, image }); // แสดงข้อมูลที่ได้รับจากฟอร์ม

        if (!name || !history || !description || !region || !date || !image) {
            return res.render('add', { error: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        const sql = 'INSERT INTO traditions (name, history, description, region, date, image) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [name, history, description, region, date, image], (err, result) => {
            if (err) {
                console.error('MySQL Error: ', err.message); // แสดงข้อความผิดพลาดที่เกี่ยวข้องกับ MySQL
                return res.render('add', { error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
            }

            console.log('Insertion Result:', result);
            res.redirect('/index');
        });
    });
});


app.get('/edit-north', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['N'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('edit-north', { traditions: results, region: 'C' });
    });
});

app.get('/edit-central', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['C'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('edit-central', { traditions: results, region: 'C' });
    });
});

app.get('/edit-esan', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['E'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('edit-esan', { traditions: results, region: 'C' });
    });
});

app.get('/edit-south', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/');
    }
    let sql = 'SELECT * FROM traditions WHERE region = ?';
    
    db.query(sql, ['S'], (err, results) => {
        if (err) throw err;

        // ส่งผลลัพธ์ไปยังหน้า index3.ejs พร้อมกับค่า region
        res.render('edit-south', { traditions: results, region: 'C' });
    });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});