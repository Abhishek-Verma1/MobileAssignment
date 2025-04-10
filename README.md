# Tic-Tac-Toe game developed in React Native
This project has significant potential for improvement:- 
- We can break the project into more UI tool kit and functional ( or modular) components to enhance maintainability and readability and reduce the complexity.
- There's also room to optimize performance further and minimize Redux data storage for better efficiency.
- We need to integrate HashiCorp Vault Integration in React and not advisable to keep environemnrt variable locally in the code.
- We also need to work on adding the security layer(for token and other data) in this project.
- Labels and messages need to be localised and can do data loading and api failure handling in a better way.
- Addded TODO: in the files where we have most scope of imrprovement.


## How to run this project

### `Full React Native Setup via Terminal (iOS + Android)`

### `1. Install Dependencies (Mininim node version should be 18)`
npm install or yarn install


### `2. Start Metro Bundler`
npm start npx react-native start


### `3. iOS Setup`
cd ios
pod install
cd ..

### `4. Run App (iOS)`
npx react-native run-ios

### `5. Run App (Android)`
npx react-native run-android
