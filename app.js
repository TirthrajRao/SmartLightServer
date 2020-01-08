const http = require('http');
const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userModel = require('./user.model');
const zoneModel = require('./zone.model');
const deviceModel = require('./device.model');
const userController = require('./user.controller');
const firebase = require('./Firebase');
const ref = firebase.app().database().ref();
const cors = require('cors');

mongoose.connect('mongodb://localhost:27017/myFirstApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log(err)
    });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(cors());

// app.use((req, res, next) => {
//     console.log('req.body: ', req.body);
//     // console.log('parsed: ', JSON.parse(req.body));
// })

app.post('/api/data', (req, res, next) => {
    console.log(req.body);
    const newUser = new userModel(req.body);
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send('Internal server error');
        } else {
            console.log(user);
            res.status(201).json({
                message: 'New user created',
                data: user
            });
        }
    });
})

// Login Api
app.post('/api/login', (req, res, next) => {

    const newUser = new userModel(req.body);

    console.log("Email for login ::::::::::::::::::::::::::==> ", newUser.email);
    console.log("Password for login :::::::::::::::::::::::::: ==>", newUser.password);

    userModel.find({ email: newUser.email, password: newUser.password }).exec((err, user) => {
        console.log("Status Api Is working", user);
        if (err) {

            console.log("Error  :::::::::::::::::::::::::: ", err);

            return res.status(500).send("Internal server error")
        } else if (user) {
            console.log("login Success  :::::::::::::::::::::::::: ", user);
            if (user.length != 0) {

                jwt.sign({ user }, 'secretkey', (err, jwt) => {
                    res.status(201).json({
                        message: 'Login Success',
                        status: 201,
                        token: jwt,
                        data: user
                    });
                });


            }
            else {
                res.status(203).json({
                    message: 'No user found',
                    status: 203
                });
            }
        } else {
            return res.status(404).send("No user found")
        }
    });
})

app.get('/api/find', userController.findAllUser);

app.get('/api/findone/:id', function (req, res) {

    console.log(req.params.id)

    var id = req.params.id
    userModel.findById({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (user) {
            res.send(user)
        } else {
            return res.status(404).send("No user found")
        }
    });
});

app.get('/api/delete/:id', function (req, res) {

    console.log(req.params.id)

    var id = req.params.id
    userModel.findByIdAndRemove(id, function (err, user) {

        if (err) {
            return res.status(500).send("Internal server error")
        } else {
            res.send("User Deleted")
        }
    });
});

app.put('/api/update/:id', (req, res, next) => {
    console.log(req.body);
    // const newUser = new userModel(req.body);
    userModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, user) => {
        console.log(user);
        if (err) {
            return res
                .status(500)
                .send({ error: "unsuccessful" })
        };
        res.send({ success: "success" });
    });
})

// ************** Add zone API ****************
// AddZone post api
app.post('/api/addzone', verifyToken, (req, res, next) => {
    console.log(req.body);
    const newZone = new zoneModel(req.body);
    newZone.save((err, zone) => {
        if (err) {
            res.status(500).send('Internal server error');
        } else {
            console.log(zone);
            res.status(201).json({
                message: 'New zone added',
                data: zone
            });
        }
    });
})

// GetZone get api
app.get('/api/findZone', verifyToken, function (req, res) {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {
            var id = req.params.id
            zoneModel.find((err, zone) => {
                if (err) {
                    return res.status(500).send("Internal server error")
                } else if (zone) {
                    res.send(zone)
                    console.log(zone)
                    console.log("===============================================================================================")
                } else {
                    return res.status(404).send("No record found")
                }
            });
        }
    });

});

// DeleteZone get api
app.get('/api/deleteZone/:id', verifyToken, function (req, res) {

    console.log(req.params.id)

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {
            zoneModel.findByIdAndRemove(id, function (err, zone) {

                if (err) {
                    return res.status(500).send("Internal server error")
                } else {
                    res.send("Zone Deleted")
                }
            });
        }
    });
});

// UpdateZone put api
app.put('/api/updateZone/:id', verifyToken, (req, res, next) => {
    console.log(req.body);
    // const newUser = new userModel(req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {
            zoneModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, zone) => {
                console.log(zone);
                if (err) {
                    return res
                        .status(500)
                        .send({ error: "unsuccessful" })
                };
                res.send({ success: "success" });
            });
        }
    });
})


// ************** Add Device API ****************

// AddDevice post api
app.post('/api/addDevice', verifyToken, (req, res, next) => {
    console.log(req.body);
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {
            const newDevice = new deviceModel(req.body);
            newDevice.save((err, device) => {
                if (err) {
                    res.status(500).send('Internal server error');
                } else {
                    console.log(device);
                    res.status(201).json({
                        message: 'New device added',
                        data: device
                    });
                }
            });
        }
    });
})

// GetDevice get api
app.get('/api/findDevice', verifyToken, function (req, res) {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {

            var id = req.params.id
            deviceModel.find((err, device) => {
                if (err) {
                    return res.status(500).send("Internal server error")
                } else if (device) {
                    res.send(device)
                } else {
                    return res.status(404).send("No record found")
                }
            });
        }
    });
});

// GetDevice by Id get api
app.get('/api/findDevices/:id', verifyToken, function (req, res) {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {

            var id = req.params.id
            deviceModel.find({ zone_id: req.params.id }, (err, device) => {
                if (err) {
                    return res.status(500).send("Internal server error")
                } else if (device) {
                    res.send(device)
                } else {
                    return res.status(404).send("No user found")
                }
            });
        }
    });
});

// DeleteDevice get api
app.get('/api/deleteDevice/:id', verifyToken, function (req, res) {

    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        }
        else {

            var id = req.params.id
            deviceModel.findByIdAndRemove(id, function (err, device) {

                if (err) {
                    return res.status(500).send("Internal server error")
                } else {
                    res.send("Device Deleted")
                }
            });
        }
    });
});

// UpdateDevice put api
// app.put('/api/updateDevice/:id', verifyToken, (req, res, next) => {
app.put('/api/updateDevice/:id', (req, res, next) => {
    // console.log(req.body);

console.log("state ----> ",req.body);
// return;

    
    // jwt.verify(req.token, 'secretkey', (err, authData) => {
    //     if (err) {
    //         res.sendStatus(403);
    //     } else {
    deviceModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, device) => {
        console.log(device);
        if (err) {
            return res.status(500).send({ error: "unsuccessful" })
        };
        console.log(device);

        var state = req.body.state;

        console.log(state);

        ref.update({ [req.params.id]: req.body.state });

        ref.once("value")
            .then(function (snap) {
                console.log("snap.val()", snap.val());
            });

        res.status(201).json({ message: device });
    });
    //     }
    // });
})

app.get('/api/status/:id', function (req, res) {

    var data = [];

    console.log(req.params.id)

    var id = req.params.id
    deviceModel.find({ device_id: req.params.id }).select('state').exec((err, device) => {
        console.log("Status Api Is working", device);
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (device) {
            device.forEach(i => {
                data.push([i._id, i.state])

            });

            console.log(data);
            const obj = JSON.stringify(data);
            res.json({ data: JSON.parse(obj) });
            // res.json({data: [["1", "off"],["2", "off"],["3", "on"]]});
        } else {
            return res.status(404).send("No user found")
        }
    });
});

app.get('/api/Demo/:id', function (req, res) {

    var data = [];

    console.log(req.params.id)

    var id = req.params.id
    deviceModel.find({ zone_id: req.params.id }).select('state').exec((err, device) => {
        console.log("Status Api Is working", device);
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (device) {
            device.forEach(i => {
                data.push([i._id, i.state])

            });

            console.log(data);
            const obj = JSON.stringify(data);
            res.json({ data: JSON.parse(obj) });
            // res.json({data: [["1", "off"],["2", "off"],["3", "on"]]});
        } else {
            return res.status(404).send("No user found")
        }

        // console.log(req.params.id)

        //     res.json({data: [["1", "off"],["2", "off"],["3", "on"]]});

    });
});
//mongoimport --db=myFirstApp --collection=devices --file=devices.json
// Schedule Time to on/off device post api
app.post('/api/scheduleDevice', (req, res, next) => {
    console.log(req.body);
    const newDevice = new deviceModel(req.body);
    newDevice.save((err, device) => {
        if (err) {
            res.status(500).send('Internal server error');
        } else {
            console.log(device);
            res.status(201).json({
                message: 'New device added',
                data: device
            });
        }
    });
})

// VerifyToken
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        req.token = bearerHeader;
        next();
    } else {
        res.sendStatus(403);
    }
}

const server = http.createServer(app)
server.listen(4000, () => {
    console.log('server started on port 4000 to show changes using nodemon');
});
