


const AdminModel = require("./../Models/Admin.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


const cloudinary = require("cloudinary").v2;

cloudinary.config({ 
    cloud_name: 'dqxvndtoy', 
    api_key: '168574967552612', 
    api_secret: '3oc-CwNqOO-C6Ocs-c25-JgoxR0' 
  });


exports.signUp = async (req, res) => {
 
  try {
    const {
      Name,
      email,
      designation,
      password,
      confirmPassword,
      userName,
      mobileNo
    } = req.body;
  
    const existingAdmin = await AdminModel.findOne({email});

    if (existingAdmin) {
      return res.status(400).json({ error: "Admin already registered with us. Please signIn by using userName and password" });
    }

    if (password != confirmPassword) {
        return res.status(400).json({ error: "Password and ConfirmPassword must be same..." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const CreateAdmin = new AdminModel({
        Name : Name,
      email: email,
      designation : designation,
      password: hashedPassword,
      confirmPassword : confirmPassword,
      userName : userName,
      mobileNo : mobileNo
    });

    await CreateAdmin.save();

   // Omit sensitive information from the response
    const Admin = await AdminModel.findOne({ email }).select({
      password: 0,
      confirmPassword : 0,
      otp : 0
    });

    const token = jwt.sign(
      { id: CreateAdmin._id },
      "121212WE",
      {
        expiresIn: "24h", // Set the expiration time for the token
      }
    );

    res.status(201).json({
      message: `Admin registered successfully having Name - ${CreateAdmin.Name}`,
      accessToken: token,
      Admin,
    });
    console.log(`Admin registered successfully having Name ${CreateAdmin.Name}`)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.signIn = async (req, res) => {

  try {
    const { userName, password } = req.body;

    // Find the user by userName
    const Admin = await AdminModel.findOne({ userName });

    // Check if the user exists
    if (!Admin ) {
      return res.status(404).json({ error: "Admin not found with provided details..." });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, Admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: Admin._id }, "121212WE", {
      expiresIn: "24h", // Set the expiration time for the token
    });

    // Return the token in the response
    res
      .status(200)
      .json({
        message : `hey ${Admin.Name} , you are successfully logged In...`,
        email: Admin.email,
        accessToken: token,
      });

      console.log(`Admin ${Admin.Name} , just logged In...`)
  }catch (error) {
    res.status(500).json({ error: error.message }); 
  }
};

exports.adminProfile = async (req,res) => {

  const {id} = await req ?.User;

  try {

      const detailsOfAdmin = await AdminModel.findById({ _id : id}) ;

      if (detailsOfAdmin) {

          // const accessToken = req.headers.authorization.split(' ')[1];
          // console.log(accessToken)


          const response = {
              mobileNo : detailsOfAdmin.mobileNo,
              Name : detailsOfAdmin.Name,
              designation : detailsOfAdmin.designation,
              email: detailsOfAdmin.email,
              userName : detailsOfAdmin.userName,
              image : detailsOfAdmin.image
          }
      
          res.json ({message : "Admin Data Found.." , result : response}).status(200);
      } else {
          res.json({message : "No Admin Found"}).status(404)
      }

  } catch (error) {
      console.log(error.message);
      res.send(error.message).status(500)
  }
}


// exports.updateProfile = async (req,res) => {
   
//   let dataToBeUpdate = req.body;

//   try {
//     const {id} = await req ?.User;

//       if (!id) {
//           res.json({message : "please provide a valid Id for update data..."}).status(400);
//      }
   
//       let updatedData = await AdminModel.findByIdAndUpdate(id,dataToBeUpdate,{ new: true});

//       if(updatedData) {
//           res.json({message : "Your Entered Data Updated Successfully...." , result : updatedData}).status(200);

//       } else {
//           res.send("Data not found for updation...").status(404);
//       }
//     }  
//     catch(error){
//       console.log(error.message);
//       res.send(error.message).status(500);
//  }
// }


  
exports.updateProfile = async (req, res) => {
  try {
    const { id } = await req?.User;
    const { image } = req.files || {};
    const dataToBeUpdate = req.body;

    if (!id) {
      return res.status(400).json({ message: "Please provide a valid Id for updating data." });
    }

    // If an image is provided, upload it to Cloudinary
    let updatedImage = '';
    if (image) {
      const result = await cloudinary.uploader.upload(image.tempFilePath);
      updatedImage = result.secure_url;
    }

    // Prepare update data, excluding image if not provided
    const excludedFields = ['_id', 'UID', 'image']; 
    const filteredData = Object.keys(dataToBeUpdate)
      .filter(key => !excludedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = dataToBeUpdate[key];
        return obj;
      }, {});

    // If an image is provided, include it in the update data
    if (updatedImage) {
      filteredData.image = updatedImage;
    }

    // Ensure the _id is not modified during the update
    delete filteredData._id;

    // Perform the update
    const updatedData = await AdminModel.findByIdAndUpdate(
      id,
      filteredData,
      { new: true }
    ).select('-password -confirmPassword');

    if (updatedData) {
      return res.status(200).json({ message: "Profile updated successfully.", result: updatedData });
    } else {
      return res.status(404).send("Data not found for updating.");
    }
  } catch (error) {
    console.log(error.message);
    return res.status(500).send(error.message);
  }
};
exports.alTeachers = async (req,res) => {
    try {
      const {id} = await req ?.User;

      const allStudents = await TeacherModel.find();

      if (id && allStudents) {
         res.json ({message : "all teacher's data listed below..." , Teachers : allStudents}).status(201);
      } else if (!allStudents) {
        res.json ({message : "No Data found..."}).status(404);
      }
    }
    catch (error) {
      res.status(500).json({ error: error.message });
    }
}

exports.allStudents = async (req,res) => {
  try {
    const {id} = await req ?.User;

    const allStudents = await StudentModel.find();

    if (id && allStudents) {
       res.json ({message : "all student's data listed below..." , Students : allStudents}).status(201);
    } else if (!allStudents) {
      res.json ({message : "No Data found..."}).status(404);
    }
  }
  catch (error) {
    res.status(500).json({ error: error.message });
  }
}

exports.deleteStudent = async (req,res) => {
    const studentId = req.params.studentId;

    try {

      if (!studentId) {
           res.json({message : "please provide a valid Id for delete student..."}).status(400);
      }
   
      const deletedOne = await StudentModel.findByIdAndDelete({_id : studentId});

      if(deletedOne) {
           res.json({message : "Data Removed Successfully..."}).status(201);
      } else {
          res.json({message : "No Data Found..."}).status(404);
      }
  }
  catch(error) {
      console.log(error.message);
      res.send(error.message).status(500);
 }
}

exports.deleteTeacher = async (req,res) => {
  const teacherId = req.params.teacherId;

  try {

    if (!teacherId) {
         res.json({message : "please provide a valid Id for delete Teacher..."}).status(400);
    }
 
    const deletedOne = await TeacherModel.findByIdAndDelete({_id : teacherId});

    if(deletedOne) {
         res.json({message : "Data Removed Successfully..."}).status(201);
    } else {
        res.json({message : "No Data Found..."}).status(404);
    }
}
catch(error) {
    console.log(error.message);
    res.send(error.message).status(500);
}
}


exports.disableStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await StudentModel.findOne({ _id : id });

    if (!candidate) {
      return res.status(400).json({ error: 'Student not found' });
    }

    await StudentModel.updateOne({ _id: id }, { accountStatus: 'disabled' });

    res.status(200).json({ message: 'Student disabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enableStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await StudentModel.findOne({ _id : id });

    if (!candidate) {
      return res.status(400).json({ error: 'Student not found' });
    }

    await StudentModel.updateOne({ _id: id }, { accountStatus: 'Active' });

    res.status(200).json({ message: 'Student enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.disableTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await TeacherModel.findOne({ _id:id });

    if (!candidate) {
      return res.status(400).json({ error: 'Teacher not found' });
    }

    await TeacherModel.updateOne({ _id: id}, { accountStatus: 'Disabled' });

    res.status(200).json({ message: 'Teacher disabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.enableTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const candidate = await TeacherModel.findOne({ _id:id });

    if (!candidate) {
      return res.status(400).json({ error: 'Teacher not found' });
    }

    await TeacherModel.updateOne({ _id: id }, { accountStatus: 'Active' });

    res.status(200).json({ message: 'Teacher enabled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.attendanceReportByDateAndBranch = async (req, res) => {
  try {
      const date = new Date(req.body.date);
      const branch = req.body.branch;

      // Aggregate to get attendance report for all students in the branch
      const attendanceReport = await StudentModel.aggregate([
          {
              $match: { branchName: branch }
          },
          {
              $project: {
                  _id: 0,
                  Name: 1,
                  UID: 1,
                  rollNo: 1,
                  attendance: {
                      $filter: {
                          input: "$attendance",
                          as: "att",
                          cond: { $eq: ["$$att.date", date] }
                      }
                  }
              }
          }
      ]);

      // Send the attendance report as response
      res.json(attendanceReport);
  } catch (error) {
      // Handle errors
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
  }
};

exports.passwordChange = async (req, res) => {

  const {id,email} = await req ?.User;
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    const admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(404).json({ error: "admin not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password does not match" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: "New password and confirm password do not match" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the employee's password
    admin.password = hashedPassword;
    await admin.save();

   
    res.status(200).json({ message: "Password successfully updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};