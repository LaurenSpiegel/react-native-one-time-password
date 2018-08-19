const admin = require('firebase-admin');
const twilio =require('./twilio');
const fromPhoneNumber = require('./twilio_config.json').fromPhoneNumber;

module.exports = (req, res) => {
    console.log('Calling function!')
    if(!req.body.phone){
        console.log('No phone!', req.body)
        return res.status(422).send({error: 'You must provide a phone number.'});
    }
    const phone = String(req.body.phone).replace(/[^\d]/g, '');

    admin.auth().getUser(phone)
        .then(userInfo => {
            const code = Math.floor((Math.random() * 8999 + 1000))
            console.log('Got userInfo: ', userInfo);
            return twilio.messages.create({
                body: `Your code is ${code}`,
                to: phone,
                from: fromPhoneNumber
            }, (err) => {
                if(err) {
                    console.log('received error back from twilio: ', err);
                    // for debugging purposes send entire error
                    // later can clean up with nice error message
                    res.status(422).send({error: `Received error from twilio: ${err}`});
                }
                // we cannot save arbitrary data onto the firebase auth user
                // so we create a database entry to store the phone numbers
                // mapped to the codes. by calling .ref, we create the collection
                // users and the entry for the given phone number in that collection
                admin.database().ref(`users/${phone}`)
                    .update({ code: code, codeValid: true }, () => {
                        res.send({ success: true });
                    })
            })

        })
        .catch(err => {
            console.log('Caught error getting user: ', err);
            return res.status(422).send({ error: err });
        })
}