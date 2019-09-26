const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userModel = require('./user.model');
const zoneModel = require('./zone.model');
const deviceModel = require('./device.model');
const userController = require('./user.controller');
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

//AddZone post api

app.post('/api/addzone', (req, res, next) => {
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

//GetZone get api

app.get('/api/findZone', function (req, res) {

    console.log(req.params.id)

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
});

//DeleteZone get api

app.get('/api/deleteZone/:id', function (req, res) {

    console.log(req.params.id)

    var id = req.params.id
    zoneModel.findByIdAndRemove(id, function (err, zone) {

        if (err) {
            return res.status(500).send("Internal server error")
        } else {
            res.send("Zone Deleted")
        }
    });
});


//UpdateZone put api

app.put('/api/updateZone/:id', (req, res, next) => {
    console.log(req.body);
    // const newUser = new userModel(req.body);
    zoneModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, zone) => {
        console.log(zone);
        if (err) {
            return res
                .status(500)
                .send({ error: "unsuccessful" })
        };
        res.send({ success: "success" });
    });
})


// ************** Add Device API ****************

//AddDevice post api

app.post('/api/addDevice', (req, res, next) => {
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

//GetDevice get api

app.get('/api/findDevice', function (req, res) {

    console.log(req.params.id)

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
});


//GetDevice by Id get api

app.get('/api/findDevices/:id', function (req, res) {

    console.log(req.params.id)

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
});

//DeleteDevice get api

app.get('/api/deleteDevice/:id', function (req, res) {

    console.log(req.params.id)

    var id = req.params.id
    deviceModel.findByIdAndRemove(id, function (err, device) {

        if (err) {
            return res.status(500).send("Internal server error")
        } else {
            res.send("Device Deleted")
        }
    });
});


//UpdateDevice put api

app.put('/api/updateDevice/:id', (req, res, next) => {
    console.log(req.body);
    // const newUser = new userModel(req.body);
    deviceModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, upsert: true }, (err, device) => {
        console.log(device);
        if (err) {
            return res
                .status(500)
                .send({ error: "unsuccessful" })
        };
        console.log(device);
            res.status(201).json({
                message: device,
            });
    });
})






app.get('/api/status/:id', function (req, res) {

    var arr2 = [];
    
    console.log(req.params.id)

    var id = req.params.id
    deviceModel.find({ zone_id: req.params.id }).select('state').exec((err, device) => {
        console.log("Status Api Is working", device);
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (device) 
        {
            device.forEach(i => {
                arr2.push(i.state)
                
            });

            console.log(arr2);

            res.send(arr2);
            // res.json(device);
        } else {
            return res.status(404).send("No user found")
        }
    });
    
            // res.json({data: "1", status: "off"});
            

});



const server = http.createServer(app)
server.listen(8080, () => {
    console.log('server started on port 8080 to show changes using nodemon');
});
