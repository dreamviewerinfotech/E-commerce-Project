const CivilianModel = require("./../Models/User.model")
const bcrypt = require("bcryptjs");



exports.registerCivilian = async (req, res) => {
 
    try {
      const {
        password,
        confirmPassword,
        Name,
        address,
        mobileno,
        email,

      } = req.body;
  
    //   const { image } = req.files;
  
      // Check if the mobile number already exists in the database
      const existingCivilian = await CivilianModel.findOne({ mobileno });
      if (existingCivilian) {
        return res.status(400).json({ error: "Mobile number already exists" });
      } else if (password !== confirmPassword) {
        return res.status(400).json({ error: "Passwords don't match" });
      }
  
      // Ensure password and confirmPassword are defined
      if (!password || !confirmPassword) {
        return res.status(400).json({ error: "Password or confirmPassword is undefined" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedConfirmPassword = await bcrypt.hash(confirmPassword, 10);
  
    //   cloudinary.uploader.upload(image.tempFilePath, async (err, result) => {
  
    //     if (err) {
    //         return res.status(500).json({ error: "Error occurred while trying to upload the image to cloudinary..." });
    //     }
  
  
      const civilianCreate = new CivilianModel({
        mobileno: mobileno,
        Name: Name,

        email: email,
        address: address,

        password: hashedPassword,
        confirmPassword: hashedConfirmPassword,
        // image: result.url , // Use the URL obtained from cloudinary,
    
      });
  
      await civilianCreate.save();
  
     // Omit sensitive information from the response
      const civilian = await CivilianModel.findOne({ mobileno }).select({
        password: 0,
        confirmPassword: 0,
      });
  
      const token = jwt.sign(
        { id: civilianCreate._id },
        "121212WE",
        {
          expiresIn: "24h", // Set the expiration time for the token
        }
      );
  
      res.status(201).json({
        message: "Civilian registered successfully",
        status : 201,
        accessToken: token,
        civilian,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }}



exports.loginCivilian = async (req, res) => {
        try {
          const { mobileno, password } = req.body;
      
          // Find the user by mobile number
          const civilian = await CivilianModel.findOne({ mobileno });
      
          // Check if the user exists
          if (!civilian) {
            return res.status(404).json({ error: "Civilian not found" });
          }
      
          // Compare the provided password with the hashed password in the database
          const passwordMatch = await bcrypt.compare(password, civilian.password);
      
          if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid password" });
          }
      
          // Generate a JWT token
          const token = jwt.sign({ id: civilian._id }, "121212WE", {
            expiresIn: "24h", // Set the expiration time for the token
          });
      
          // Return the token in the response
          res
            .status(200)
            .json({
              success: true,
              status : 200,
              accessToken: token,
              civilian
            });
        }catch (error) {
          res.status(500).json({ error: error.message }); 
        }
      };
      
      
exports.userProfile = async (req,res) => {

        const {id} = await req ?.User;
      
        try {
      
            const detailsOfUser = await CivilianModel.findById({ _id : id}) ;
      
            if (detailsOfUser) {
      
                // const accessToken = req.headers.authorization.split(' ')[1];
                // console.log(accessToken)
      
      
                const response = {
                    mobileNo : detailsOfUser.mobileNo,
                    Name : detailsOfUser.Name,
                    email: detailsOfUser.email,
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
      