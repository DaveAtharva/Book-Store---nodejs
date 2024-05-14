const User = require('./../Models/UserSchema.js');
const express = require('express');
const router = express.Router();
const {jwtauthmiddleware, generateToken} = require('./../jwt');

// 1. Create a User or Sign Up
router.post('/user', async (req, res) => {
    try {
        const data = req.body;
    
        // Assuming User model is imported correctly
        const newUser = new User(data);

        // Save the new user data to MongoDB
        const response = await newUser.save();

        // Generate token
        const payload = {
            id: response.id,
            isAdmin: response.isAdmin
        };
        const token = await generateToken(payload);

        console.log('Data Added');
        res.status(200).json({ Response: response, Token: token });

    } catch (error) {
        console.error('Error adding user:', error); // Log the error for debugging
        res.status(500).json({ message: 'Internal server error' });
    }
});


// 2. Login Route
router.post('/user/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        
        if (!user || !user.comparePassword(password)) {
            res.status(401).json({ message: 'Invalid Username or Password' });
            return; // Return to exit the function here
        }

        const payload = {
            id: user.id,
            isAdmin: user.isAdmin
        };
        const token = await generateToken(payload);
        // console.log('Token:', token); // Log token value
        res.json({ Token: token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: 'Internal Server Error' });
    }
});

//3. Get Profile 
router.get('/user/profile', jwtauthmiddleware, async (req,res)=>{
    try{
        const userData = req.user;
        const userId = userData.id;
        // console.log(userData);
        const Data = await User.findById(userId);

        if(!Data){ res.status(401).json({message : 'Data Not found'});}
        res.status(200).json({Data});    

    }catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
})

// 4. Update User 
router.put('/user/:id', async (req, res) => {
    try {
        const newUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!newUser) {
            return res.status(404).json({ message: 'Person not found' });
        }
        console.log({ Message: 'Data Updated Successfully' });
        res.status(200).json(newUser); // Replace user with newUser
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


//5. Delete User
router.delete('/user/:id', async (req, res) => {
    try {
        const newUser = await User.findByIdAndDelete(req.params.id);
        if (!newUser) {
            return res.status(404).json({ message: 'Person not found' });
        }
        console.log({Message:'Data Deleted Succesfully'});
        res.status(204).json({ message: 'User Deleted Succesfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// 6. Bulk User Data Add
router.post('/users/bulk', async (req, res) => {
    try {
        // Extract the array of user objects from the request body
        const users = req.body;

        // Insert the users into the database in bulk
        const insertedUsers = await User.insertMany(users);

        res.status(201).json({ message: 'Users uploaded successfully', users: insertedUsers });
    } catch (error) {
        console.error('Error uploading users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
