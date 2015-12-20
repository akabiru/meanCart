var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
	profile : {
		username : {
			type : String,
			required : true,
			lowercase : true
		},
		picture : {
			type : String,
			required : true,
			match : /^http:\/\//i
		}
	},
	data : {
		oauth : {
			type : String,
			required : true
		},
		cart : [{
			product : {
				type : mongoose.Schema.Types.ObjectId
			},
			quantity : {
				type : Number,
				default : 1,
				mmin : 1
			}
		}]
	}
});

// Activate virtuals
module.exports.set( 'toObject', { virtuals : true } );
module.exports.set( 'toJSON', { virtuals :  true } );
