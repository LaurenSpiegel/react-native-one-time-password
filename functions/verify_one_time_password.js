const admin = require('firebase-admin');


module.exports = (req, res) => {
    if(!req.body.phone || !req.body.code){
        return res.status(422).send({ error: 'Phone and code must be provided '});
    }

    const phone = String(req.body.phone).replace(/[^\d]/g, '');
    const code = Number.parseInt(req.body.code);

    admin.auth().getUser(phone)
        .then(() => {
            const ref = admin.database().ref(`users/${phone}`);
            return ref.on('value', snapshot => {
                // turn off event listener
                ref.off();
                const user = snapshot.val();
                if(user.code !== code || !user.codeValid){
                    console.log('Code sent by user: ', code)
                    console.log('Code we have saved: ', user.code)
                    console.log('Is code valid: ', user.codeValid)
                    return res.status(422).send({ error: 'Code not valid' })
                }
                ref.update({ codeValid: false });
                admin.auth().createCustomToken(phone)
                    .then(token => {
                        return res.send({ token });
                    })
                    .catch(err => {
                        console.log('Error creating token: ', err)
                        return res.status(422).send({ error: err });
                    })
            })

        })
        .catch(err => {
            console.log('Error getting user: ', err);
            return res.status(422).send({ error: err });
        })

}