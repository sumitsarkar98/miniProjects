// import module
import mongoose, { Schema } from "mongoose";

// mongoose-Aggregate-Paginate-v2  ~ aggregation query
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

// create mongoose schema
const videoSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
      required: true,
    },
    thumbnai: {
      type: String, // cloudinary url
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // cloudinary url
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

// use before export
videoSchema.plugin(mongooseAggregatePaginate);

//export
export const Video = mongoose.model("Video", videoSchema);
