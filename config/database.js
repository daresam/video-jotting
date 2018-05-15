if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mongodb://root:password@ds225010.mlab.com:25010/video-jot-prod'
    }
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost:27017/videojotting'
    }
}