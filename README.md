# frankenstein

A walking skeleton of a system-wide automated test with nodejs, zombie.js, ExpressJs, Mocha...

# mandatory ASCII art
                 .-""-"-""-.
                /           \
                | .--.-.--. |
                |` >       `|
                | <         |
                (__..---..__)
               (`|\o_/ \_o/|`)
                \(    >    )/
              [>=|   ---   |=<]
                 \__\   /__/
                     '-'

# requirements

- nodejs
- npm

## windows

you also need:
- python for windows, version >= 2.5 < 3.0.0 . >= 3.0.0 won't work (node-gyp require >= 2.5 < 3.0.0).

# setup

If not already done, install the latest version of node and npm, and then:
```
npm install
```

# running the tests

## linux

Check if mocha is installed globally:
```
mocha -V
```

If not, you may install it like so:
```
npm install -g mocha 
```

To run the tests without installing mocha globally:
```make
make tests
```

...or simply, if you installed mocha globally:
```
mocha
```

...and if you're cool enough:
```
mocha -R nyan
```

## windows

I haven't found a sweet way to run mocha tests on windows, but that works:
```
>node node_modules\mocha\bin\mocha
```

cool kids use:
```
>node node_modules\mocha\bin\mocha -R nyan
```
