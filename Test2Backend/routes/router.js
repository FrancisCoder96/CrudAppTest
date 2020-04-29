const express = require("express");

const router = express.Router();

let Person = require('../models/person');

router.get('/', async(req, res) => {
   try {
      const findPersons = await Person.find({});
      const foundPerson = findPersons;
      res.status(200).json(foundPerson);
   } catch (error) {
      res.status(404).json(new Error(error.message));
   }
});

router.get('/findOne/:id', async(req, res) => {
   try {
      const findOnePerson = await Person.find({ _id: req.params.id });
      res.status(200).json(findOnePerson);
   } catch (error) {
      res.status(404).json(error.message);
   }
})

router.post('/addPerson', async(req, res) => {
   const username = req.body.username || undefined,
            age = req.body.age || undefined,
            gender = req.body.gender || undefined;

   let errors = [];
   try {

      if(!username)
         errors.push('username is undefined, cannot submit the form');
      if(!age)
         errors.push(' age is undefined, cannot submit the form');
      if(!gender)
         errors.push(' gender is undefined, cannot submit the form')      
      if(errors.length) {
         throw new Error(`There is an error in validation!`)
      } else {
         const addPerson = new Person({
            username,
            age,
            gender
         });
   
         const newPerson = await addPerson.save();
         const newPersonData = newPerson;
         res.status(201).json(newPersonData);
      }
   } catch (error) {
      res.status(400).json({ errorMsg: error.message, errors })
   }
});

router.put('/updatePerson/:id', async(req, res) => {
   try {

      const updatedUsername = req.body.username || undefined;
      const updatedAge = +req.body.age || undefined;
      const updatedGender = req.body.gender || undefined;

      const findOnePerson = await Person.find({ _id: req.params.id });
      const foundPerson = findOnePerson;
      const { username, age, gender } = foundPerson[0];

      await Person.findByIdAndUpdate({ _id: req.params.id }, {
         $set: {
            username: updatedUsername || username,
            age: updatedAge || age,
            gender: updatedGender || gender
         }
      }, { useFindAndModify: false } );

      const newlyUpdatedPerson = await Person.find({ _id: req.params.id });
      res.status(201).json(newlyUpdatedPerson);
   } catch (error) {
      res.status(404).json(error.message)
   }
});

router.delete('/deletePerson/:id', async(req, res) => {
   try {
      const findOnePersonToDelete = await Person.findByIdAndDelete({_id: req.params.id}, {
         useFindAndModify: false
      });

      if(!findOnePersonToDelete)
         throw new Error("The given id is either null or deleted");
      else {
         const deletedPerson = findOnePersonToDelete;
         res.status(200).json({ deletedPerson, status: "deleted"})
      }
   } catch (error) {
      res.status(404).json(error.message)
   }
})


module.exports = router;