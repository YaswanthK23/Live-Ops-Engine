const express = require("express");
// const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const SECRET_CODE = "yaswanthdamarlakumar";
// const salt = 10;
const {offer} = require("../schemas/offer-schema");

const getUserByToken = (token) =>{
     return new Promise((resolve, reject) =>{
        if(token){
            let userData
            try{
                userData = jwt.verify(token, SECRET_CODE);
                resolve(userData);
            }catch(err){
                reject("Token Invalid");
            }
        }
        else{
            reject("Token not found")
        }
    })
}


router.post("/list", async(req,res)=>{
    const validOffers = [];
    offer.find().then((offers)=>{
        offers.filter((offer)=>{
            const rules = offer.target.split("and");
            rules.forEach((rule) =>{
                let ruleKey = {};
                if(rule.includes(">")){
                    ruleKey = { key : rule.trim().split(">")[0].trim(), value : parseInt(rule.trim().split(">")[1])}
                    if(req.body[ruleKey.key] > ruleKey.value){
                        validOffers.push(offer)
                    }
                }else{
                    ruleKey = {key : rule.trim().split("<")[0].trim() , value : parseInt(rule.trim().split("<")[1])}
                    if(req.body[ruleKey.key] < ruleKey.value){
                        validOffers.push(offer)
                    }
                }


            })
        })
        res.status(200).send(validOffers);
    }).catch(()=>{
        res.status(500).send("internal server error")
    })
})

router.post("/create", async(req,res)=>{

    getUserByToken(req.headers.authorization).then((user)=>{
        // res.status(200).send(user);
        offer.create({...req.body, username : user.username}).then((offer)=>{
            res.status(200).send(offer);
        }).catch((err)=>{
            res.status(400).send({message : err.message})
        })
    }).catch((err)=>{
        res.status(400).send(err);
    })

})

router.put("/update", async(req,res)=>{
    offer.updateOne({ _id : req.body.id}, (err, updateData)=>{
        if(err){
            res.status(400).send(err);
        }
        else{
            updateData.offer_id = req.body.offer_id;
            updateData.offer_title = req.body.offer_title;
            updateData.offer_description = req.body.offer_description;
            updateData.offer_image = req.body.offer_image;
            updateData.offer_sort_order = req.body.offer_sort_order;
            updateData.content = req.body.content;
            updateData.schedule = req.body.schedule;
            updateData.target = req.body.target;
            updateData.pricing = req.body.pricing;
            updateData.username = req.body.username

        }
    })
})

router.delete("/delete",async(req, res) =>{
    offer.deleteOne({
        _id : req.body.id
    })
})
module.exports = router;