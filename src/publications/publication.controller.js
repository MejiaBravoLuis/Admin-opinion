import Publication from "./publication.model.js";
import Comment from "../comments/comments.model.js"
import Category from "../category/category.model.js"

export const getPublication = async (req, res) => {
    try {
        
        const publications = await Publication.find({ status: true })
        .populate("user", "name")
        .populate("user", "username")
        .populate("category", "name")
        .populate({ path: "comments", select: "comment" })

        res.json({ 
            success: true,
            publications
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, someting went wrong trying to list the publications"
        })
    }
}

export const addPublication = async (req, res) => {
    try {
        
        const { title, ppalText, categoryName } = req.body;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(400).json({
                success: false,
                message: "No token provided or this user isn't authenticated"
            });
        }

        const category = await Category.findOne({ name: categoryName });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "The category doesn't exist"
            });
        }

        const publication = new Publication({
            title,
            ppalText,
            user: authenticatedUser._id,
            category: category._id,
        });

        await publication.save();

        res.status(200).json({
            success: true,
            message: "Youv'e just added a publication successfully!!",
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to add a publication",
            error
        });
    }
}

export const updatePublication = async (req, res) => {
    try {
        
        const { id } = req.params;
        const { title, ppalText, categoryName } = req.body;
        const userId = req.user._id;
        
        if (!title && !ppalText && !categoryName) {
            return res.status(400).json({
                success: false,
                message: "Fields can't be empty"
            })
        }

        const publication = await Publication.findOne({ _id: id, user: userId });

        if (!publication) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to edit this publication"
            })
        }

        if (categoryName) {
            const category = await Category.findOne({ name : categoryName })
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Seems like this category doesn't exist"
                })
            }
            publication.category = category._id;
        }

        if(title) publication.title = title;
        if(ppalText) publication.ppalText = ppalText;

        await publication.save()

        res.json({
            success: true,
            message: "Publication updated successfully!!!",
            publication
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to update the publication"
        });
    }
};

export const deletePublication = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const publication = await Publication.findOne({ _id: id, user: userId })

        if (!publication) {
            return res.status(403).json({
                success: false,
                message: "You can't delete this publication",
            })
        }

        const deletedPublication = await Publication.findByIdAndDelete(id);

        if (!deletedPublication) {
            return res.status(404).json({
                success: false,
                message: "Seems like this publication doesn't exist"
            })
        }

        res.status(200).json({
            success: true,
            message: "Publication deleted successfully",
            id: id
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to delete the publication",
            error
        })
    }
}

export const addCommitTo = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(403).json({
                success: false, 
                message: "You are not allowed to commit here"
            })
        }

        const publication = await Publication.findById(id);
        if (!publication) {
            return res.status(404).json({
                success: false,
                message: "Couldn't find the publication"
            })
        }

        const newCommit = new Comment ({
            comment,
            user: authenticatedUser._id
        });

        await newCommit.save();

        publication.comments.push(newCommit._id);
        await publication.save();
        res.status(200).json({
            success: true,
            message: "You've jut commited this publication",
            comment: newCommit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to commit the publication",
            error
        });
    };
};