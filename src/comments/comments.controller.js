import Comment from "./comments.model.js";

export const addCommit = async (req, res) => {
    try {
        
        const { comment } = req.params;
        const authenticatedUser = req.user;

        if (!authenticatedUser) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to commit this publication"
            })
        }

        const newComment = new Comment({
            comment,
            user: authenticatedUser._id
        })

        await newComment.save();

        res.status(201).json({
            success: true,
            message: "You've added a new comment",
            comment : newComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong tying to add a comment",
            error
        });
    };
};

export const listMyCommit = async (req, res) => {
    try {
        const userId = req.user._id;

        const comments = await Comment.find({ usr: userId });

        res.json({
            success: true,
            comments
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Ups, something went wrong trying to get the comments"
        })
    }
}

export const updtateCommit = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.params._id;

        const comment = await Comment.findOne({ _id : id, user : userId });

        if (!comment) {
            res.status(403).json({
                success: false,
                message: "You are not allowed to edit this comment"
            });
        }
        const updatedComment = await Comment.findByIdAndUpdate(id, req.body, { new : true });

        res.json({
            success: true,
            message: "You've updated your commit successfully!!",
            commit: updatedComment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to update the commit"
        });
    }
}

export const deleteCommit = async (req, res) => {
    try {

        const { id } = req.params;
        const userId = req.user._id;
        
        const comment = await Comment.findOne({ _id: id, user: userId });

        if (!comment) {
            return res.status(403).json({
                success: false,
                message: "You are not allowed to delete this commit"
            });
        }
        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "You've deleted this commit successfully!!!"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ups, something went wrong trying to delete the commit",
            error
        })
    }
}