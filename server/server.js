const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Model = require('./model');
// const cors = require('./cors');

const app = express();

const API_PORT = process.env.PORT || 3000;

const DB_URI = 'mongodb://tazirahmb:dumdum987@ds263791.mlab.com:63791/todolist';

mongoose.connect(DB_URI);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection Error :'));

// app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();

router.get('/todo', (req, res) => {
    Model.find((err, result) => {
        if (err) return res.json({success: false, error: err});
        return res.json({success: true, data: result});
    })
});

router.post('/todo', (req, res) => {
    const model = new Model();
    const {text} = req.body;

    if(!text) {
        return res.json({
            success: false,
            error: 'please insert text'
        });
    }
    model.text = text;
    model.completed = false;
    model.save(err => {
        if(err) return res.json({
            success: false,
            error: err
        });
        return res.json({ success: true });
    })
})

router.put('/todo/:todoId', (req, res) => {
    const objId = req.params.todoId;
    if(!objId) {
        return res.json({
            success: false,
            error: 'no todo ID'
        });
    }
    Model.findById(objId, (error, model) => {
        if (error) return res.json({ success: false, error });
        const {text, completed} = req.body;
        if (text) model.text = text;
        if (completed) model.completed = completed;
        model.save(error => {
            if(error) return res.json({
                success: false,
                error
            });
            return res.json ({success: true});
        })
    })
})

router.delete('/todo/:todoId', (req, res) => {
    const objId = req.params.todoId;
    if(!objId) {
        return res.json({
            success: false,
            error: 'no todo ID'
        });
    }
    Model.remove({_id: objId}, (error, result) => {
        if(error) return res.json({
            success: false,
            error
        });
        return res.json({
            success: true,
            data: result
        })
    })
})

app.use('/api', router);

app.listen(API_PORT, () => console.log('listening on port ' + API_PORT));