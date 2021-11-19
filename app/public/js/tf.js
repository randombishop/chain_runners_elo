'use strict';

var loadNetwork = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(styleName) {
        var keras_model, keras_model_meta, buffer, network;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        if (!(lastStyleName === styleName)) {
                            _context.next = 2;
                            break;
                        }

                        return _context.abrupt('return', lastNetwork);

                    case 2:
                        _context.next = 4;
                        return loadJSON('models/' + styleName + '.json');

                    case 4:
                        keras_model = _context.sent;
                        _context.next = 7;
                        return loadJSON('models/' + styleName + '_metadata.json');

                    case 7:
                        keras_model_meta = _context.sent;
                        _context.next = 10;
                        return loadBuffer('models/' + styleName + '_weights.buf', { progressContainer: document.querySelector('.progress') });

                    case 10:
                        buffer = _context.sent;
                        network = import_keras_network(keras_model, keras_model_meta, buffer);


                        lastStyleName = styleName;
                        lastNetwork = network;
                        return _context.abrupt('return', network);

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function loadNetwork(_x3) {
        return _ref.apply(this, arguments);
    };
}();

var stylize = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(src_or_imdata) {
        var styleName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : style;
        var showed_image = arguments[2];
        var download, img, im, dat, image, demoHeight, demoWidth, scale, network, compiled;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:

                        if (src_or_imdata === 'last') src_or_imdata = last;
                        if (!src_or_imdata) src_or_imdata = '/img/3.jpg';



                        last = src_or_imdata;

                        kill_title();

                        if (!(typeof src_or_imdata === 'string')) {
                            _context2.next = 15;
                            break;
                        }

                        img = new Image();

                        img.src = src_or_imdata;
                        _context2.next = 12;
                        return new Promise(function (e) {
                            return img.onload = e;
                        });

                    case 12:
                        im = imdata(img);
                        _context2.next = 16;
                        break;

                    case 15:
                        im = src_or_imdata;

                    case 16:
                        dat = new Float32Array(im.data);
                        image = ndarray(dat, [im.height, im.width, 4]).hi(null, null, 3).transpose(1, 0, 2).step(1, -1, 1);

                        demoHeight = document.querySelector('.demo').offsetHeight ;
                        demoWidth = innerWidth;
                        scale = Math.min(demoWidth / im.width, demoHeight / im.height);


                        canvas.width = im.width * scale;
                        canvas.height = im.height * scale;new Tensor(gl, image).show({ scale: 1 / 255 });

                        if (showed_image) showed_image();

                        if (!lastCompiledNetwork) {
                            _context2.next = 27;
                            break;
                        }

                        _context2.next = 27;
                        return destroy(gl, lastCompiledNetwork);

                    case 27:
                        _context2.next = 29;
                        return loadNetwork(styleName);

                    case 29:
                        network = _context2.sent;
                        _context2.next = 32;
                        return compile(gl, network, {
                            main_input: image,
                            layerPause: false,
                            progressContainer: document.querySelector('.progress')
                        });

                    case 32:
                        compiled = _context2.sent;
                        lastCompiledNetwork = compiled;
                        _context2.next = 36;
                        return run(gl, compiled, { main_input: image, layerPause: false });

                    case 36:
                        C = compiled;
                        // C.info['batchnormalization_16+activation_11'].output.read()
                        compiled.info['batchnormalization_16+activation_11'].output.show({ scale: 150 / 255, offset: 0.5 });
                        window.TF_GLOBAL_POINTER.callback() ;

                    case 40:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function stylize(_x4) {
        return _ref2.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var canvas = document.getElementById('stylize-canvas');
var gl = TF.createGL(canvas),
    OutputTensor = TF.OutputTensor,
    Tensor = TF.Tensor,
    InPlaceTensor = TF.InPlaceTensor;

var C;

function imdata(img) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.width = img.width || img.videoWidth;
    canvas.height = img.height || img.videoHeight;

    var MAXDIM = 1200;
    if (canvas.width > MAXDIM) {
        canvas.height = MAXDIM / canvas.width * canvas.height;
        canvas.width = MAXDIM;
    }

    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    return context.getImageData(0, 0, canvas.width, canvas.height);
}

function array2url(array) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var scale = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 255;

    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var imdata = context.createImageData(array.shape[0], array.shape[1]);
    for (var i = 0; i < imdata.width; i++) {
        for (var j = 0; j < imdata.height; j++) {
            imdata.data[(i + j * imdata.width) * 4] = offset + array.get(i, j, 0) * scale;
            imdata.data[(i + j * imdata.width) * 4 + 1] = offset + array.get(i, j, 1) * scale;
            imdata.data[(i + j * imdata.width) * 4 + 2] = offset + array.get(i, j, 2) * scale;
            imdata.data[(i + j * imdata.width) * 4 + 3] = 255;
        }
    }
    canvas.width = imdata.width;
    canvas.height = imdata.height;
    context.putImageData(imdata, 0, 0);
    return canvas.toDataURL();
}

function kill_title() {
    var titleel = document.querySelector('.canvas-wrap.title');
    if (titleel) titleel.parentElement.removeChild(titleel);
}

var style = '';

var last = void 0;

var lastStyleName = void 0,
    lastNetwork = void 0;


var lastCompiledNetwork = void 0;

function formatNumber(number) {
    number = String(number).split('.');
    return number[0].replace(/(?=(?:\d{3})+$)(?!\b)/g, ',') + (number[1] ? '.' + number[1] : '');
}

window.TF_GLOBAL_POINTER = {} ;



