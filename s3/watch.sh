#!/bin/sh

watchify resources/public/js/login.js -d -o resources/public/js/login-bundle.js -v &
watchify resources/public/js/index.js -d -o resources/public/js/index-bundle.js -v &
watchify resources/public/js/edit.js -d -o resources/public/js/edit-bundle.js -v &
watchify resources/public/js/entry.js -d -o resources/public/js/entry-bundle.js -v &
watchify resources/public/js/drafts.js -d -o resources/public/js/drafts-bundle.js -v &

