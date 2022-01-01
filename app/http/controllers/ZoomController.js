// const thenrequest = require('then-request');
const jwt = require('jsonwebtoken')
const rp = require('request-promise')
const getCid = require('../../../helpers/getCid')
const Message = require('../../models/Message')
const Notification = require('../../models/Notification')
const Thread = require('../../models/Thread')
const User = require('../../models/User')

exports.createMeetingLink = async (req, res) => {

    const token = req.headers.authorization

    const { threadId } = req.body

    if (!token) return res.status(401).json({ type: 'error', msg: 'You are not allowed to do this action' })

    try {

        const data = jwt.verify(token, process.env.APP_SECRET);

        const user = await User.findOne({ _id: data.id })

        if (user) {

            var zoom_key = '760gaKdERTK5Plq7-8cSLg';
            var zoom_sec = 'zOtzkd0uVjReXnHVKybKJSJjqSOIhH7F2xE9';

            const thread = await Thread.findOne({
                _id: threadId,
                members: { $in: [user._id] },
            })

            if (thread) {

                const payload = {
                    iss: zoom_key,
                    exp: ((new Date()).getTime() + 5000)
                };

                //Automatically creates header, and returns JWT
                const zoomToken = jwt.sign(payload, zoom_sec);

                // var createUsersOptions = {
                //     method: "POST",
                //     uri: "https://api.zoom.us/v2/users",
                //     body: {
                //         "action": "custCreate",
                //         "user_info": {
                //           "email":  user.email,
                //           "type": 1,
                //           "first_name":  user.first_name,
                //           "last_name":  user.last_name
                //         }
                //     },
                //     // auth: {
                //     //     bearer: zoomToken
                //     // },
                //     headers: {'content-type': 'application/json', authorization: `Bearer ${zoomToken}`}, 
                //     json: true //Parse the JSON string in the response
                // };


                // const userResponse = await rp(createUsersOptions)

                // console.log('Zoom new user: ',userResponse)
                const email = 'dev.mostafiz@gmail.com'
                var createMeetingOptions = {
                    method: "POST",
                    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
                    body: {
                        topic: "Israpoly Conference",
                        type: 1,
                        settings: {
                            host_video: "false",
                            participant_video: "false"
                        }
                    },
                    auth: {
                        bearer: zoomToken
                    },
                    headers: {
                        "User-Agent": "Zoom-api-Jwt-Request",
                        "content-type": "application/json"
                    },
                    json: true //Parse the JSON string in the response
                };

                const response = await rp(createMeetingOptions)

                console.log('response.join_url: ', response)

                if (response) {

                    const receiver = thread.members.find(mbr => mbr.toString() != user._id.toString())

                    const rcvUser = await User.findById(receiver)

                    const msg = new Message()
                    msg.cid = getCid()
                    msg.thread = thread._id
                    msg.members = thread.members
                    msg.sender = user._id
                    msg.receiver = receiver
                    msg.text = 'Let\'s make a zoom conference.'
                    msg.zoom = {
                        id: response.id,
                        uuid: response.uuid,
                        host_id: response.host_id,
                        host_email: response.host_email,
                        start_url: response.start_url,
                        join_url: response.join_url,
                        password: response.password,
                        encrypted_password: response.encrypted_password,
                        status: response.status,

                    }
                    msg.type = 'zoomMeeting'
                    await msg.save()

                    const not = new Notification()
                    not.cid = getCid()
                    not.sender = user._id
                    not.user = receiver
                    not.text = 'Let\'s make a zoom conference.'
                    not.link = `/${rcvUser.dashboard}/messages?thread=${thread._id}`
                    not.icon = 'video-camera'
                    await not.save()

                    console.log('Conferance Msg: ', msg)

                    return res.json({ status: 'success', message: msg });
                }

            }


            //   return res.json({meeting: res});

        }



    } catch (error) {
        console.log('Error: ', error.message)
        return res.json({ status: 'error', msg: error.message })
    }
}