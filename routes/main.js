const router = require('express').Router();
const routeName = '/';

//Users ROUTE
router.get('/version', require('../apis/version'));
router.get('/health', require('../apis/health'));


module.exports = { routeName, router };
