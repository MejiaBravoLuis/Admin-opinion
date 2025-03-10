import User from '../users/user.model.js'
import Publication from '../publications/publication.model.js'
import Category from '../category/category.model.js'
import Comment from '../comments/comments.model.js'

export const existenteEmail = async (email = '') => {
    
    const existeEmail = await User.findOne({ email });

    if(existeEmail){
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existeUsuarioById = async (id = '') => {
    const existeUsuario = await User.findById(id);

    if (!existeUsuario) {
        throw new Error(`El ID ${id} no existe`);
        
    }
}

export const existCategory = async (name = '') =>{
    const existenteCategory = await Category.findOne({ name });

    if(existenteCategory){
        throw new Error(` ${ name } already exists in db`);
    }
}

export const existPublication = async (id = '') => {
    const existPublication = await Publication.findById(id);
    if (!existCategory) {
        throw new Error(`The id ${id} doesn't exist in db`)
    }
}

export const existCommit = async (id = '') => {
    const existComment = await Comment.findById(id);

    if (!existComment) {
        throw new Error (`The id ${id} does not exist in db`)
    }
}