const admin = require('firebase-admin');


module.exports = (req, res) => {
    if(!req.body.phone){
        return res.status(422).send({error: 'Bad Input'});
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '');

    // we create user with the phone number as the unique identifier
    // this means user will have account with each phone number and only
    // one account per phone number
    admin.auth().createUser({ uid: phone })
        .then(user => {
            return res.send(user);
        })
        .catch(err => {
            return res.status(422).send({ error: err });
        })
    return undefined;
}