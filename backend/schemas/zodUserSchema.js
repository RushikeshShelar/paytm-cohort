const zod = require("zod");

const signUpSchema = zod.object({
    username: zod.string().min(6).max(30),
    password: zod.string().min(8),
    email: zod.string().email(),
    firstName: zod.string().max(50),
    lastName: zod.string().max(50),
})


const signInSchema = zod.object({
    username: zod.string().min(6).max(30),
    password: zod.string().min(8),
});

const updateSchema = zod.object({
    username: zod.string().min(6).max(30).optional(),
    firstName: zod.string().max(50).optional(),
    lastName: zod.string().max(50).optional(),
})

module.exports = {
    signUpSchema,
    signInSchema,
    updateSchema
}