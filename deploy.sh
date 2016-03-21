#!/bin/bash

NAME='sm'
USER='root'
TARGZ_NAME="$NAME.tar.gz"
DIR="/home/$NAME"

if [ -z "$1" ]; then
  echo 'Usage: deploy HOSTNAME'
  exit 0
else
  HOSTNAME=$1
fi

URL="http://$HOSTNAME"
REMOTE="$USER@$HOSTNAME"

meteor build --directory ../dep/
cd ../dep
tar -cvzf $TARGZ_NAME ./bundle/*

# if you also have mobile version add server option:
# meteor build /tmp/ --server $URL

ssh $REMOTE "mkdir -p $DIR"

scp $TARGZ_NAME $REMOTE:$DIR

CMD="
cd $DIR && tar xfz $TARGZ_NAME
rm -rf $DIR/bundle/programs/server/npm/npm-bcrypt
cd $DIR/bundle/programs/server && npm install --production && npm install bcrypt
mkdir -p $DIR/bundle/tmp $DIR/bundle/public
cd $DIR && touch bundle/tmp/restart.txt
"

ssh $REMOTE "$CMD"
