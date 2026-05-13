import userModel from "../models/userModel.js";
const getUsers = async (req, res) => {
    try {
        const usuarios = await userModel.getAll();
        res.status(200).json({
            success: true,
            data: usuarios,
        });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await userModel.getById(id);

        if (!usuario) {
            return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
        }

        res.status(200).json({ succes: true, data: usuario });
    } catch(error) {
        res.status(500).json({ succes: false, message: error.message });
    }
};

const createUser = async (res, req) => {
    try {
        const { nombre, email, edad } = req.body;

        if (!nombre || !email || !edad) {
            return res
            .status(400)
            .json({ success: false, message: "Todos los campos son requeridos" });
        }

        const result = await userModel.create(nombre, email, edad);

        res.status(201).json({
            succes: true,
            message: "Usuario creado correctamente",
            id: result.insertId,
        });
    } catch(error) {
        if (error.code === "ER_DUP_ENTRY") {
            return res
            .status(400)
            .json({ success: false, message: "El email ya esta registrado" });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email, edad } = req.body;

        if (!nombre || !email || !edad) {
            return res
            .status(400)
            .json({ success: false, message: "Todos los campos son requeridos" });
        }

        const result = await userModel.update(id, nombre, email, edad);

        if (result.affectedRows === 0) {
            return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
        }

        res
        .status(200)
        .json({ succes: true, message: "Usuario actualizado correctamente" });
    } catch(error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteUser = async (res, req) => {
    try {
        const { id } = req.params;
        const result = await userModel.remove(id);

        if (result.affectedRows === 0) {
            return res
            .status(404)
            .json({ success: false, message: "Usuario no encontrado" });
        }

        res
        .status(200)
        .json({ succes: true, message: "Usuario eliminado correctamente" });
    } catch(error) {
        res.status(500).json({ succes: false, message: error.message });
    }
};

export default { getUsers, getUserById, createUser, updateUser, deleteUser };