import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";

const addSong = async (req, res) => {
    try {
        // Validate request body and files
        const { name, desc, album } = req.body;
        if (!name || !desc || !album || !req.files?.audio || !req.files?.image) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];

        // Upload audio file to Cloudinary
        const audioUpload = await cloudinary.uploader.upload(audioFile.path, { resource_type: "video" });
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });

        // Calculate song duration
        const duration = audioUpload.duration
            ? `${Math.floor(audioUpload.duration / 60)}:${Math.floor(audioUpload.duration % 60)}`
            : "0:00";

        // Save song data to the database
        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
        };

        const song = new songModel(songData);
        await song.save();
        res.json({ success: true, message: "Song Added", song });

    } catch (error) {
        console.error("Error in addSong:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const listSong = async (req, res) => {
    try {
        const allSongs = await songModel.find({});
        res.json({ success: true, songs: allSongs });
    } catch (error) {
        console.error("Error in listSong:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

const removeSong = async (req, res) => {
    try {
        const { id } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Song ID is required" });
        }

        await songModel.findByIdAndDelete(id);
        res.json({ success: true, message: "Song Removed" });

    } catch (error) {
        console.error("Error in removeSong:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export { addSong, listSong, removeSong };
