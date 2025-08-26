npm run build

rm -rf ../ulti-insights-backend/src/main/resources/static

cp -r ./build/ ../ulti-insights-backend/src/main/resources/static
