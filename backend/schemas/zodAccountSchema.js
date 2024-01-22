const zod = require("zod");

const transferBody = zod.object({
    to: zod.string(),
    amount: zod.number()
});

module.exports = {
    transferBody
}