const express = require('express');
const router = express.Router();
const validateBountyInput = require('../validation/bounty');

const Bounty = require('../models/Bounty');

router.post('/create', function(req, res) {
    const { errors, isValid } = validateBountyInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    Bounty.findOne({
        title: req.body.title
    }).then(bounty => {
        if(bounty){
            return res.status(400).json({
                title: 'Bounty with this title exists'
            })
        } else {
            const newBounty = {
                title: req.body.title,
                description: req.body.description,
                reward: req.body.reward,
                createdBy: req.body.createdBy
            };
            Bounty.create(newBounty)
                .then(function(dbBounty) {
                    res.json(dbBounty);
                })
                .catch(function(err) {
                    res.json(err);
                });
        }
    });
});

router.get('/bounty/:id', function(req, res) {
    Bounty.findOne({ _id: req.params.id })
        .then(function(dbBounty) {
            res.json(dbBounty);
        })
        .catch(function(err) {
            res.json(err);
        });
});

router.get('/allBounty', function(req, res) {
    Bounty.find({})
        .then(function(dbBounties) {
            return res.json(dbBounties);
        })
        .catch(function(err) {
            return res.json(err);
        });
});

module.exports = router;
