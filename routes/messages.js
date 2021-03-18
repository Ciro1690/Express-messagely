const express = require("express");
const router = new express.Router();
const Message = require("../models/message");
const { ensureLoggedIn, ensureCorrectUser } = require("../middleware/auth")

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async (req, res, next) => {
    try {
        let id = req.params.id
        let message = await Message.get(id)
        return res.json({ message: message })
    }
    catch (e) {
        return next(e);
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

router.post('/', ensureCorrectUser, async (req, res, next) => {
    try {
        let message = await Message.create(req.body)
        return res.json({ message: message })
    }
    catch (e) {
        return next(e);
    }
})

/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

router.post('/:id/read', ensureCorrectUser, async (req, res, next) => {
    try {
        let message = await Message.markRead(req.params.id)
        return res.json({ message: message })
    }
    catch (e) {
        return next(e);
    }
})

module.exports = router;