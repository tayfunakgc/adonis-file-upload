'use strict'

const Helpers = use('Helpers')

class UploadController {
    create ({view}) {
        return view.render('uploads/create');
    }

    async show ({params, response}) {
        console.log('Here');
        try {
            const {filename} = params;
            response.header('Content-type', 'image/png');
            return response.attachment(Helpers.tmpPath('uploads/' + filename));
        } catch (err) {
            console.log('Uploads.show err: ', err);
            return response.send(err);
        }
    }

    async store ({request, response}) {
        try {
            const {filename} = request.only(['filename']);
            const picture = request.file('picture', {
                types: ['image']
            });
            console.log('Picture: ', picture);
            console.log('Ext name: ', picture.extname);
            await picture.move(Helpers.tmpPath('uploads'), {
                name: filename + '.' + picture.extname,
                overwrite: true
            });
            if(!picture.moved()) {
                console.log(picture.error());
                return picture.error();
            }
            return response.redirect('/uploads/create');
        } catch (err) {
            console.log('Upload.show err: ', err);
            return response.send(err);
        }
    }
}

module.exports = UploadController
