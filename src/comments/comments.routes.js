import { Router } from "express";
import { check } from "express-validator";
import { listMyCommit, updtateCommit, deleteCommit } from "./comments.controller.js";
import { existCommit } from "../helpers/db-validator.js"
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js"

const router = Router();

router.put(
    "/:id",
    [
        validarJWT,
        check("id").custom(existCommit),
        check("comment", "Commit is required").not().isEmpty(),
        check("comment", "The commit must have at least 5 characters").isLength({ min: 5, max: 500  }),
        validarCampos
    ],
    updtateCommit
);

router.get(
    "/",
    [
        validarJWT
    ],
    listMyCommit
);

router.delete(
    "/:id",
    [
        validarJWT,
        check("id").custom(existCommit),
        validarCampos
    ],
    deleteCommit
);

export default router;