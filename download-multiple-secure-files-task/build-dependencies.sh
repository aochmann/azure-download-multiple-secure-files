cp package.json ./_build
cp -r ./Dependencies ./_build

cd _build

npm install --production

cd ..

rm -rf ./_build/package.json
rm -rf ./_build/package-lock.json
rm -rf ./_build/Dependencies