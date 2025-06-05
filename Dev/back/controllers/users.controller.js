const UserModel = require('../models/User.model')

const createUser = async (req, res) => {
    try {
        const {email,password,cin,lastName,firstName} = req.body;

        // Check if the user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(422).send({ message: 'Email already exists' });
        }
        const newUser = new UserModel({
            firstName,
            lastName,
            email,
            password,
            cin
        });
        // Save the new user to the database
        await newUser.save();

        // Send a success response
        res.send({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).send({ message: 'Error creating user', error });
    }
};

const getUsers = async (req, res) => {
    try {
        let result = await UserModel.find()
        res.send(result)
    } catch (error) {
        res.status(420).send(error)

    }
}

const getUserById = async (req, res) => {
    let id=req.params.id
    try {
        let result = await UserModel.findOne({_id:id})
        res.send(result)
    } catch (error) {
        res.status(420).send(error)
    }
}
const deleteUser = async (req, res) => {
    try {
        let id = req.params.id
        let result = await UserModel.deleteOne({ _id: id })
        res.send(result)
    } catch (error) {
        res.status(420).send(error)
    }

}
const updateUser = async (req, res) => {
    let id = req.params.id
    try {
        let result = await UserModel.updateOne({ _id: id }, req.body)
        res.send(result)
    } catch (error) {
        res.status(420).send(error)
    }
}
const getCreatorNameByProjectId = async (req, res) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findById(projectId).populate('creator', 'name');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ creatorName: project.creator.name });
  } catch (error) {
    console.error('Error fetching creator name:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { createUser, updateUser, deleteUser, getUsers, getUserById,getCreatorNameByProjectId }
