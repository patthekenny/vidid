const express = require('express');
const router = express.Router();


router.post('/like/:v', (req, res, next) => {
    console.log(req.user);
    res.send(req.user);
});

module.exports = router;
