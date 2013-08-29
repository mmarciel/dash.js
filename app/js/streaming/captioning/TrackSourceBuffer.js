/*
 * The copyright in this software is being made available under the BSD License, included below. This software may be subject to other third party and contributor rights, including patent rights, and no such rights are granted under this license.
 *
 * Copyright (c) 2013, Akamai Technologies
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
 * •  Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * •  Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * •  Neither the name of the Digital Primates nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS “AS IS” AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
var TrackSourceBuffer = function () {

    var video,
        eventBus,
        data,
        mimeType,
        getParser = function() {
            var parser;

            if (mimeType === "text/vtt") {
                parser = new VTTParser();
            }

            return parser;
        },
        getTrackHandler = function () {
            return new TextTrackHandler();
        };


    return {

        initialize: function (type, bufferController, bus) {
            eventBus = bus;
            mimeType = type;
            video = bufferController.getVideoModel().getElement();
            data = bufferController.getData();
        },
        append: function (bytes) {
            getParser().parse(String.fromCharCode.apply(null, new Uint16Array(bytes))).then(
                function(result)
                {
                    var label = data.Representation_asArray[0].id,
                        lang = data.lang;

                    getTrackHandler().addTextTrack(video, result, label, lang, true).then(
                        function(track)
                        {
                            eventBus.dispatchEvent({type:"updateend"});
                        }
                    );
                }
            );
        },
        addEventListener: function (type, listener, useCapture) {
            eventBus.addEventListener(type, listener, useCapture);
        },

        removeEventListener: function (type, listener, useCapture) {
            eventBus.removeEventListener(type, listener, useCapture);
        }
    };
};