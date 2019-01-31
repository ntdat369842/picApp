const express = require('express');
const logger = require('morgan');

const path = require('path');
const fs = require('fs');

const helper = require('./helper/helper');

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.resolve(__dirname, 'views') );
app.set('view engine', 'ejs');

app.use( logger('dev') );

app.use((req, res, next) => {
    let log = `${req.method} - ${req.url} - ${req.statusCode} - ${new Date().toISOString()}`;

    fs.appendFile('log.txt', log + '\n', err => {
        if (err) console.log('Unable to append to log.txt')
    });

    next();
});

app.use( express.static(__dirname + '/public') );

// app.use((req, res, next) => {
//     let url = helper.stripTrailingSlash(req.url) + '.jpg';
//     let filePath = path.join(__dirname, "public/img", url);
//     fs.stat(filePath, (err, pic) => {
//         if (err) next(new Error('Pic not found!'));

//         if (pic) {
//             res.render('home', {
//                 picSrc: 'img' + url
//             });
//         } else {
//             next(new Error('Pic not found'));
//         }

//     });
// });

app.use('/:pic', (req, res, next) => {
    let picID = req.params.pic;
    let filePath = path.join(__dirname, "public/img", `${picID}.jpg`);

    fs.stat(filePath, (err, pic) => {
        if (err) next(new Error('Pic not found!'));

        if (pic) {
            res.render('home', {
                picSrc: `/img/${picID}.jpg`
            });
        } else {
            next(new Error('Pic not found'));
        }

    });
})

app.use((req, res) => {
    let log = 'Error 404';

    fs.appendFile('server.log', log + '\n', err => {
        if (err) console.log('Unable to append to server.log')
    });

    res.status(404).render('404');
});

app.use((err, req, res, next) => {
    let log = `${err}`;    

    fs.appendFile('server.log', log + '\n', err => {
        if (err) console.log('Unable to append to server.log')
    });

    res.status(500).render('500');
});

app.listen(port, () => {
    console.log('Server is listening at port 3000');
});