// Mythium Archive: https://archive.org/details/mythium/

jQuery(function ($) {
    'use strict'
    var supportsAudio = !!document.createElement('audio').canPlayType;
    if (supportsAudio) {
        // initialize plyr
        var player = new Plyr('#audio1', {
            controls: [
                'restart',
                'play',
                'progress',
                'current-time',
                'duration',
                'mute',
                'volume',
                'download'
            ]
        });
        // initialize playlist and controls
        var index = 0,
            playing = false,
            mediaPath = 'https://raw.githubusercontent.com/namnyang/html_portfolio/main/music_player/music/',
            extension = '',
            tracks = [{
                "track": 1,
                "name": "Danmoo - Be better",
                "duration": "2:30",
                "file": "1"
            }, {
                "track": 2,
                "name": "Danmoo - Keep running",
                "duration": "2:54",
                "file": "2"
            }, {
                "track": 3,
                "name": "Danmoo - Under the stars",
                "duration": "3:16",
                "file": "3"
            }, {
                "track": 4,
                "name": "Danmoo - Track 3",
                "duration": "2:57",
                "file": "4"
            }, {
                "track": 5,
                "name": "Danmoo - Track 1",
                "duration": "3:07",
                "file": "5"
            }, {
                "track": 6,
                "name": "Danmoo - Good thing",
                "duration": "2:54",
                "file": "6"
            }, {
                "track": 7,
                "name": "Danmoo - Like a movie",
                "duration": "2:56",
                "file": "7"
            }
            // , {
            //     "track": 8,
            //     "name": "Clodus - Joakim Karud",
            //     "duration": "5:26",
            //     "file": "8"
            // }, {
            //     "track": 9,
            //     "name": "Evening Train - Pold",
            //     "duration": "5:46",
            //     "file": "9"
            // }, {
            //     "track": 10,
            //     "name": "Stay Around - THBD",
            //     "duration": "5:25",
            //     "file": "10"
            // }, {
            //     "track": 11,
            //     "name": "Fresh Start - Joakim Karud",
            //     "duration": "5:53",
            //     "file": "11"
            // }, {
            //     "track": 12,
            //     "name": "You Make Me - KSMK X Dizaro",
            //     "duration": "4:40",
            //     "file": "12"
            // }
        ],
            buildPlaylist = $.each(tracks, function(key, value) {
                var trackNumber = value.track,
                    trackName = value.name,
                    trackDuration = value.duration;
                if (trackNumber.toString().length === 1) {
                    trackNumber = '0' + trackNumber;
                }
                $('#plList').append('<li> \
                    <div class="plItem"> \
                        <span class="plNum">' + trackNumber + '.</span> \
                        <span class="plTitle">' + trackName + '</span> \
                        <span class="plLength">' + trackDuration + '</span> \
                    </div> \
                </li>');
            }),
            trackCount = tracks.length,
            npAction = $('#npAction'),
            npTitle = $('#npTitle'),
            audio = $('#audio1').on('play', function () {
                playing = true;
                npAction.text('Now Playing...');
            }).on('pause', function () {
                playing = false;
                npAction.text('Paused...');
            }).on('ended', function () {
                npAction.text('Paused...');
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    audio.play();
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }).get(0),
            btnPrev = $('#btnPrev').on('click', function () {
                if ((index - 1) > -1) {
                    index--;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            btnNext = $('#btnNext').on('click', function () {
                if ((index + 1) < trackCount) {
                    index++;
                    loadTrack(index);
                    if (playing) {
                        audio.play();
                    }
                } else {
                    audio.pause();
                    index = 0;
                    loadTrack(index);
                }
            }),
            li = $('#plList li').on('click', function () {
                var id = parseInt($(this).index());
                if (id !== index) {
                    playTrack(id);
                }
            }),
            loadTrack = function (id) {
                $('.plSel').removeClass('plSel');
                $('#plList li:eq(' + id + ')').addClass('plSel');
                npTitle.text(tracks[id].name);
                index = id;
                audio.src = mediaPath + tracks[id].file + extension;
                updateDownload(id, audio.src);
            },
            updateDownload = function (id, source) {
                player.on('loadedmetadata', function () {
                    $('a[data-plyr="download"]').attr('href', source);
                });
            },
            playTrack = function (id) {
                loadTrack(id);
                audio.play();
            };
        extension = audio.canPlayType('audio/mpeg') ? '.mp3' : audio.canPlayType('audio/ogg') ? '.ogg' : '';
        loadTrack(index);
    } else {
        // no audio support
        $('.column').addClass('hidden');
        var noSupport = $('#audio1').text();
        $('.container').append('<p class="no-support">' + noSupport + '</p>');
    }
});