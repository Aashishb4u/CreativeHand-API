const express = require('express');
const contactRoute = require('./contact.route');
const profileRoute = require('./profile.route');
const blogRoute = require('./blog.route');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/profile',
        route: profileRoute,
    },
    {
        path: '/blog',
        route: blogRoute,
    },
    {
        path: '/contact',
        route: contactRoute,
    }
];


defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
