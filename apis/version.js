const v = require('../package.json').version;

module.exports = (req, res) => {
    return res.status(200).send(v);
};