const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');

const permissionSchema = Schema({
    name: { type: String, required: true },
    label: { type: String, required: true },
}, { timestamps: true, toJSON: { virtuals: true } });

permissionSchema.plugin(mongoosePaginate);



module.exports = mongoose.model('Permission', permissionSchema);