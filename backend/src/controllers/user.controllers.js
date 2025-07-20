import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // Store refresh token in DB
    user.refreshToken = refreshToken;
    //save user after adding refreshToken ~ validateBeforeSave (when update one field)
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating Access and Refresh Token"
    );
  }
};

// <---- Setup Registration ---->

const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  // checks for inputs
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Check if user exists
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }

  // Check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // Upload images to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  //check & upload together
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(400, "Avatar upload failed");
  }

  // Create user
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  // Retrieve created user without sensitive fields
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

// <---- Setup Login ---->

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "Username and email is required!!");
  }

  // Find user
  const findUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!findUser) {
    throw new ApiError(404, "User does not exist!!");
  }

  // Check password
  const isPasswordValid = await findUser.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid password!!");
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    findUser._id
  );

  // Retrieve user data without sensitive fields ~ select to ignore fields
  const loggedInUser = await User.findById(findUser._id).select(
    "-password -refreshToken"
  );

  const options = {
    // opt for cookies can only modified by server
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully!!"
      )
    );
});

// <---- Setup Logout ---->

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { refreshToken: undefined },
    new: true,
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// <---- Setup refresh Access Token ---->

const refreshAccessToken = asyncHandler(async (req, res) => {
  // get the token
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // if don,t get the token throw error
  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized incoming Refresh Token");
  }

  try {
    // verify incoming Refresh Token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // find user in mongo
    const user = await User.findById(decodedToken?._id);

    // check user
    if (!user) {
      throw new ApiError(401, "invalid Refresh Token");
    }

    // match incomingRefreshToken with refresh token saved in user
    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "expired or used Refresh Token");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };

    // generate new access token
    const { accessToken, newRefreshToken } =
      await generateAccessandRefreshToken(user._id);

    // send the token to user
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, newRefreshToken },
          "ACCESS TOKEN REFRESHED"
        )
      );
  } catch (error) {
    throw new ApiError(500, "invalid Refresh Token");
  }
});

// <---- change/update current password ---->

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  //find user
  const user = await User.findById(req.user?._id);

  //check password
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    throw new ApiError(400, "invalid password");
  }

  //set new password
  user.password = newPassword;
  // save password ~ { validateBeforeSave: false } --> when one field is updating
  await user.save({ validateBeforeSave: false });

  //
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully!!"));
});

// <---- get Current User ---->

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    status: 200,
    data: req.user,
    message: "Current user fetched successfully!!",
  });
});

// <---- update current user details ---->

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All fields are required !!");
  }

  //find  user
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname: fullname,
        email: email,
      },
    },
    { new: true }
  ).select("-password");

  // Return updated user details
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully!!"));
});

// <---- update user  avatar (Multer) ---->

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // save the avatar in localpath
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar url is missing !!");
  }

  // upload on cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);

  // check for url send by cloudinary
  if (!avatar.url) {
    throw new ApiError(400, "Avatar file is missing from cloudinary !!");
  }

  // update avatar
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password");

  //  Return a response
  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully!!"));
});

// <---- Update user cover image (Multer) ---->

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  // Save the cover image in the local path
  if (!coverImageLocalPath) {
    throw new ApiError(400, "Cover image file is missing!!");
  }

  // Upload cover image to Cloudinary
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  // Check for the URL sent by Cloudinary
  if (!coverImage.url) {
    throw new ApiError(400, "Cover image url is missing from Cloudinary!!");
  }

  // Update cover image in the database
  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: { coverImage: coverImage.url } },
    { new: true }
  ).select("-password");

  //  Return a response
  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover image updated successfully!!")
    );
});

// <---- get User Channel Profile ---->

const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  // Check if username is provided and not just whitespace
  if (!username?.trim()) {
    throw new ApiError(400, "User is missing !!");
  }

  const channel = await User.aggregate([
    // Step 1: Match the user by username (case-insensitive)
    {
      $match: {
        username: { $regex: `^${username}$`, $options: "i" }, // Allows case-insensitive matching
      },
    },

    // Step 2: Lookup the number of subscribers to this channel
    {
      $lookup: {
        from: "subscriptions", // Collection containing subscription records
        localField: "_id", // User's _id in the User collection
        foreignField: "channel", // Matches subscriptions where this user is the channel being subscribed to
        as: "subscribers", // Output array of matching subscription documents
      },
    },

    // Step 3: Lookup the number of channels this user is subscribed to
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber", // Matches subscriptions where this user is the subscriber
        as: "subscribedTo",
      },
    },

    // Step 4: Add computed fields
    {
      $addFields: {
        subscribersCount: { $size: "$subscribers" }, // Count number of subscribers
        channelsSubscribedToCount: { $size: "$subscribedTo" }, // Count number of channels this user subscribed to

        // Determine if the current logged-in user is subscribed to this channel
        isSubscribed: {
          $cond: {
            if: {
              // Extract subscriber IDs from the "subscribers" array and check if req.user._id exists in it
              $in: [
                req.user?._id,
                {
                  $map: {
                    input: "$subscribers",
                    as: "s",
                    in: "$$s.subscriber",
                  },
                },
              ],
            },
            then: true,
            else: false,
          },
        },
      },
    },

    // Step 5: Select only the required fields to return
    {
      $project: {
        fullname: 1,
        username: 1,
        subscribersCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1, // Only return necessary fields to the client
      },
    },
  ]);

  // If no user is found, throw a 404 error
  if (!channel?.length) {
    throw new ApiError(404, "User not found");
  }

  // Return the first matched user profile
  res.status(200).json(channel[0]);
});

// Export modules
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
};
