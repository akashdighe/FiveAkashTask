// userlist.js
const express = require("express");
const UsersModel = require("../model/Users");
const nodemailer = require("nodemailer");
const router = express.Router();
const Mailgen = require('mailgen');

router.post("/create", async (req, res) => {
    const newOrder = new UsersModel(req.body)
    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/list", async (req, res) => {
    try {
        let list = await UsersModel.find()
            .exec();
        res.status(201).json(list);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete user by ID
router.delete("/delete/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        console.log(userId);

        // Check if the user exists
        const userToDelete = await UsersModel.findById(userId);
        if (!userToDelete) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Delete the user
        await userToDelete.deleteOne();

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not delete the user' });
    }
});



router.post("/update/:id", async (req, res) => {
    try {
        const userId = req.params.id;

        let userList = await UsersModel.findById(userId);

        if (!userList) {
            return res.status(404).json({ error: 'userList not found' });
        }
        userList.name = req.body.name;
        userList.email = req.body.email;
        userList.phoneNumber = req.body.phoneNumber;
        userList.hobbies = req.body.hobbies;
        const updateduserList = await userList.save();

        res.status(200).json(updateduserList);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Could not update the userList' });
    }
});


router.post("/send-email", async (req, res) => {
    try {

        const Email = req.body.email; 
        // const Email = "digheakash9011@gmail.com";


        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
      

        const mailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: "https://mailgen.js/",
            },
        });
   

        var email = {
            body: {
                name: req.body.name,
                intro: 
                `phoneNumber: ${req.body.phoneNumber}`,
                outro: `hobbies: ${req.body.hobbies}`,
            },
            
        };
        
        var emailBody = mailGenerator.generate(email);

        var emailText = mailGenerator.generatePlaintext(email);

        let mailOptions = {
            from: process.env.MAIL_USER,
            to: Email,
            subject: "verification",
            text: emailText,
            html: emailBody,
        };

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                return console.log(error);
            }
        });
        return res.status(200).json({ message: "Sucessfull" })

    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router